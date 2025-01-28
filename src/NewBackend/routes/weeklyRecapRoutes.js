// routes/weeklyRecapRoutes.js

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
  .then(() => console.log('Weekly Recap Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Weekly Recap Routes: Connection error', err.stack));

// POST /api/weekly-recap - Add weekly recap data
router.post('/', async (req, res) => {
  const { user_email, metric, week_start_date, high, low, avg, alert_count } =
    req.body;

  try {
    // Insert the new weekly recap data into the database
    const result = await client.query(
      `INSERT INTO Weekly_Recap (user_email, metric, week_start_date, high, low, avg, alert_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [user_email, metric, week_start_date, high, low, avg, alert_count]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Weekly Recap Routes: Error inserting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while inserting weekly recap data' });
  }
});

// GET /api/weekly-recap - Get weekly recap data
router.get('/', async (req, res) => {
  const { user_email, week_start_date } = req.query;

  if (!user_email) {
    return res.status(400).json({ error: 'user_email is required' });
  }

  try {
    let query = `SELECT * FROM Weekly_Recap WHERE user_email = $1`;
    let queryParams = [user_email];

    // If a specific week is requested, add it to the query
    if (week_start_date) {
      query += ` AND week_start_date = $2`;
      queryParams.push(week_start_date);
    } else {
      // If no week is specified, get the most recent week's data
      query += ` ORDER BY week_start_date DESC`;
    }

    const result = await client.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No weekly recap data found for the specified criteria',
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Weekly Recap Routes: Error fetching weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weekly recap data' });
  }
});

// GET /api/weekly-recap/weeks - Get all available week start dates
router.get('/weeks', async (req, res) => {
  try {
    const result = await client.query(
      `SELECT DISTINCT week_start_date 
       FROM Weekly_Recap 
       ORDER BY week_start_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Weekly Recap Routes: Error fetching week start dates:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching week start dates' });
  }
});

// DELETE /api/weekly-recap/:id - Delete weekly recap data by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await client.query('DELETE FROM Weekly_Recap WHERE id = $1', [id]);
    res.status(200).json({ message: 'Weekly recap data deleted successfully' });
  } catch (error) {
    console.error('Weekly Recap Routes: Error deleting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting weekly recap data' });
  }
});

export default router;
