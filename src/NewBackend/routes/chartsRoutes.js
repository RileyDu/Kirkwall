// routes/chartsRoutes.js

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
  .then(() => console.log('Charts Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Charts Routes: Connection error', err.stack));

// GET /api/charts
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM charts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Charts Routes: Error fetching charts:', error);
    res.status(500).json({ error: 'An error occurred while fetching charts' });
  }
});

// POST /api/charts
router.post('/', async (req, res) => {
  console.log('Charts Routes: Received request to create chart:', req.body);

  const { metric, timeperiod, type, location, hidden } = req.body;

  const query = `
    INSERT INTO charts (metric, timeperiod, type, location, hidden)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;

  try {
    const result = await client.query(query, [
      metric,
      timeperiod,
      type,
      location,
      hidden,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Charts Routes: Error creating chart:', error);
    res.status(500).json({ error: 'An error occurred while creating chart' });
  }
});


// PUT /api/charts/update_chart
router.put('/update_chart', async (req, res) => {
  console.log('Charts Routes: Received request to update chart:', req.body);

  const { id, metric, timeperiod, type, location, hidden } = req.body;

  const query = `
    UPDATE charts SET metric = $1, timeperiod = $2, type = $3, location = $4, hidden = $5
    WHERE id = $6
    RETURNING *`;

  try {
    const result = await client.query(query, [
      metric,
      timeperiod,
      type,
      location,
      hidden,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Charts Routes: Error updating chart:', error);
    res.status(500).json({ error: 'An error occurred while updating chart' });
  }
});

export default router;
