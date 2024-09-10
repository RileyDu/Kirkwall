import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { id } = req.query;
  const { metric, timeperiod, type, location, hidden } = req.body;

  const query = `
    UPDATE charts SET metric = $1, timeperiod = $2, type = $3, location = $4, hidden = $5
    WHERE id = $6
    RETURNING *`;

  try {
    const result = await client.query(query, [metric, timeperiod, type, location, hidden, id]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating chart:', error);
    res.status(500).json({ error: 'An error occurred while updating chart' });
  }
}
