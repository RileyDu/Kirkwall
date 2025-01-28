// routes/watchdogRoutes.js

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
  .then(() => console.log('Watchdog Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Watchdog Routes: Connection error', err.stack));

// GET /api/watchdog_data
router.get('/', async (req, res) => {
  const { limit = 10, type = 'all' } = req.query;

  let query = 'SELECT * FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  if (type === 'temp') {
    query =
      'SELECT temp, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  } else if (type === 'hum') {
    query =
      'SELECT hum, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  }

  try {
    const result = await client.query(query, [limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Watchdog Routes: Error fetching watchdog data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching watchdog data' });
  }
});

export default router;
