// routes/naturalLanguageQueryRoutes.js

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
  const { question, userEmail } = req.body;

  // Only one supported question now
  if (
    question !==
    'Give me a summary of all of my readings for the last week.'
  ) {
    return res.status(400).json({ error: 'Invalid or unsupported question.' });
  }

  if (!userEmail) {
    return res.status(400).json({ error: 'User email not provided.' });
  }

  try {
    const result = await startWatchdogChat(userEmail);
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
    // Define system prompt for OpenAI
    const systemPrompt = `
      You are a data analysis assistant. Your task is to:

      Analyze the provided data and determine key insights or patterns.
      Summarize the main trends observed from your analysis.
      Offer actionable tips or recommendations based on those trends.
      Formatting Requirements:

      Return your answer in plain text (no Markdown or special formatting).
      Make the response concise, clear, and easy to parse in a React application.
      Organize your key points in simple sections or bullet points without using any Markdown syntax.
      Additional Instructions:

      If you reference specific data points or statistics, provide them in a readable format (e.g., “Sales increased by 20% this quarter.”).
      Keep your language straightforward and avoid jargon where possible.
      Only include relevant information that addresses the analysis, trends, and tips.
    `;

    // Make sure to pass strings to the OpenAI endpoint
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

    // Respond with the follow-up message
    return res.json({ response: followUpResponse });
  } catch (error) {
    console.error('Natural Language Query Routes: Error processing the follow-up:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * Initiates a watchdog chat session by aggregating data and interacting with OpenAI.
 * @param {string} userEmail - The email of the user initiating the chat.
 * @returns {object} - Contains the initial response from the assistant and the daily aggregated data.
 */
async function startWatchdogChat(userEmail) {
  console.log(`Natural Language Query Routes: Starting watchdog chat for user: ${userEmail}`);

  // Query the last 7 days of aggregated data
  const query = `
    SELECT
      DATE_TRUNC('day', message_timestamp) AS day,
      AVG(temperature) AS avg_temperature,
      MIN(temperature) AS min_temperature,
      MAX(temperature) AS max_temperature,
      AVG(rain_15_min_inches) AS avg_rain,
      MIN(rain_15_min_inches) AS min_rain,
      MAX(rain_15_min_inches) AS max_rain,
      AVG(percent_humidity) AS avg_humidity,
      MIN(percent_humidity) AS min_humidity,
      MAX(percent_humidity) AS max_humidity,
      AVG(wind_speed) AS avg_wind_speed,
      MIN(wind_speed) AS min_wind_speed,
      MAX(wind_speed) AS max_wind_speed,
      AVG(leaf_wetness) AS avg_leaf_wetness,
      MIN(leaf_wetness) AS min_leaf_wetness,
      MAX(leaf_wetness) AS max_leaf_wetness,
      AVG(soil_moisture) AS avg_soil_moisture,
      MIN(soil_moisture) AS min_soil_moisture,
      MAX(soil_moisture) AS max_soil_moisture
    FROM weather_data
    WHERE message_timestamp >= NOW() - INTERVAL '7 DAYS'
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
  for (const dayRow of dailyData) {
    const dayStr = new Date(dayRow.day).toLocaleDateString();
    summaryText += `Date: ${dayStr}\n`;
    summaryText += `  Temperature: Avg: ${dayRow.avg_temp.toFixed(
      2
    )}°F, Min: ${dayRow.min_temp.toFixed(2)}°F, Max: ${dayRow.max_temp.toFixed(
      2
    )}°F\n`;
    summaryText += `  Humidity:    Avg: ${dayRow.avg_hum.toFixed(
      2
    )}%, Min: ${dayRow.min_hum.toFixed(2)}%, Max: ${dayRow.max_hum.toFixed(
      2
    )}%\n\n`;
  }

  const messages = [
    {
      role: 'system',
      content: `
        You are a helpful assistant that knows about watchdog sensor data from the past week.
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
        'User said: "Give me a summary of the data from WatchDog for the last week."',
    },
  ];

  // Call OpenAI to get the initial summary
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

  // Return both the parsed LLM data and the daily aggregator data
  return { response: parsedJson, dailyData };
}

export default router;
