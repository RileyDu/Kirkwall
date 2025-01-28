// routes/equipmentRoutes.js

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
  .then(() => console.log('Equipment Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Equipment Routes: Connection error', err.stack));

// GET /api/equipment/:email - Get all equipment for a user by email
router.get('/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await client.query(
      'SELECT * FROM user_equipment WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No equipment found for this user.' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Equipment Routes: Error fetching equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/equipment - Add new equipment for a user
router.post('/', async (req, res) => {
  const { email, title, wattage, hours_per_day } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO user_equipment (email, title, wattage, hours_per_day) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, title, wattage, hours_per_day]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Equipment Routes: Error adding equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/equipment/:id - Delete an equipment by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await client.query(
      'DELETE FROM user_equipment WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Equipment Routes: Error deleting equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
