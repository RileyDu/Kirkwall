import express from 'express';
import pkg from 'pg';
const { Client } = pkg; // ES module syntax
import cors from 'cors'; // Import cors package
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import multer from 'multer';
import sgMail from '@sendgrid/mail';
import { checkThresholds } from './cron/checkThresholds.js'; // Import your cron logic
import { generateWeeklyRecap } from './cron/cronWeeklyRecap.js';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON

//FOR SOME REASONE THIS NEEDS TO BE COMMENTED OUT FOR LOCAL VERCEL DEV, BUT NEEDS TO EXIST FOR PROD
// if (process.env.NODE_ENV === 'production') {
app.use(express.json());
// }

app.use(cors());

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

// Connect to PostgreSQL database
client
  .connect()
  // .then(() => console.log('Connected to the PostgreSQL database'))
  .catch(err => console.error('Connection error', err.stack));

// This will allow all origins to access the backend

app.get('/', (req, res) => res.send('Express on Vercel'));

app.get('/api/weather_data', async (req, res) => {
  const { limit = 10, type = 'all' } = req.query;

  let query =
    'SELECT * FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';

  if (type === 'temperature') {
    query =
      'SELECT temperature, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'rain_15_min_inches') {
    query =
      'SELECT rain_15_min_inches, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'percent_humidity') {
    query =
      'SELECT percent_humidity, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'wind_speed') {
    query =
      'SELECT wind_speed, wind_direction, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'leaf_wetness') {
    query =
      'SELECT leaf_wetness, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  } else if (type === 'soil_moisture') {
    query =
      'SELECT soil_moisture, message_timestamp, ts FROM weather_data WHERE stationid = $1 ORDER BY ts DESC LIMIT $2';
  }

  try {
    const result = await client.query(query, [181795, limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weather data' });
  }
});

app.get('/api/watchdog_data', async (req, res) => {
  const { limit = 10, type = 'all' } = req.query;

  let query = 'SELECT * FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  if (type === 'temp') {
    query =
      'SELECT temp, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  } else if (type === 'hum') {
    query =
      'SELECT hum, reading_time FROM watchdog_data ORDER BY reading_time DESC LIMIT $1';
  }

  try {
    const result = await client.query(query, [limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching watchdog data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching watchdog data' });
  }
});

app.get('/api/rivercity_data', async (req, res) => {
  const { limit = 10, type = 'all' } = req.query;

  let query =
    'SELECT * FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';

  if (type === 'rctemp') {
    query =
      'SELECT rctemp, publishedat FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';
  } else if (type === 'humidity') {
    query =
      'SELECT humidity, publishedat FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';
  }

  try {
    const result = await client.query(query, ['0080E115054FF0B7', limit]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching rivercity data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching rivercity data' });
  }
});

app.get('/api/impriMed_data', async (req, res) => {
  const { deveui, limit = 10 } = req.query; // Get the device id (deveui) and limit from query parameters

  // console.log('Received deveui:', deveui, 'Limit:', limit); // Log deveui and limit

  try {
    const query = `
      SELECT rctemp, humidity, publishedat, deveui 
      FROM rivercity_data 
      WHERE deveui = $1 
      ORDER BY publishedat DESC 
      LIMIT $2`;

    const result = await client.query(query, [deveui, limit]);
    // console.log('Query result:', result.rows); // Log the result from the query

    res.status(200).json(result.rows); // Send the data as JSON response
  } catch (error) {
    console.error('Error fetching ImpriMed data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching ImpriMed data' });
  }
});

app.get('/api/thresholds', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM thresholds ORDER BY timestamp DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching thresholds:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching thresholds' });
  }
});

app.post('/api/create_threshold', async (req, res) => {
  const {
    metric,
    high,
    low,
    phone,
    email,
    timestamp,
    thresh_kill,
    timeframe,
    alert_interval,
  } = req.body;

  const query = `
    INSERT INTO thresholds (metric, high, low, phone, email, timestamp, thresh_kill, timeframe, alert_interval)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`;

  try {
    const result = await client.query(query, [
      metric,
      high,
      low,
      phone,
      email,
      timestamp,
      thresh_kill,
      timeframe,
      alert_interval,
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating threshold' });
  }
});

app.get('/api/update_threshold/:id', async (req, res) => {
  const { id } = req.params;
  const { thresh_kill, timeframe } = req.query;

  const query = `
    UPDATE thresholds SET thresh_kill = $1, timeframe = $2 WHERE id = $3
    RETURNING *`;

  try {
    const result = await client.query(query, [thresh_kill, timeframe, id]);
    res.redirect('/thankyou');
  } catch (error) {
    console.error('Error updating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating threshold' });
  }
});

app.get('/api/get_last_alert_time/:id', async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT time_of_last_alert FROM thresholds WHERE id = $1';

  try {
    const result = await client.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Threshold not found' });
    }

    res.status(200).json({ lastAlertTime: result.rows[0].time_of_last_alert });
  } catch (error) {
    console.error('Error fetching last alert time:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching the last alert time' });
  }
});

app.put('/api/update_last_alert_time/:id', async (req, res) => {
  const { id } = req.params;
  const { lastAlertTime } = req.body; // Expecting a timestamp

  const query = `
    UPDATE thresholds SET time_of_last_alert = $1 WHERE id = $2
    RETURNING *`;

  try {
    const result = await client.query(query, [lastAlertTime, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Threshold not found' });
    }

    res
      .status(200)
      .json({
        message: 'Last alert time updated successfully',
        threshold: result.rows[0],
      });
  } catch (error) {
    console.error('Error updating last alert time:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the last alert time' });
  }
});

app.get('/api/alerts', async (req, res) => {
  try {
    const result = await client.query(
      'SELECT * FROM alerts ORDER BY timestamp DESC'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

app.get('/api/alerts/recap', async (req, res) => {
  const { start_date } = req.query; // Get the start date from query params

  if (!start_date) {
    return res.status(400).json({ error: 'Start date is required' });
  }

  try {
    // Calculate the end date as 7 days after the start date
    const end_date = new Date(start_date);
    end_date.setDate(end_date.getDate() + 7); // Adds 7 days to the start date
    const formattedEndDate = end_date.toISOString(); // Convert end date to ISO format

    const result = await client.query(
      `SELECT * FROM alerts 
       WHERE timestamp >= $1 
       AND timestamp < $2 
       ORDER BY timestamp DESC`,
      [start_date, formattedEndDate]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching recent alerts' });
  }
});

app.get('/api/alerts_per_user', async (req, res) => {
  const userMetrics = req.query.userMetrics; // Extract the userMetrics array from the query parameters

  if (!Array.isArray(userMetrics)) {
    return res
      .status(400)
      .json({ error: 'userMetrics should be an array of metrics' });
  }

  // Dynamically generate the filter clause using parameterized queries
  const filter = userMetrics
    .map((metric, index) => `metric = $${index + 1}`)
    .join(' OR ');

  const query = `
    SELECT timestamp, metric, id, message 
    FROM alerts
    WHERE ${filter}
    ORDER BY id DESC
    LIMIT 100
  `;

  try {
    const result = await client.query(query, userMetrics); // Pass userMetrics as parameterized values
    res.status(200).json(result.rows); // Send the result as JSON
  } catch (error) {
    console.error('Error fetching alerts per user metric:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

// New backend route to get alerts from the last hour
app.get('/api/alerts_last_hour', async (req, res) => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // Get the timestamp for one hour ago

  try {
    // Query to fetch alerts where the timestamp is within the last hour
    const query = `
      SELECT metric, timestamp
      FROM alerts
      WHERE timestamp > $1
      ORDER BY timestamp DESC
    `;

    const result = await client.query(query, [oneHourAgo]);
    res.status(200).json(result.rows); // Send the alerts as a response
  } catch (error) {
    console.error('Error fetching alerts from the last hour:', error);
    res.status(500).json({ error: 'An error occurred while fetching alerts' });
  }
});

app.post('/api/create_alert', async (req, res) => {
  const { metric, message, timestamp } = req.body;

  const query = `
    INSERT INTO alerts (metric, message, timestamp)
    VALUES ($1, $2, $3)
    RETURNING *`;

  try {
    const result = await client.query(query, [metric, message, timestamp]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'An error occurred while creating alert' });
  }
});

app.delete('/api/delete_alert/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.query('DELETE FROM alerts WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'An error occurred while deleting alert' });
  }
});

app.get('/api/admins', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM admin');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'An error occurred while fetching admins' });
  }
});

app.get('/api/admin/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await client.query('SELECT * FROM admin WHERE email = $1', [
      email,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching admin by email:', error);
    res.status(500).json({ error: 'An error occurred while fetching admin' });
  }
});

app.get('/api/update_admin_thresh/:phone', async (req, res) => {
  const { phone } = req.params;
  const { thresh_kill } = req.query;

  const query = `
    UPDATE admin SET thresh_kill = $1 WHERE phone LIKE $2
    RETURNING *`;

  try {
    const result = await client.query(query, [thresh_kill, `%${phone}%`]);
    // res.status(200).json(result.rows[0]);
    res.redirect('/thankyouadmin');
  } catch (error) {
    console.error('Error updating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating threshold' });
  }
});

app.put('/api/update_admin/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, company, thresh_kill } = req.body;

  const query = `
    UPDATE admin SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, thresh_kill = $6
    WHERE id = $7
    RETURNING *`;

  try {
    const result = await client.query(query, [
      firstname,
      lastname,
      email,
      phone,
      company,
      thresh_kill,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'An error occurred while updating admin' });
  }
});

// New backend route to update the admin's profile URL
app.put('/api/update_profile_url/:id', async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    email,
    phone,
    company,
    thresh_kill,
    profile_url,
  } = req.body;

  const query = `
    UPDATE admin
    SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, thresh_kill = $6, profile_url = $7
    WHERE id = $8
    RETURNING *`;

  try {
    const result = await client.query(query, [
      firstname,
      lastname,
      email,
      phone,
      company,
      thresh_kill,
      profile_url,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating profile URL:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the profile URL' });
  }
});

app.get('/api/charts', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM charts');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ error: 'An error occurred while fetching charts' });
  }
});

app.put('/api/update_chart', async (req, res) => {
  console.log('Received request to update chart:', req.body);

  const { id, metric, timeperiod, type, location, hidden } = req.body;

  const query = `
    UPDATE charts SET metric = $1, timeperiod = $2, type = $3, location = $4, hidden = $5
    WHERE id = $6
    RETURNING *`;

  try {
    const result = await client.query(query, [
      metric,
      timeperiod,
      type,
      location,
      hidden,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating chart:', error);
    res.status(500).json({ error: 'An error occurred while updating chart' });
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

app.post(
  '/api/send-enquiry',
  upload.array('attachments', 10),
  async (req, res) => {
    const { fromEmail, title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).send({ message: 'Title (subject) is required.' });
    }

    const attachments = req.files.map(file => ({
      content: file.buffer.toString('base64'),
      filename: file.originalname,
      type: file.mimetype,
      disposition: 'attachment',
    }));

    const msg = {
      to: 'ujj.code@gmail.com',
      from: {
        name: 'Contact Form',
        email: 'alerts@kirkwall.io',
      },
      subject: title,
      text: description,
      html: `<p>Problem Description: ${description}<br/>Contact customer at: ${fromEmail}</p>`,
      attachments: attachments,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
      res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error('Error response body:', error.response.body);
      }
      res.status(500).send({ message: 'Failed to send email' });
    }
  }
);

// Get all equipment for a user by email
app.get('/api/equipment/:email', async (req, res) => {
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
    console.error('Error fetching equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new equipment for a user
app.post('/api/equipment', async (req, res) => {
  const { email, title, wattage, hours_per_day } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO user_equipment (email, title, wattage, hours_per_day) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, title, wattage, hours_per_day]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete an equipment
app.delete('/api/equipment/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await client.query(
      'DELETE FROM user_equipment WHERE id = $1',
      [id]
    );
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get energy credentials for a user by email
app.get('/api/energy-info/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await client.query(
      'SELECT * FROM energy_info WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No energy info found for this user.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add new energy info for a user
app.post('/api/energy-info', async (req, res) => {
  const { email, location, zip_code } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO energy_info (email, location, zip_code) VALUES ($1, $2, $3) RETURNING *',
      [email, location, zip_code]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      // 23505 is the error code for unique constraint violation in PostgreSQL
      return res
        .status(409)
        .json({ message: 'User with this email already exists.' });
    }
    console.error('Error adding energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update the location via user
app.put('/api/energy-info/:email', async (req, res) => {
  const email = req.params.email;
  const { location } = req.body;

  try {
    const result = await client.query(
      'UPDATE energy_info SET location = $1, updated_at = NOW() WHERE email = $2 RETURNING *',
      [location, email]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: 'No user found with this email.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for adding weekly recap data
app.post('/api/weekly-recap', async (req, res) => {
  const { user_email, metric, week_start_date, high, low, avg, alert_count } =
    req.body;

  try {
    // Insert the new weekly recap data into the database
    const result = await client.query(
      `INSERT INTO Weekly_Recap (user_email, metric, week_start_date, high, low, avg, alert_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
       RETURNING *`,
      [user_email, metric, week_start_date, high, low, avg, alert_count]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while inserting weekly recap data' });
  }
});

// GET route for getting weekly recap data
app.get('/api/weekly-recap', async (req, res) => {
  const { user_email, week_start_date } = req.query;

  if (!user_email) {
    return res.status(400).json({ error: 'user_email is required' });
  }

  try {
    let query = `SELECT * FROM Weekly_Recap WHERE user_email = $1`;
    let queryParams = [user_email];

    // If a specific week is requested, add it to the query
    if (week_start_date) {
      query += ` AND week_start_date = $2`;
      queryParams.push(week_start_date);
    } else {
      // If no week is specified, get the most recent week's data
      query += ` ORDER BY week_start_date DESC`;
    }

    const result = await client.query(query, queryParams);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No weekly recap data found for the specified criteria',
      });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching weekly recap data' });
  }
});

// GET route to fetch all available week start dates
app.get('/api/weekly-recap/weeks', async (req, res) => {
  try {
    const result = await client.query(
      `SELECT DISTINCT week_start_date 
       FROM Weekly_Recap 
       ORDER BY week_start_date DESC`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching week start dates:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching week start dates' });
  }
});

// DELETE route for deleting weekly recap data
app.delete('/api/weekly-recap/:id', async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: 'id is required' });
  }

  try {
    await client.query('DELETE FROM Weekly_Recap WHERE id = $1', [id]);
    res.status(200).json({ message: 'Weekly recap data deleted successfully' });
  } catch (error) {
    console.error('Error deleting weekly recap data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while deleting weekly recap data' });
  }
});

app.get('/api/sensor_data', async (req, res) => {
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

      if (sensor === 'imFreezerOneTemp') {
        newRow.imFreezerOneTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imFreezerOneHum') {
        newRow.imFreezerOneHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imFreezerTwoTemp') {
        newRow.imFreezerTwoTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imFreezerTwoHum') {
        newRow.imFreezerTwoHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imFreezerThreeTemp') {
        newRow.imFreezerThreeTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imFreezerThreeHum') {
        newRow.imFreezerThreeHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imFridgeOneTemp') {
        newRow.imFridgeOneTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imFridgeOneHum') {
        newRow.imFridgeOneHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imFridgeTwoTemp') {
        newRow.imFridgeTwoTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imFridgeTwoHum') {
        newRow.imFridgeTwoHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imIncubatorOneTemp') {
        newRow.imIncubatorOneTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imIncubatorOneHum') {
        newRow.imIncubatorOneHum = newRow.humidity;
        delete newRow.humidity;
      } else if (sensor === 'imIncubatorTwoTemp') {
        newRow.imIncubatorTwoTemp = newRow.rctemp;
        delete newRow.rctemp;
      } else if (sensor === 'imIncubatorTwoHum') {
        newRow.imIncubatorTwoHum = newRow.humidity;
        delete newRow.humidity;
      }
      return newRow;
    });

    res.status(200).json(renamedData);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching sensor data' });
  }
});

// Scrape Big Iron Auctions using Puppeteer
app.get('/api/scrapeBigIron', async (req, res) => {
  const { query, page = 1 } = req.query; // Set default page to 1 if not provided
  const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '+');

  try {
    const browser = await puppeteer.launch({ headless: true });
    const pageObj = await browser.newPage();

    // Use the updated URL format for Big Iron with pagination
    const url = `https://www.bigiron.com/Search?showTab=true&search=${formattedQuery}&searchMode=All&userControlsVisible=false&distance=500&historical=false&tab=equipment-tab&page=${page}&itemsPerPage=20&filter=Open&sort=Start&sortOrder=Ascending`;
    
    await pageObj.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the search results container to load
    await pageObj.waitForSelector('.pager-data', { timeout: 10000 });

    // Extract the HTML content
    const content = await pageObj.content();
    const $ = cheerio.load(content);

    let bigIronResults = [];
    $('.pager-list-item').each((i, el) => {
      if (i < 20) {
      const equipmentName = $(el).find('.lot-title h1').text().trim();
      const price = $(el).find('.bidding-js-amount').first().text().trim();
      const link = $(el).find('a').attr('href');
      const imageUrl = $(el).find('.bidding-js-preview img').attr('src');

      bigIronResults.push({
        equipmentName,
        price,
        link: `https://www.bigiron.com${link}`,
        image: imageUrl ? `${imageUrl}` : null,
        source: 'Big Iron'
      });
    }
    });
    await browser.close();
    res.json(bigIronResults);
  } catch (error) {
    console.error('Error scraping Big Iron:', error);
    res.status(500).send('Failed to scrape Big Iron data');
  }
});


app.get('/api/scrapePurpleWave', async (req, res) => {
  const { query, page = 1 } = req.query; // Default page to 1 if not provided
  const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '%20');

  try {
    const browser = await puppeteer.launch({ headless: true });
    const pageObj = await browser.newPage();

    // Construct the URL with the updated parameters, including the page number
    const url = `https://www.purplewave.com/search/${formattedQuery}?searchType=all&dateType=upcoming&zipcodeRange=all&sortBy=current_bid-desc&perPage=20&grouped=true&viewtype=compressed&page=${page}`;
    
    await pageObj.goto(url, { waitUntil: 'networkidle2' });

    // Wait for the item list to load
    await pageObj.waitForSelector('.panel.panel-default.auction-item-compressed', { timeout: 10000 });

    // Extract the content
    const content = await pageObj.content();
    const $ = cheerio.load(content);

    let purpleWaveResults = [];
    $('.panel.panel-default.auction-item-compressed').each((i, el) => {
      if (i < 20) {
        const equipmentName = $(el).find('.first-line h3').text().trim();
        const price = $(el).find('.table-cell label:contains("Current")').parent().contents().not('label').text().trim();
        const link = $(el).find('.thumbnail').attr('href');
        const imageUrl = $(el).find('.thumbnail img').attr('src');

        purpleWaveResults.push({
          equipmentName,
          price,
          link: link ? `https://www.purplewave.com${link}` : null,
          image: imageUrl ? `${imageUrl}` : null,
          source: 'Purple Wave'
        });
      }
    });

    await browser.close();
    res.json(purpleWaveResults);
  } catch (error) {
    console.error('Error scraping Purple Wave:', error);
    res.status(500).send('Failed to scrape Purple Wave data');
  }
});


// app.get('/api/scrapeAuctionTime', async (req, res) => {
//   const { query } = req.query;
//   const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '%20');

//   try {
//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     // Navigate to the search page
//     const url = `https://www.auctiontime.com/listings/auctions/online/all-auctions/list?keywords=${formattedQuery}`;
//     await page.goto(url, { waitUntil: 'networkidle2' });

//     // Wait for the item list to load
//     await page.waitForSelector('.listings-list', { timeout: 15000 });

//     // Extract the content
//     const content = await page.content();
//     const $ = cheerio.load(content);

//     let auctionTimeResults = [];
//     $('.listings-list').each((i, el) => {
//       if (i < 10) {
//         const equipmentName = $(el).find('.first-line h3').text().trim();
//         const price = $(el).find('.table-cell label:contains("Current")').parent().contents().not('label').text().trim();
//         const link = $(el).find('.thumbnail').attr('href');
//         const imageUrl = $(el).find('.thumbnail img').attr('src');

//         auctionTimeResults.push({
//           equipmentName,
//           price,
//           link: link ? `https://www.auctiontime.com${link}` : null,
//           image: imageUrl ? `${imageUrl}` : null
//         });
//       }
//     });

//     await browser.close();

//     res.json(auctionTimeResults);
//   } catch (error) {
//     console.error('Error scraping Auction Time:', error);
//     res.status(500).send('Failed to scrape Auction Time data');
//   }
// });




// Cron Job route that runs every 10 minutes to check live values against user thresholds
app.get('/api/run-check-thresholds', async (req, res) => {
  try {
    await checkThresholds(); // Call your cron job logic
    res.status(200).json({ message: 'Threshold check completed.' });
  } catch (error) {
    console.error('Error running threshold check:', error);
    res.status(500).json({ error: 'Failed to run threshold check' });
  }
});

// Cron Job route that runs every monday to generate weekly recap
app.get('/api/run-weekly-recap', async (req, res) => {
  try {
    await generateWeeklyRecap(); // Call the new weekly recap cron job logic
    res.status(200).json({ message: 'Weekly recap generation completed.' });
  } catch (error) {
    console.error('Error generating weekly recap:', error);
    res.status(500).json({ error: 'Failed to generate weekly recap' });
  }
});

// Catch-all route for other API requests
app.get('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}

// Export the app for Vercel
export default app;
