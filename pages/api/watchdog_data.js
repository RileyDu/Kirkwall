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

  let query = 'SELECT * FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  
  if (type === 'temp') {
    query = 'SELECT temp, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  } else if (type === 'hum') {
    query = 'SELECT hum, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  }

  try {
    const result = await client.query(query, [limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching watchdog data:', error);
    res.status(500).json({ error: 'An error occurred while fetching watchdog data' });
  }
}
