import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { metric, message, timestamp } = req.body;

  const query = `
    INSERT INTO alerts (metric, message, timestamp)
    VALUES ($1, $2, $3)
    RETURNING *`;

  try {
    const result = await client.query(query, [metric, message, timestamp]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'An error occurred while creating alert' });
  }
}
