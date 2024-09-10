import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { email } = req.body;
  console.log('request received to get admin by email:', email);
  
  try {
    const result = await client.query('SELECT * FROM admin WHERE email = $1', [email]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    res.status(500).json({ error: 'An error occurred while fetching admin' });
  }
}
