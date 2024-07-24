import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import cron from 'node-cron';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import { getWeatherData, getWatchdogData, getRivercityData, getLatestThreshold } from './Graphql_helper.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// Initialize SendGrid keys
const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Function to send SMS alert
const sendSMSAlert = async (to, body) => {
  try {
    console.log(`Sending SMS to ${to}: ${body}`);
    await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Function to send Email alert
const sendEmailAlert = async (to, subject, text, html) => {
  const msg = {
    to: to,
    from: 'evan@kirkwall.io', // Replace with your verified email
    subject: subject,
    text: text,
    html: html,
  };

  try {
    console.log(`Sending Email to ${to}: ${subject}`);
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending Email:', error);
  }
};

// Utility function to extract current value based on the metric and response structure
const extractCurrentValue = (response, metric) => {
  if (Array.isArray(response.data.weather_data)) {
    return response.data.weather_data[0]?.[metric];
  } else if (Array.isArray(response.data.watchdog_data)) {
    return response.data.watchdog_data[0]?.[metric];
  } else if (Array.isArray(response.data.rivercity_data)) {
    return response.data.rivercity_data[0]?.[metric];
  }
  return null;
};

// In-memory store to track last alert times for debouncing
// const lastAlertTimes = {};

// Function to get the latest thresholds for each metric
const getLatestThresholds = (thresholds) => {
  const latestThresholds = {};

  thresholds.forEach(threshold => {
    const { metric, timestamp } = threshold;

    if (!latestThresholds[metric] || new Date(threshold.timestamp) > new Date(latestThresholds[metric].timestamp)) {
      latestThresholds[metric] = threshold;
    }
  });

  return Object.values(latestThresholds);
};

// Function to check thresholds and send alerts
const checkThresholds = async () => {
  console.log('Checking thresholds...');
  try {
    const thresholds = await getLatestThreshold();
    const latestThresholds = getLatestThresholds(thresholds.data.thresholds);

    for (const threshold of latestThresholds) {
      const { id, metric, high, low, phone, email } = threshold;
      let responseData;

      switch (metric) {
        case 'temperature':
        case 'percent_humidity':
        case 'wind_speed':
        case 'rain_15_min_inches':
        case 'soil_moisture':
        case 'leaf_wetness':
          responseData = await getWeatherData('all', 1);
          break;
        case 'temp':
        case 'hum':
          responseData = await getWatchdogData('all', 1);
          break;
        case 'rctemp':
        case 'humidity':
          responseData = await getRivercityData('all', 1);
          break;
        default:
          console.error('Invalid metric:', metric);
          continue;
      }

      const currentValue = extractCurrentValue(responseData, metric);

      if (currentValue == null) continue;

      // const now = new Date();
      // const lastAlertTime = lastAlertTimes[id] || 0;
      // const timeSinceLastAlert = now - lastAlertTime;

      // if (timeSinceLastAlert < 300000) { // 5 minutes in milliseconds
      //   console.log(`Skipping alert for ${metric}, recently alerted.`);
      //   continue;
      // }

      if (currentValue > high) {
        const alertMessage = `Alert: The ${metric} value of ${currentValue} exceeds the high threshold of ${high}.`;
        if (phone) await sendSMSAlert(phone, alertMessage);
        if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage, alertMessage);
        // lastAlertTimes[id] = now;
      }

      if (currentValue < low) {
        const alertMessage = `Alert: The ${metric} value of ${currentValue} is below the low threshold of ${low}.`;
        if (phone) await sendSMSAlert(phone, alertMessage);
        if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage, alertMessage);
        // lastAlertTimes[id] = now;
      }
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
  }
};

// Schedule the threshold check function to run every 5 minutes
console.log('Scheduling cron job for checking thresholds every 5 minutes...');
cron.schedule('*/5 * * * *', checkThresholds);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
