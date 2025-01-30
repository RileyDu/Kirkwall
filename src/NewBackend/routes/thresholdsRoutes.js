// routes/thresholdsRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import { checkThresholds } from '../cron/checkThresholds.js';

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});


client
  .connect()
  .then(() => console.log('Thresholds Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Thresholds Routes: Connection error', err.stack));

// GET /api/thresholds
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM thresholds ORDER BY timestamp DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Thresholds Routes: Error fetching thresholds:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching thresholds' });
  }
});

// POST /api/thresholds/create_threshold
router.post('/create_threshold', async (req, res) => {
  const {
    metric,
    high,
    low,
    phone,
    email,
    timestamp,
    thresh_kill,
    timeframe,
    alert_interval,
  } = req.body;

  const query = `
    INSERT INTO thresholds (metric, high, low, phone, email, timestamp, thresh_kill, timeframe, alert_interval)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`;

  try {
    const result = await client.query(query, [
      metric,
      high,
      low,
      phone,
      email,
      timestamp,
      thresh_kill,
      timeframe,
      alert_interval,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Thresholds Routes: Error creating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating threshold' });
  }
});

// GET /api/thresholds/update_threshold/:id
router.get('/update_threshold/:id', async (req, res) => {
  const { id } = req.params;
  const { thresh_kill, timeframe } = req.query;

  const query = `
    UPDATE thresholds SET thresh_kill = $1, timeframe = $2 WHERE id = $3
    RETURNING *`;

  try {
    const result = await client.query(query, [thresh_kill, timeframe, id]);
    res.redirect('/thankyou');
  } catch (error) {
    console.error('Thresholds Routes: Error updating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating threshold' });
  }
});

// GET /api/thresholds/get_last_alert_time/:id
router.get('/get_last_alert_time/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT time_of_last_alert FROM thresholds WHERE id = $1';

  try {
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Threshold not found' });
    }

    res.status(200).json({ lastAlertTime: result.rows[0].time_of_last_alert });
  } catch (error) {
    console.error('Thresholds Routes: Error fetching last alert time:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the last alert time' });
  }
});

// PUT /api/thresholds/update_last_alert_time/:id
router.put('/update_last_alert_time/:id', async (req, res) => {
  const { id } = req.params;
  const { lastAlertTime } = req.body; // Expecting a timestamp

  const query = `
    UPDATE thresholds SET time_of_last_alert = $1 WHERE id = $2
    RETURNING *`;

  try {
    const result = await client.query(query, [lastAlertTime, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Threshold not found' });
    }

    res.status(200).json({
      message: 'Last alert time updated successfully',
      threshold: result.rows[0],
    });
  } catch (error) {
    console.error('Thresholds Routes: Error updating last alert time:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the last alert time' });
  }
});

// Route to manually trigger the threshold check cron job
// GET /api/thresholds/run-check-thresholds
router.get('/run-check-thresholds', async (req, res) => {
  try {
    await checkThresholds(); // Call your cron job logic
    res.status(200).json({ message: 'Threshold check completed.' });
  } catch (error) {
    console.error('Server: Error running threshold check:', error);
    res.status(500).json({ error: 'Failed to run threshold check' });
  }
});

export default router;
