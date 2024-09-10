import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  try {
    const result = await client.query('SELECT * FROM thresholds ORDER BY timestamp DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    res.status(500).json({ error: 'An error occurred while fetching thresholds' });
  }
}
