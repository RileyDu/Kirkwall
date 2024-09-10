import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { id } = req.params;
  console.log('request received to delete alert:', id);
  try {
    await client.query('DELETE FROM alerts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'An error occurred while deleting alert' });
  }
}
