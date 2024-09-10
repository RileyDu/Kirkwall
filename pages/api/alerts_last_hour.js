import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const query = `
    SELECT metric, timestamp
    FROM alerts
    WHERE timestamp > $1
    ORDER BY timestamp DESC
  `;

  try {
    const result = await client.query(query, [oneHourAgo]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts from the last hour:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
}
