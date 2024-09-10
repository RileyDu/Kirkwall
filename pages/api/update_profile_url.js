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
  const { firstname, lastname, email, phone, company, thresh_kill, profile_url } = req.body;

  const query = `
    UPDATE admin
    SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, thresh_kill = $6, profile_url = $7
    WHERE id = $8
    RETURNING *`;

  try {
    const result = await client.query(query, [
      firstname, lastname, email, phone, company, thresh_kill, profile_url, id
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile URL:', error);
    res.status(500).json({ error: 'An error occurred while updating the profile URL' });
  }
}
