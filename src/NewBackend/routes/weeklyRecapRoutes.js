// routes/weeklyRecapRoutes.js
import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import openai from '../openaiClient.js';  // Assuming you have the same OpenAI client setup

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Weekly Recap Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Weekly Recap Routes: Connection error', err.stack));

// POST /api/weekly-recap - Add weekly recap data
router.post('/', async (req, res) => {
  const { user_email, metric, week_start_date, high, low, avg, alert_count } =
    req.body;

  try {
    // Insert the new weekly recap data into the database
    const result = await client.query(
      `INSERT INTO Weekly_Recap (user_email, metric, week_start_date, high, low, avg, alert_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [user_email, metric, week_start_date, high, low, avg, alert_count]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Weekly Recap Routes: Error inserting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while inserting weekly recap data' });
  }
});

// POST /api/weekly-recap/analyze - Analyze weekly recap data
router.post('/analyze', async (req, res) => {
  const { recapData, recentAlerts, userEmail } = req.body;

  if (!recapData || !userEmail) {
    return res.status(400).json({ error: 'recapData and userEmail are required' });
  }

  try {
    const analysisResult = await analyzeWeeklyRecapData(recapData, recentAlerts, userEmail);
    
    // First ensure valid JSON structure
    const structuredResult = ensureValidJsonStructure(analysisResult);
    
    // Then sanitize any special characters
    const sanitizedResponse = sanitizeJsonResponse(structuredResult);
    
    res.status(200).json(sanitizedResponse);
  } catch (error) {
    console.error('Weekly Recap Routes: Error analyzing data:', error);
    res.status(500).json({ error: 'An error occurred while analyzing weekly recap data' });
  }
});

/**
 * Analyzes weekly recap data using OpenAI
 * @param {Object} recapData - The weekly recap data for analysis
 * @param {Array} recentAlerts - Recent alerts related to the data
 * @param {string} userEmail - User's email for context
 * @returns {Object} - Analysis results from OpenAI
 */
async function analyzeWeeklyRecapData(recapData, recentAlerts, userEmail) {
  console.log(`Weekly Recap Routes: Analyzing data for user: ${userEmail}`);

  // Format data for better AI readability
  const formattedData = {
    recapData: recapData,
    alerts: recentAlerts || []
  };

  const systemPrompt = `
    You are a data analysis assistant specializing in agricultural and environmental sensor data. Your task is to:

    1. Analyze the provided weekly recap data from various sensors like temperature, humidity, soil moisture, etc.
    2. Identify significant patterns, trends, or anomalies in the data
    3. Correlate any alerts with the sensor readings
    4. Provide actionable insights based on the analysis

    The data includes:
    - Weekly high, average, and low readings for each sensor
    - Any alerts triggered during the week
    
    Format your response as a JSON object with the following structure:
    {
      "SUMMARY": "A brief overview of the most important findings (2-3 sentences)",
      "KEY_INSIGHTS": [
        "Insight 1",
        "Insight 2",
        "Insight 3"
      ],
      "RECOMMENDATIONS": [
        "Recommendation 1",
        "Recommendation 2",
        "Recommendation 3"
      ],
      "RISK_AREAS": [
        "Risk 1",
        "Risk 2"
      ]
    }

    Use plain language accessible to farmers and agricultural managers. Focus on actionable insights rather than just describing the data.
    
    IMPORTANT: Your response MUST be valid JSON without any special characters that could break JSON parsing.
  `;

  const messages = [
    { role: 'system', content: systemPrompt },
    { 
      role: 'user', 
      content: `Please analyze this weekly sensor data and alerts: ${JSON.stringify(formattedData, null, 2)}` 
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // Using the same model as in nlquery, change as needed
    messages: messages,
    max_tokens: 750
  });

  const analysis = completion.choices[0].message.content;
  
  return { analysis };
}

// POST /api/weekly-recap/followup - Handle follow-up questions about recap data
router.post('/followup', async (req, res) => {
  const { lastResponse, question, userEmail, recapData, recentAlerts } = req.body;

  if (!userEmail || !question) {
    return res.status(400).json({ error: 'userEmail and question are required' });
  }

  try {
    const systemPrompt = `
      You are an agricultural data analysis assistant specializing in sensor data interpretation. 
      You're currently analyzing weekly recap data for a farm or agricultural operation.
      
      You have access to:
      1. The weekly recap data showing high, average, and low values for various sensors
      2. Recent alerts that were triggered during the week
      3. The user's previous question and your last response
      
      Guidelines for your responses:
      - Provide clear, actionable insights based on the data
      - When discussing trends, explain potential implications for crops or operations
      - Use plain, understandable language without jargon
      - Keep responses focused and relevant to the agricultural context
      - If you don't have enough information to answer a question, say so clearly
      
      The agricultural sensors may include temperature, humidity, soil moisture, leaf wetness, 
      rainfall, and wind speed readings. These are critical metrics for farming operations.
      
      IMPORTANT: Your response MUST be plain text without any JSON, Markdown, or special characters. Please give your response in natual language.
    `;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'assistant', content: lastResponse },
      { role: 'user', content: question }
    ];

    // Add context data as a separate message
    const contextData = {
      recapData: recapData,
      alerts: recentAlerts || []
    };
    
    messages.push({ 
      role: 'system', 
      content: `For reference, here is the complete data:\n${JSON.stringify(contextData, null, 2)}` 
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the same model as in nlquery, change as needed
      messages: messages,
      max_tokens: 1000
    });

    const response = completion.choices[0].message.content;
    
    // Ensure valid JSON response without special characters
    const sanitizedResponse = sanitizeJsonResponse({ response });
    return res.status(200).json(sanitizedResponse);
  } catch (error) {
    console.error('Weekly Recap Routes: Error processing follow-up question:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * Ensures the AI response is properly formatted as valid JSON
 * @param {Object} analysisResult - The analysis result from OpenAI
 * @returns {Object} - Properly formatted analysis result
 */
function ensureValidJsonStructure(analysisResult) {
  if (!analysisResult || !analysisResult.analysis) {
    return { analysis: JSON.stringify({
      SUMMARY: "Error: No analysis provided",
      KEY_INSIGHTS: [],
      RECOMMENDATIONS: [],
      RISK_AREAS: []
    })};
  }
  
  let analysis = analysisResult.analysis;
  
  // Try to detect and fix JSON structure issues
  try {
    // Check if it's already valid JSON
    const parsed = JSON.parse(analysis);
    // If it parsed successfully, it's already valid JSON
    return { analysis: JSON.stringify(parsed) };
  } catch (e) {
    // Not valid JSON, try to fix common structure issues
    try {
      // Check if it's formatted in sections but not as JSON
      const hasSections = analysis.includes('SUMMARY:') && 
                          (analysis.includes('KEY INSIGHTS:') || analysis.includes('KEY_INSIGHTS:')) &&
                          analysis.includes('RECOMMENDATIONS:');
      
      if (hasSections) {
        // Extract each section using regex
        const summaryMatch = analysis.match(/SUMMARY:?\s*(.*?)(?=(?:KEY[_ ]INSIGHTS:?|RECOMMENDATIONS:?|RISK[_ ]AREAS:?|$))/s);
        const insightsMatch = analysis.match(/KEY[_ ]INSIGHTS:?\s*(.*?)(?=(?:RECOMMENDATIONS:?|RISK[_ ]AREAS:?|$))/s);
        const recommendationsMatch = analysis.match(/RECOMMENDATIONS:?\s*(.*?)(?=(?:RISK[_ ]AREAS:?|$))/s);
        const riskAreasMatch = analysis.match(/RISK[_ ]AREAS:?\s*(.*?)(?=$)/s);
        
        // Extract bullet points (works with various bullet formats: -, *, •, 1., etc.)
        const extractBulletPoints = (text) => {
          if (!text) return [];
          
          // Split by common bullet point indicators
          const bulletPoints = text.split(/(?:\r?\n|^)\s*[-•*]|\d+\.\s+/);
          
          // Filter out empty entries and trim
          return bulletPoints
            .map(point => point.trim())
            .filter(point => point.length > 0);
        };
        
        // Build a proper JSON object
        const formattedAnalysis = {
          SUMMARY: summaryMatch ? summaryMatch[1].trim() : "Analysis summary not available",
          KEY_INSIGHTS: insightsMatch ? extractBulletPoints(insightsMatch[1]) : [],
          RECOMMENDATIONS: recommendationsMatch ? extractBulletPoints(recommendationsMatch[1]) : [],
          RISK_AREAS: riskAreasMatch ? extractBulletPoints(riskAreasMatch[1]) : []
        };
        
        // Return properly structured JSON
        return { analysis: JSON.stringify(formattedAnalysis) };
      }
      
      // If all else fails, just wrap the content in quotes to make it valid JSON
      return { analysis: JSON.stringify({ 
        SUMMARY: analysis.substring(0, 200) + (analysis.length > 200 ? "..." : ""),
        KEY_INSIGHTS: ["Analysis not formatted correctly"],
        RECOMMENDATIONS: ["Please try again or contact support"],
        RISK_AREAS: ["Data parsing error"]
      })};
      
    } catch (structureError) {
      console.error('Error formatting analysis structure:', structureError);
      // Last resort - return the analysis as a simple text string
      return { analysis: JSON.stringify({ 
        SUMMARY: "Error formatting analysis results",
        KEY_INSIGHTS: ["The analysis results couldn't be properly formatted"],
        RECOMMENDATIONS: ["Please try refreshing or contact support"],
        RISK_AREAS: ["Data formatting error"]
      })};
    }
  }
}

/**
 * Sanitizes the response to ensure it's valid JSON without special characters
 * @param {Object} responseObj - The response object to sanitize
 * @returns {Object} - Sanitized response object
 */
function sanitizeJsonResponse(responseObj) {
  // Create a new object to hold the sanitized response
  const sanitized = {};
  
  // Process each key in the response object
  for (const [key, value] of Object.entries(responseObj)) {
    if (typeof value === 'string') {
      try {
        // Check if value is already stringified JSON
        const parsedJson = JSON.parse(value);
        
        // If parsing succeeded, this is already a JSON string
        sanitized[key] = JSON.stringify(parsedJson);
      } catch (e) {
        // Not JSON, so sanitize as a regular string
        // Replace non-ASCII characters and other problematic characters
        sanitized[key] = value
          // Replace special quotes with regular quotes
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          // Replace em and en dashes
          .replace(/[\u2013\u2014]/g, '-')
          // Replace other special characters
          .replace(/[\u2026]/g, '...')
          // Remove control characters
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
          // Remove problematic parentheses in arrays (specific to the error case)
          .replace(/\(\s*"/g, '["')
          .replace(/"\s*\)/g, '"]')
          // Do NOT double escape - this caused issues
          // Just ensure quotes are properly escaped for JSON
          .replace(/(?<!\\)"/g, '\\"');
      }
    } else if (value === null) {
      sanitized[key] = null;
    } else if (typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeJsonResponse(value);
    } else {
      // For numbers, booleans, etc.
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// GET /api/weekly-recap - Get weekly recap data
router.get('/', async (req, res) => {
  const { user_email, week_start_date } = req.query;

  if (!user_email) {
    return res.status(400).json({ error: 'user_email is required' });
  }

  try {
    let query = `SELECT * FROM Weekly_Recap WHERE user_email = $1`;
    let queryParams = [user_email];

    // If a specific week is requested, add it to the query
    if (week_start_date) {
      query += ` AND week_start_date = $2`;
      queryParams.push(week_start_date);
    } else {
      // If no week is specified, get the most recent week's data
      query += ` ORDER BY week_start_date DESC`;
    }

    const result = await client.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No weekly recap data found for the specified criteria',
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Weekly Recap Routes: Error fetching weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weekly recap data' });
  }
});

// GET /api/weekly-recap/weeks - Get all available week start dates
router.get('/weeks', async (req, res) => {
  try {
    const result = await client.query(
      `SELECT DISTINCT week_start_date 
       FROM Weekly_Recap 
       ORDER BY week_start_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Weekly Recap Routes: Error fetching week start dates:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching week start dates' });
  }
});

// DELETE /api/weekly-recap/:id - Delete weekly recap data by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await client.query('DELETE FROM Weekly_Recap WHERE id = $1', [id]);
    res.status(200).json({ message: 'Weekly recap data deleted successfully' });
  } catch (error) {
    console.error('Weekly Recap Routes: Error deleting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting weekly recap data' });
  }
});

export default router;