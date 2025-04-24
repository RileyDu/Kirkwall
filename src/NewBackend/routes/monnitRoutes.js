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
  .then(() => console.log('Monnit Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Monnit Routes: Connection error', err.stack));

// GET /api/monnit
router.get('/', async (req, res) => {
  const { sensor, limit = 10 } = req.query;
  let sensorId;

  // Set the sensorId based on the sensor name passed as query param
  switch (sensor) {
    case 'monnit_bathroom':
      sensorId = 1259266;
      break;
    case 'monnit_fridge':
      sensorId = 1258635;
      break;
    case 'monnit_freezer':
      sensorId = 1259489;
      break;
    case 'monnit_amp':
      sensorId = 1251479;
      break;
    default:
      sensorId = null;
  }

  let query;
  let queryParams;

  if (sensorId) {
    query = `
      SELECT current_reading, last_communication_date, sensor_id
      FROM Monnit_data_kirkwall
      WHERE sensor_id = $1
      ORDER BY last_communication_date DESC
      LIMIT $2
    `;
    queryParams = [sensorId, limit];
  } else {
    query = `
      SELECT current_reading, last_communication_date, sensor_id
      FROM Monnit_data_kirkwall
      ORDER BY last_communication_date DESC
      LIMIT $1
    `;
    queryParams = [limit];
  }

  try {
    const result = await client.query(query, queryParams);

    // Process data to extract correct values
    const processedData = result.rows.map(row => {
      let parsedData = {
        last_communication_date: row.last_communication_date,
        sensor_id: row.sensor_id,
      };

      if (row.sensor_id === 1259266) {
        // Bathroom sensor: Extract humidity and temperature
        const match = row.current_reading.match(/([\d.]+)% @ ([\d.]+) °F/);
        if (match) {
          parsedData.humidity = parseFloat(match[1]); // First capture group is humidity
          parsedData.temperature = parseFloat(match[2]); // Second capture group is temperature
        } else {
          console.error('Unexpected format for bathroom sensor:', row.current_reading);
        }
      } else {
        // For other sensors, extract the numeric value normally
        parsedData.current_reading = parseFloat(row.current_reading.toString().replace(/[^0-9.-]/g, ''));
      }

      return parsedData;
    });

    res.status(200).json(processedData);
  } catch (error) {
    console.error('Monnit Routes: Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data' });
  }
});

export default router;
