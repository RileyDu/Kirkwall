// routes/mockDataRoutes.js

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
  .then(() => console.log('Mock Data Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Mock Data Routes: Connection error', err.stack));

// GET /api/mockdata
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM fermenteq_data');
    // Return all rows from the fermenteq_data table
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Mock Data Routes: Error fetching data from fermenteq_data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

router.get('/css', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM css_trial');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching data from css_trial:', error);
    res.status(500).json({ error: 'An error occurred while fetching BME280 data' });
  }
});


export default router;
