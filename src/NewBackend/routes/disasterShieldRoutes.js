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
    const query = 'SELECT * FROM disastershield';  // Declare query properly

    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Disaster Shield Routes: Error fetching data:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
});

export default router;
