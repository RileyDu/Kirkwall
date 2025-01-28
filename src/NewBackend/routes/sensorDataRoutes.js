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

  // Define the deveui mapping object
  const deveuiPerMetric = {
    rctemp: '0080E115054FF0B7',
    humidity: '0080E115054FF0B7',
    imFreezerOneTemp: '0080E1150618C9DE',
    imFreezerOneHum: '0080E1150618C9DE',
    imFreezerTwoTemp: '0080E115054FC6DF',
    imFreezerTwoHum: '0080E115054FC6DF',
    imFreezerThreeTemp: '0080E1150618B549',
    imFreezerThreeHum: '0080E1150618B549',
    imFridgeOneTemp: '0080E1150619155F',
    imFridgeOneHum: '0080E1150619155F',
    imFridgeTwoTemp: '0080E115061924EA',
    imFridgeTwoHum: '0080E115061924EA',
    imIncubatorOneTemp: '0080E115054FF1DC',
    imIncubatorOneHum: '0080E115054FF1DC',
    imIncubatorTwoTemp: '0080E1150618B45F',
    imIncubatorTwoHum: '0080E1150618B45F',
  };

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
  } else if (deveuiPerMetric[sensor]) {
    // Use the deveui from the mapping object
    query = `
      SELECT rctemp, humidity, publishedat 
      FROM rivercity_data 
      WHERE deveui = $1 AND publishedat BETWEEN $2 AND $3 
      ORDER BY publishedat ASC`;
    params = [deveuiPerMetric[sensor], start_date, end_date];
  } else {
    return res.status(400).json({ error: 'Invalid sensor selected' });
  }

  try {
    const result = await client.query(query, params);

    // Map through the result to rename keys dynamically
    const renamedData = result.rows.map(row => {
      const newRow = { ...row };

      // Rename fields based on sensor type
      switch (sensor) {
        case 'imFreezerOneTemp':
          newRow.imFreezerOneTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imFreezerOneHum':
          newRow.imFreezerOneHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imFreezerTwoTemp':
          newRow.imFreezerTwoTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imFreezerTwoHum':
          newRow.imFreezerTwoHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imFreezerThreeTemp':
          newRow.imFreezerThreeTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imFreezerThreeHum':
          newRow.imFreezerThreeHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imFridgeOneTemp':
          newRow.imFridgeOneTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imFridgeOneHum':
          newRow.imFridgeOneHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imFridgeTwoTemp':
          newRow.imFridgeTwoTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imFridgeTwoHum':
          newRow.imFridgeTwoHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imIncubatorOneTemp':
          newRow.imIncubatorOneTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imIncubatorOneHum':
          newRow.imIncubatorOneHum = newRow.humidity;
          delete newRow.humidity;
          break;
        case 'imIncubatorTwoTemp':
          newRow.imIncubatorTwoTemp = newRow.rctemp;
          delete newRow.rctemp;
          break;
        case 'imIncubatorTwoHum':
          newRow.imIncubatorTwoHum = newRow.humidity;
          delete newRow.humidity;
          break;
        default:
          // No renaming needed for other sensors
          break;
      }
      return newRow;
    });

    res.status(200).json(renamedData);
  } catch (error) {
    console.error('Sensor Data Routes: Error fetching sensor data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching sensor data' });
  }
});

export default router;
