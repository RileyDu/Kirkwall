// routes/disasterShieldRoutes.js

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
  .then(() => console.log('Disaster Shield Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Disaster Shield Routes: Connection error', err.stack));

// GET /api/disastershield
// Returns all data from the disastershield table
router.get('/', async (req, res) => {
  const query = 'SELECT * FROM disastershield ORDER BY id';

  try {
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Disaster Shield Routes: Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

// POST /api/disastershield/updateCoordinates
// Expects a JSON body with { id, latitude, longitude }
// Updates the specified record in the disastershield table
router.post('/updateCoordinates', async (req, res) => {
  const { id, latitude, longitude } = req.body;

  // Validate required fields
  if (!id || typeof latitude === 'undefined' || typeof longitude === 'undefined') {
    return res
      .status(400)
      .json({ error: 'Missing required fields: id, latitude, and longitude' });
  }

  const query =
    'UPDATE disastershield SET latitude = $1, longitude = $2 WHERE id = $3 RETURNING *';
  const values = [latitude, longitude, id];

  try {
    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res
      .status(200)
      .json({ message: 'Coordinates updated successfully', site: result.rows[0] });
  } catch (error) {
    console.error('Disaster Shield Routes: Error updating coordinates:', error);
    res.status(500).json({ error: 'An error occurred while updating coordinates' });
  }
});

// PUT /api/disastershield/:id/updateLocation
// Expects a JSON body with { city, state }
// Updates the specified record in the disastershield table.
router.put('/:id/updateLocation', async (req, res) => {
  const { id } = req.params;
  const { city, state } = req.body;

  // Validate that both city and state are provided
  if (!city || !state) {
    return res.status(400).json({ error: 'City and state are required' });
  }

  try {
    const updateQuery =
      'UPDATE disastershield SET city = $1, state = $2 WHERE id = $3 RETURNING *';
    const updateValues = [city, state, id];

    const updateResult = await client.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({
      message: 'City and state updated successfully',
      site: updateResult.rows[0],
    });
  } catch (error) {
    console.error('Error updating city and state:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the city and state' });
  }
});

export default router;
