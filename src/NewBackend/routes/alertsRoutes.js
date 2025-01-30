// routes/alertsRoutes.js

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
  .then(() => console.log('Alerts Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Alerts Routes: Connection error', err.stack));

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM alerts ORDER BY timestamp DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Alerts Routes: Error fetching alerts:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

// GET route for all security alerts
router.get('/soalerts', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM soalerts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching security alerts:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching security alerts' });
  }
});


// GET /api/alerts/recap
router.get('/recap', async (req, res) => {
  const { start_date } = req.query; // Get the start date from query params

  if (!start_date) {
    return res.status(400).json({ error: 'Start date is required' });
  }

  try {
    // Calculate the end date as 7 days after the start date
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 7); // Adds 7 days to the start date
    const formattedEndDate = end_date.toISOString(); // Convert end date to ISO format

    const result = await client.query(
      `SELECT * FROM alerts 
       WHERE timestamp >= $1 
       AND timestamp < $2 
       ORDER BY timestamp DESC`,
      [start_date, formattedEndDate]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Alerts Routes: Error fetching recent alerts:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching recent alerts' });
  }
});

// GET /api/alerts_per_user
router.get('/alerts_per_user', async (req, res) => {
  const userMetrics = req.query.userMetrics; // Extract the userMetrics array from the query parameters

  if (!Array.isArray(userMetrics)) {
    return res
      .status(400)
      .json({ error: 'userMetrics should be an array of metrics' });
  }

  // Dynamically generate the filter clause using parameterized queries
  const filter = userMetrics
    .map((metric, index) => `metric = $${index + 1}`)
    .join(' OR ');

  const query = `
    SELECT timestamp, metric, id, message 
    FROM alerts
    WHERE ${filter}
    ORDER BY id DESC
    LIMIT 100
  `;

  try {
    const result = await client.query(query, userMetrics); // Pass userMetrics as parameterized values
    res.status(200).json(result.rows); // Send the result as JSON
  } catch (error) {
    console.error('Alerts Routes: Error fetching alerts per user metric:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

// GET /api/alerts_last_hour
router.get('/alerts_last_hour', async (req, res) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // Get the timestamp for one hour ago

  try {
    // Query to fetch alerts where the timestamp is within the last hour
    const query = `
      SELECT metric, timestamp
      FROM alerts
      WHERE timestamp > $1
      ORDER BY timestamp DESC
    `;

    const result = await client.query(query, [oneHourAgo]);
    res.status(200).json(result.rows); // Send the alerts as a response
  } catch (error) {
    console.error('Alerts Routes: Error fetching alerts from the last hour:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

// POST /api/alerts/create_alert
router.post('/create_alert', async (req, res) => {
  const { metric, message, timestamp } = req.body;

  const query = `
    INSERT INTO alerts (metric, message, timestamp)
    VALUES ($1, $2, $3)
    RETURNING *`;

  try {
    const result = await client.query(query, [metric, message, timestamp]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Alerts Routes: Error creating alert:', error);
    res.status(500).json({ error: 'An error occurred while creating alert' });
  }
});

// DELETE /api/alerts/delete_alert/:id
router.delete('/delete_alert/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.query('DELETE FROM alerts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Alerts Routes: Error deleting alert:', error);
    res.status(500).json({ error: 'An error occurred while deleting alert' });
  }
});

export default router;
