import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import openai from '../openaiClient.js';

// Initialize PostgreSQL client if needed (used in helper function)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Natural Language Query Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Natural Language Query Routes: Connection error', err.stack));

// POST /api/nlquery
router.post('/', async (req, res) => {
  // Check if the question and userEmail are present in the body

  console.log(req.body)
  const { question, userEmail } = req.body;

  if (!question || !userEmail) {
    return res.status(400).json({ error: 'Both question and userEmail are required.' });
  }

  // Only one supported question now
  if (question !== 'Give me a summary of the data from Monnit for the last week.') {
    return res.status(400).json({ error: 'Invalid or unsupported question.' });
  }

  try {
    const result = await startMonnitChat(userEmail);
    // result contains { response: initialResponse, dailyData: [...] }
    res.json(result);
  } catch (error) {
    console.error('Natural Language Query Routes: Error processing the query:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/nlquery/followup
router.post('/followup', async (req, res) => {
  const { lastResponse, question, userEmail, readingsData } = req.body;
  
  if (!userEmail) {
    return res.status(400).json({ error: 'User email not found in token.' });
  }

  try {
    const systemPrompt = `
      You are a data analysis assistant. Your task is to:

      Analyze the provided data from Monnit sensors and determine key insights or patterns.
      Your goal is to:
      - Identify significant trends and anomalies.
      - Provide actionable recommendations based on these insights.
      - Ensure the response is clear, concise, and easy for a user to understand, focusing on the actionable insights.
      - Avoid unnecessary technical jargon, and explain things in simple terms.

      Formatting Requirements:
      - Return your answer in plain text (no Markdown or special formatting).
      - Organize your key points into logical sections (e.g., "Key Insights", "Recommendations").

      If you reference specific data points or statistics, present them clearly (e.g., “Signal strength dropped by 10% in the past 3 days”).
    `;

    const intentResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(lastResponse) },
        { role: 'user', content: question },
        { role: 'user', content: JSON.stringify(readingsData) },
      ],
      max_tokens: 500,
    });

    const followUpResponse = intentResponse.choices[0].message.content;

    return res.json({ response: followUpResponse });
  } catch (error) {
    console.error('Natural Language Query Routes: Error processing the follow-up:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * Initiates a Monnit chat session by aggregating data and interacting with OpenAI.
 * @param {string} userEmail - The email of the user initiating the chat.
 * @returns {object} - Contains the initial response from the assistant and the daily aggregated data.
 */
async function startMonnitChat(userEmail) {
  console.log(`Natural Language Query Routes: Starting Monnit chat for user: ${userEmail}`);

  // Query the last 7 days of aggregated data from the monnit_data_kirkwall table
  const query = `
    SELECT
      DATE_TRUNC('day', last_communication_date) AS day,
      AVG(COALESCE(NULLIF(regexp_replace(signal_strength::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS avg_signal_strength,
      MIN(COALESCE(NULLIF(regexp_replace(signal_strength::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS min_signal_strength,
      MAX(COALESCE(NULLIF(regexp_replace(signal_strength::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS max_signal_strength,
      AVG(COALESCE(NULLIF(regexp_replace(current_reading::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS avg_current_reading,
      MIN(COALESCE(NULLIF(regexp_replace(current_reading::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS min_current_reading,
      MAX(COALESCE(NULLIF(regexp_replace(current_reading::text, '[^0-9.-]', '', 'g'), ''), '0')::float) AS max_current_reading
    FROM monnit_data_kirkwall
    WHERE last_communication_date >= NOW() - INTERVAL '7 DAYS'
    GROUP BY 1
    ORDER BY 1 ASC;
  `;

  const result = await client.query(query);
  if (result.rows.length === 0) {
    throw new Error('No data found in the last 7 days.');
  }

  const dailyData = result.rows;
  let summaryText =
    'Here are the daily aggregated measurements for the past 7 days:\n\n';
  
  // Clean the data and generate the summary
  for (const dayRow of dailyData) {
    const dayStr = new Date(dayRow.day).toLocaleDateString();

    summaryText += `Date: ${dayStr}\n`;
    summaryText += `  Signal Strength: Avg: ${dayRow.avg_signal_strength.toFixed(2)}, 
    Min: ${dayRow.min_signal_strength.toFixed(2)}, Max: ${dayRow.max_signal_strength.toFixed(2)}\n`;

    summaryText += `  Current Reading: Avg: ${dayRow.avg_current_reading.toFixed(2)}, 
    Min: ${dayRow.min_current_reading.toFixed(2)}, Max: ${dayRow.max_current_reading.toFixed(2)}\n\n`;
  }

  const messages = [
    {
      role: 'system',
      content: `
        You are a helpful assistant that knows about Monnit sensor data from the past week.
        The user has the following daily aggregates:
        ${summaryText}

        Return the result in valid JSON. Use the keys "summary" as an example structure:
        {
          "summary": "high-level summary of the data"
        }
        Do not include any extra keys or text outside of valid JSON.
      `,
    },
    {
      role: 'assistant',
      content:
        'User said: "Give me a summary of the data from Monnit for the last week."',
    },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: messages,
    max_tokens: 500,
  });

  const initialResponse = completion.choices[0].message.content;
  let parsedJson;
  try {
    parsedJson = JSON.parse(initialResponse);
    console.log('Natural Language Query Routes: Parsed JSON from LLM:', parsedJson);
  } catch (err) {
    console.error('Natural Language Query Routes: Failed to parse JSON from LLM:', err);
    throw new Error('Invalid JSON from LLM');
  }

  return { response: parsedJson, dailyData };
}



export default router;
