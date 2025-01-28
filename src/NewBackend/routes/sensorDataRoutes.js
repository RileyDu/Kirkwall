// routes/sensorDataRoutes.js

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
  .then(() => console.log('Sensor Data Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Sensor Data Routes: Connection error', err.stack));

// GET /api/sensor_data
router.get('/', async (req, res) => {
  const { sensor, start_date, end_date } = req.query;

  if (!sensor || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }


  let query = '';
  let params = [];

  // Build the query based on the selected sensor
  if (sensor === 'temperature') {
    query = `
      SELECT temperature, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'percent_humidity') {
    query = `
      SELECT percent_humidity, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'wind_speed') {
    query = `
      SELECT wind_speed, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'rain_15_min_inches') {
    query = `
      SELECT rain_15_min_inches, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'soil_moisture') {
    query = `
      SELECT soil_moisture, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'leaf_wetness') {
    query = `
      SELECT leaf_wetness, message_timestamp 
      FROM weather_data 
      WHERE message_timestamp BETWEEN $1 AND $2 
      ORDER BY message_timestamp ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'temp') {
    query = `
      SELECT temp, reading_time 
      FROM watchdog_data 
      WHERE reading_time BETWEEN $1 AND $2 
      ORDER BY reading_time ASC`;
    params = [start_date, end_date];
  } else if (sensor === 'hum') {
    query = `
      SELECT hum, reading_time
      FROM watchdog_data 
      WHERE reading_time BETWEEN $1 AND $2 
      ORDER BY reading_time ASC`;
    params = [start_date, end_date];
  } else {
    return res.status(400).json({ error: 'Invalid sensor selected' });
  }

  try {
    const result = await client.query(query, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Sensor Data Routes: Error fetching sensor data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching sensor data' });
  }
});

export default router;
