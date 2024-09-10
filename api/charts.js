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
    const result = await client.query('SELECT * FROM charts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ error: 'An error occurred while fetching charts' });
  }
}
