import express from 'express';
import pkg from 'pg';
const { Client } = pkg; // ES module syntax
import cors from 'cors'; // Import cors package
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables
import multer from 'multer';
import sgMail from '@sendgrid/mail';
import { checkThresholds } from './cron/checkThresholds.js'; // Import your cron logic


const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON

//FOR SOME REASONE THIS NEEDS TO BE COMMENTED OUT FOR LOCAL VERCEL DEV, BUT NEEDS TO EXIST FOR PROD
if (process.env.NODE_ENV === 'production') {
  app.use(express.json());
}

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

  if (type === 'temp') {
    query =
      'SELECT rctemp, publishedat FROM rivercity_data WHERE deveui = $1 ORDER BY publishedat DESC LIMIT $2';
  } else if (type === 'hum') {
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
  const { metric, high, low, phone, email, timestamp, thresh_kill, timeframe } =
    req.body;

  const query = `
    INSERT INTO thresholds (metric, high, low, phone, email, timestamp, thresh_kill, timeframe)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
    ]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while creating threshold' });
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

// New route for cron job
app.get('/api/run-check-thresholds', async (req, res) => {
  try {
    await checkThresholds(); // Call your cron job logic
    res.status(200).json({ message: 'Threshold check completed.' });
  } catch (error) {
    console.error('Error running threshold check:', error);
    res.status(500).json({ error: 'Failed to run threshold check' });
  }
});


// Serve the static files from the React app
// app.use(express.static(join(__dirname, '../../build')));

// Catch-all route for other API requests
app.get('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// All other requests are handled by CRA's index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../build', 'index.html'));
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// Export the app for Vercel
export default app;
