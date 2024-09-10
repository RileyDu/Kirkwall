import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const userMetrics = req.query.userMetrics; // Extract the userMetrics array from the query parameters
  console.log('request received to get alerts per user metric:', userMetrics);
  
  if (!Array.isArray(userMetrics)) {
    return res.status(400).json({ error: 'userMetrics should be an array of metrics' });
  }

  const filter = userMetrics.map((metric, index) => `metric = $${index + 1}`).join(' OR ');

  const query = `
    SELECT timestamp, metric, id, message 
    FROM alerts
    WHERE ${filter}
    ORDER BY id DESC
    LIMIT 100
  `;

  try {
    const result = await client.query(query, userMetrics); // Pass userMetrics as parameterized values
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts per user metric:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
}
