import express from 'express';
import bodyParser from 'body-parser';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import cron from 'node-cron';
// const express = require('express');
// const bodyParser = require('body-parser');
// const twilio = require('twilio');
// const sgMail = require('@sendgrid/mail');
// const cron = require('node-cron');
// const {
//   getLatestThreshold,
//   getWeatherData,
//   getWatchdogData,
//   getRivercityData,
// } = require('./Graphql_helper.js');
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();



// Rest of your code...

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
    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending Email:', error);
  }
};

// // Function to check thresholds
// const checkThresholds = async () => {
//   const thresholds = await getLatestThreshold();

//   for (const threshold of thresholds.data.thresholds) {
//     const { id, metric, high, low, phone, email } = threshold;
//     let currentValueData;
//     switch (metric) {
//       case 'temperature':
//       case 'percent_humidity':
//       case 'wind_speed':
//       case 'rain_15_min_inches':
//       case 'soil_moisture':
//       case 'leaf_wetness':
//         currentValueData = await getWeatherData('all', 1);
//         break;
//       case 'temp':
//       case 'hum':
//         currentValueData = await getWatchdogData('all', 1);
//         break;
//       case 'rctemp':
//       case 'humidity':
//         currentValueData = await getRivercityData('all', 1);
//         break;
//       default:
//         console.error('Invalid metric:', metric);
//     }
//     const currentValue = currentValueData.data.weather_data[0]?.[metric];

//     if (currentValue == null) continue;

//     const now = new Date();
//     const lastAlertTimeDate = new Date(lastAlertTime);

//     if (
//       currentValue > high &&
//       (!lastAlertTimeDate || now - lastAlertTimeDate >= 5 * 60 * 1000)
//     ) {
//       const alertMessage = `Alert: The ${metric} value of ${currentValue} exceeds the high threshold of ${high}.`;
//       if (phone) await sendSMSAlert(phone, alertMessage);
//       if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage);
//       await updateLastAlertTime(id, now.toISOString());
//     }

//     if (
//       currentValue < low &&
//       (!lastAlertTimeDate || now - lastAlertTimeDate >= 5 * 60 * 1000)
//     ) {
//       const alertMessage = `Alert: The ${metric} value of ${currentValue} is below the low threshold of ${low}.`;
//       if (phone) await sendSMSAlert(phone, alertMessage);
//       if (email) await sendEmailAlert(email, 'Threshold Alert', alertMessage);
//       await updateLastAlertTime(id, now.toISOString());
//     }
//   }
// };

// // Schedule the threshold check function to run every 5 minutes
// cron.schedule('*/5 * * * *', checkThresholds);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
