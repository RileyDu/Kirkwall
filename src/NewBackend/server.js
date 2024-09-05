const express = require('express');
const axios = require('axios');
const { Client } = require('pg'); // PostgreSQL client
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Azure
});


// Connect to PostgreSQL database
client.connect()
  .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// Middleware to parse incoming JSON
app.use(express.json());

// Example route for fetching weather data
app.get('/api/weather_data', async (req, res) => {
  try {
    const { limit = 10 } = req.query; // Get the limit from query, default to 10
    const result = await client.query(
      'SELECT * FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2', 
      [181795, limit] // Parameters for the query
    );
    res.status(200).json(result.rows); // Send fetched data as JSON
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'An error occurred while fetching weather data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
