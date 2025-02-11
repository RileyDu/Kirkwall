// routes/monnitRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Monnit Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Monnit Routes: Connection error', err.stack));

  
// GET /api/monnit
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM Monnit_data_kirkwall');
    // Return all rows from the fermenteq_data table
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Monnit Routes: Error fetching data from Monnit_data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

export default router;
