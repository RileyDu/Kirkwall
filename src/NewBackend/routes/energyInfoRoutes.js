// routes/energyInfoRoutes.js

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
  .then(() => console.log('Energy Info Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Energy Info Routes: Connection error', err.stack));

// GET /api/energy-info/:email - Get energy credentials for a user by email
router.get('/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await client.query(
      'SELECT * FROM energy_info WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No energy info found for this user.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Energy Info Routes: Error fetching energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/energy-info - Add new energy info for a user
router.post('/', async (req, res) => {
  const { email, location, zip_code } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO energy_info (email, location, zip_code) VALUES ($1, $2, $3) RETURNING *',
      [email, location, zip_code]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      // 23505 is the error code for unique constraint violation in PostgreSQL
      return res
        .status(409)
        .json({ message: 'User with this email already exists.' });
    }
    console.error('Energy Info Routes: Error adding energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/energy-info/:email - Update the location via user email
router.put('/:email', async (req, res) => {
  const email = req.params.email;
  const { location } = req.body;

  try {
    const result = await client.query(
      'UPDATE energy_info SET location = $1, updated_at = NOW() WHERE email = $2 RETURNING *',
      [location, email]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No user found with this email.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Energy Info Routes: Error updating energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
