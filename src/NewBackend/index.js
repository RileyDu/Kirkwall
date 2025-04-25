// ==============================
// Importing Dependencies
// ==============================
import express from 'express';
import pkg from 'pg';
const { Client } = pkg; // PostgreSQL client using ES module syntax
import cors from 'cors'; // CORS middleware
import dotenv from 'dotenv'; // Environment variable management
import multer from 'multer'; // File upload middleware
import sgMail from '@sendgrid/mail'; // SendGrid for sending emails
import puppeteer from 'puppeteer'; // Headless browser for web scraping
import * as cheerio from 'cheerio'; // HTML parsing
import * as chromium from 'chrome-aws-lambda'; // Chromium for AWS Lambda
import { checkThresholds } from './cron/checkThresholds.js'; // Cron job for threshold checks
import { generateWeeklyRecap } from './cron/cronWeeklyRecap.js'; // Cron job for weekly recap
import openai from './openaiClient.js'; // OpenAI client
import { createObjectCsvStringifier } from 'csv-writer'; // CSV writer

// ==============================
// Configuration and Middleware Setup
// ==============================
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;


// Conditional Middleware for Production
if (process.env.NODE_ENV === 'production') {
}
app.use(express.json());

app.use(cors()); // Enable CORS for all origins

// ==============================
// Database Connection
// ==============================
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

// Connect to PostgreSQL database
client
  .connect()
  .then(() => console.log('Server: Connected to PostgreSQL'))
  .catch(err => console.error('Server: Connection error', err.stack));

// ==============================
// Importing Route Modules
// ==============================
import weatherRoutes from './routes/weatherRoutes.js';
import watchdogRoutes from './routes/watchdogRoutes.js';
import thresholdsRoutes from './routes/thresholdsRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chartsRoutes from './routes/chartsRoutes.js';
import emailEnquiryRoutes from './routes/emailEnquiryRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import energyInfoRoutes from './routes/energyInfoRoutes.js';
import weeklyRecapRoutes from './routes/weeklyRecapRoutes.js';
import sensorDataRoutes from './routes/sensorDataRoutes.js';
import webScrapingRoutes from './routes/webScrapingRoutes.js';
import mockDataRoutes from './routes/mockDataRoutes.js';
import dataExportRoutes from './routes/dataExportRoutes.js';
import naturalLanguageQueryRoutes from './routes/naturalLanguageQueryRoutes.js';
import monnitRoutes from './routes/monnitRoutes.js';
import disasterShieldRoutes from './routes/disasterShieldRoutes.js';

// ==============================
// Mounting Route Modules
// ==============================
app.use('/api/weather_data', weatherRoutes);
app.use('/api/watchdog_data', watchdogRoutes);
app.use('/api/thresholds', thresholdsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/charts', chartsRoutes);
app.use('/api/send-enquiry', emailEnquiryRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/energy-info', energyInfoRoutes);
app.use('/api/weekly-recap', weeklyRecapRoutes);
app.use('/api/sensor_data', sensorDataRoutes);
app.use('/api/scrape', webScrapingRoutes);
app.use('/api/mockdata', mockDataRoutes);
app.use('/api/export_data', dataExportRoutes);
app.use('/api/nlquery', naturalLanguageQueryRoutes);
app.use('/api/monnit', monnitRoutes);
app.use('/api/disastershield', disasterShieldRoutes);

// ==============================
// Catch-All Route for Undefined API Endpoints
// ==============================
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ==============================
// Cron Job Routes
// ==============================

// Route to manually trigger the threshold check cron job
app.get('/api/run-check-thresholds', async (req, res) => {
  try {
    await checkThresholds(); // Call your cron job logic
    res.status(200).json({ message: 'Threshold check completed.' });
  } catch (error) {
    console.error('Server: Error running threshold check:', error);
    res.status(500).json({ error: 'Failed to run threshold check' });
  }
});

// Route to manually trigger the weekly recap cron job
app.get('/api/run-weekly-recap', async (req, res) => {
  try {
    await generateWeeklyRecap(); // Call the new weekly recap cron job logic
    res.status(200).json({ message: 'Weekly recap generation completed.' });
  } catch (error) {
    console.error('Server: Error generating weekly recap:', error);
    res.status(500).json({ error: 'Failed to generate weekly recap' });
  }
});

// ==============================
// Root Route
// ==============================
app.get('/', (req, res) => res.send('Express on Vercel'));

// ==============================
// Server Initialization
// ==============================

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
