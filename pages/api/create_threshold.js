import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { metric, high, low, phone, email, timestamp, thresh_kill, timeframe } = req.body;

  const query = `
    INSERT INTO thresholds (metric, high, low, phone, email, timestamp, thresh_kill, timeframe)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`;

  try {
    const result = await client.query(query, [metric, high, low, phone, email, timestamp, thresh_kill, timeframe]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating threshold:', error);
    res.status(500).json({ error: 'An error occurred while creating threshold' });
  }
}
