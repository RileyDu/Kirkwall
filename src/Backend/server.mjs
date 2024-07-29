// checkThresholds.js
import dotenv from 'dotenv';
dotenv.config();
import { getWeatherData, getWatchdogData, getRivercityData, getLatestThreshold, createAlert } from './Graphql_helper.js';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

console.log('Initializing script...');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);

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

const sendEmailAlert = async (to, subject, text, html) => {
  const msg = {
    to: to,
    from: 'alerts@kirkwall.io', // Replace with your verified email
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

const sendAlertToDB = async (metric, message, timestamp) => {
  try {
    console.log(`Sending alert to database: ${message}`);
    await createAlert(metric, message, timestamp);
  } catch (error) {
    console.error('Error sending alert to database:', error);
  }
};

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

const checkThresholds = async () => {
  console.log('Checking thresholds...');

  function formatDateTime(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

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

      if (high !== null && currentValue > high) {
        const now = new Date();
        const formattedDateTime = formatDateTime(now);
        const alertMessage = `Alert: The ${metric} value of ${currentValue} exceeds the high threshold of ${high} at ${formattedDateTime}.`;
        if (phone) await sendSMSAlert(phone, alertMessage);
        if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage, alertMessage);
        if (phone || email) sendAlertToDB(metric, alertMessage, now);
      }

      if (low !== null && currentValue < low) {
        const now = new Date();
        const formattedDateTime = formatDateTime(now);
        const alertMessage = `Alert: The ${metric} value of ${currentValue} is below the low threshold of ${low} at ${formattedDateTime}.`;
        if (phone) await sendSMSAlert(phone, alertMessage);
        if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage, alertMessage);
        if (phone || email) sendAlertToDB(metric, alertMessage, now);
      }
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
    process.exit(1);  // Ensure the script exits with an error code if there's an issue
  }
};

checkThresholds();
