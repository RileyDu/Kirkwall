// /pages/api/weather_data.js
import { Client } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// Setup PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect();

export default async function handler(req, res) {
  const { limit = 10, type = 'all' } = req.query;
  console.log('request received to get weather data:', limit, type);
  let query = 'SELECT * FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  
  if (type === 'temperature') {
    query = 'SELECT temperature, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'rain_15_min_inches') {
    query = 'SELECT rain_15_min_inches, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'percent_humidity') {
    query = 'SELECT percent_humidity, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'wind_speed') {
    query = 'SELECT wind_speed, wind_direction, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'leaf_wetness') {
    query = 'SELECT leaf_wetness, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'soil_moisture') {
    query = 'SELECT soil_moisture, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  }

  try {
    const result = await client.query(query, [181795, limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'An error occurred while fetching weather data' });
  }
}
