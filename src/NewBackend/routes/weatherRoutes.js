// routes/weatherRoutes.js

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
  .then(() => console.log('Weather Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Weather Routes: Connection error', err.stack));

// GET /api/weather_data
router.get('/', async (req, res) => {
  const { limit = 10, type = 'all' } = req.query;

  let query =
    'SELECT * FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';

  switch (type) {
    case 'temperature':
      query =
        'SELECT temperature, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    case 'rain_15_min_inches':
      query =
        'SELECT rain_15_min_inches, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    case 'percent_humidity':
      query =
        'SELECT percent_humidity, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    case 'wind_speed':
      query =
        'SELECT wind_speed, wind_direction, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    case 'leaf_wetness':
      query =
        'SELECT leaf_wetness, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    case 'soil_moisture':
      query =
        'SELECT soil_moisture, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
      break;
    default:
      // Default query already set
      break;
  }

  try {
    const result = await client.query(query, [181795, limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Weather Routes: Error fetching weather data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weather data' });
  }
});

export default router;
