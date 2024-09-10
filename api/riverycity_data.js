import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { limit = 10, type = 'all' } = req.query;
  
  let query = 'SELECT * FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';

  if (type === 'temp') {
    query = 'SELECT rctemp, publishedat FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';
  } else if (type === 'hum') {
    query = 'SELECT humidity, publishedat FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';
  }

  try {
    const result = await client.query(query, ['0080E115054FF0B7', limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching rivercity data:', error);
    res.status(500).json({ error: 'An error occurred while fetching rivercity data' });
  }
}
