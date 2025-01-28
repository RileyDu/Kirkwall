// routes/dataExportRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import { createObjectCsvStringifier } from 'csv-writer';

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Data Export Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Data Export Routes: Connection error', err.stack));

// GET /api/export_data
router.get('/', async (req, res) => {
  const { metric, startDate, endDate } = req.query;

  // Validate input parameters
  if (!metric || !startDate || !endDate) {
    return res.status(400).json({ error: 'metric, startDate, and endDate are required.' });
  }

  // Map metric to table column
  const metricMapping = {
    temp: 'temp', // Assuming 'temp' maps to 'temp'
    hum: 'hum',   // Assuming 'hum' maps to 'hum'
    // Add more mappings as needed
  };

  const column = metricMapping[metric];

  if (!column) {
    return res.status(400).json({ error: 'Invalid metric selected.' });
  }

  // Validate date formats (basic validation)
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  // Construct the SQL query
  const query = `
    SELECT ${column}, reading_time 
    FROM watchdog_data 
    WHERE reading_time BETWEEN $1 AND $2 
    ORDER BY reading_time DESC
  `;

  try {
    const result = await client.query(query, [startDate, endDate]);

    // Check if data is present
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No data found for the given parameters.' });
    }

    // Define CSV headers based on the metric
    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: column, title: metric },
        { id: 'reading_time', title: 'Reading Time' },
      ],
    });

    // Generate CSV content
    const header = csvStringifier.getHeaderString();
    const records = csvStringifier.stringifyRecords(result.rows);
    const csvContent = header + records;

    // Set headers to prompt download
    res.setHeader('Content-disposition', 'attachment; filename=exported_data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Data Export Routes: Error exporting data:', error);
    res.status(500).json({ error: 'An error occurred while exporting data.' });
  }
});

export default router;
