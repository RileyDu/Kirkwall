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
    res.status(500).json({ error: 'An error occurred while updating threshold' });
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
    res.status(500).json({ error: 'An error occurred while fetching recent alerts' });
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
    res.status(500).json({ error: 'An error occurred while updating threshold' });
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
      return res.status(404).json({ message: 'No equipment found for this user.' });
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
    const result = await client.query('DELETE FROM user_equipment WHERE id = $1', [id]);
    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error('Error deleting equipment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

// Get energy credentials for a user by email
app.get('/api/energy-info/:email', async (req, res) => {
  const email = req.params.email;
  try {
    const result = await client.query(
      'SELECT * FROM energy_info WHERE email = $1',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No energy info found for this user.' });
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
      return res.status(409).json({ message: 'User with this email already exists.' });
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
      return res.status(404).json({ message: 'No user found with this email.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating energy info:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST route for adding weekly recap data
app.post('/api/weekly-recap', async (req, res) => {
  const { user_email, metric, week_start_date, high, low, avg, alert_count } = req.body;

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
    res.status(500).json({ error: 'An error occurred while inserting weekly recap data' });
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
      return res.status(404).json({ error: 'No weekly recap data found for the specified criteria' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching weekly recap data:', error);
    res.status(500).json({ error: 'An error occurred while fetching weekly recap data' });
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
    res.status(500).json({ error: 'An error occurred while fetching week start dates' });
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
    res.status(500).json({ error: 'An error occurred while deleting weekly recap data' });
  }
});


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
