import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { deveui, limit = 10 } = req.query;
  console.log('request received to get ImpriMed data:', deveui, limit);
  const query = `
    SELECT rctemp, humidity, publishedat, deveui 
    FROM rivercity_data 
    WHERE deveui = $1 
    ORDER BY publishedat DESC 
    LIMIT $2`;
  
  try {
    const result = await client.query(query, [deveui, limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching ImpriMed data:', error);
    res.status(500).json({ error: 'An error occurred while fetching ImpriMed data' });
  }
}
