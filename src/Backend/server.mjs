// checkThresholds.js
import dotenv from 'dotenv';
dotenv.config();
import {
  getWeatherData,
  getWatchdogData,
  getRivercityData,
  getLatestThreshold,
  createAlert,
  getChartData,
  getImpriMedData,
  getAllAdmins,
  createThreshold
} from './Graphql_helper.js';
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import moment from 'moment-timezone';

console.log('Initializing script...');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);

// Send an SMS alert to the specified phone numbers for the metric whose threshold was exceeded
const sendSMSAlert = async (toNumbers, body) => {
  for (const to of toNumbers) {
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
  }
};

// Send an Email alert to the specified email addresses for the metric whose threshold was exceeded
const sendEmailAlert = async (toEmails, subject, alertMessage) => {
  for (const to of toEmails) {
    const msg = {
      to: to,
      from: 'alerts@kirkwall.io',
      subject: subject,
      templateId: 'd-c08fa5ae191549b3aa405cfbc16cd1cd',
      dynamic_template_data: {
        alertmessage: alertMessage,
      },
    };

    try {
      console.log(`Sending Email to ${to}: ${subject}`);
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending Email:', error);
    }
  }
};

// Send an alert to the database for the metric whose threshold was exceeded
const sendAlertToDB = async (metric, message, timestamp) => {
  try {
    console.log(`Sending alert to database: ${message}`);
    await createAlert(metric, message, timestamp);
  } catch (error) {
    console.error('Error sending alert to database:', error);
  }
};

// Sensor locations for alert messages, more descriptive than the metric name in the email/SMS
const getLocationforAlert = async (metric) => {
  try {
    console.log('Getting location data for alert message...');
    const response = await getChartData();
    const charts = response.data.charts;
    const location = charts.find(chart => chart.metric === metric)?.location;
    return location;
  } catch (error) {
    console.error('Error getting location for alert:', error);
  }
};

// Extract the current value of the metric from the response data
const extractCurrentValue = (response, metric) => {
  if (Array.isArray(response)) {
    return response[0]?.[metric];
  }

  if (response && response.data) {
    if (Array.isArray(response.data.weather_data)) {
      return response.data.weather_data[0]?.[metric];
    } else if (Array.isArray(response.data.watchdog_data)) {
      return response.data.watchdog_data[0]?.[metric];
    } else if (Array.isArray(response.data.rivercity_data)) {
      return response.data.rivercity_data[0]?.[metric];
    }
  }

  console.error('Invalid response structure:', response);
  return null;
};

// Get the latest thresholds for each metric
const getLatestThresholds = (thresholds) => {
  const latestThresholds = {};

  thresholds.forEach(threshold => {
    const { metric } = threshold;

    if (
      !latestThresholds[metric] ||
      new Date(threshold.timestamp) >
        new Date(latestThresholds[metric].timestamp)
    ) {
      latestThresholds[metric] = threshold;
    }
  });

  return Object.values(latestThresholds);
};

// In-memory store for last alert times to prevent spamming alerts
const lastAlertTimes = {};

// Function to parse timeframe (e.g., "1 day, 0:00:00") to a moment duration
const parseTimeframeToDuration = (timeframe) => {
  let days = 0;
  let timePart = timeframe;

  if (timeframe.includes('day')) {
    const dayMatch = timeframe.match(/(\d+) day/);
    if (dayMatch) {
      days = parseInt(dayMatch[1], 10);
    }
    timePart = timeframe.split(', ')[1] || "0:00:00";
  }

  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  return moment.duration({
    days,
    hours,
    minutes,
    seconds
  });
};

// Main function to check thresholds
const checkThresholds = async () => {
  console.log('Checking thresholds...');

  function formatDateTime(date) {
    const timezone = 'America/Chicago';
    const localDate = moment(date).tz(timezone);
    return localDate.format('MMMM D, YYYY h:mm A');
  }

  const debounceTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  try {
    const thresholds = await getLatestThreshold();
    const latestThresholds = getLatestThresholds(thresholds.data.thresholds);
    const admins = await getAllAdmins();

    for (const threshold of latestThresholds) {
      const { id, metric, high, low, phone, email, thresh_kill, timeframe, timestamp } = threshold;
      const emails = email ? email.split(',').map(em => em.trim()) : [];
      const adminThreshKill = emails.some(email => {
        const admin = admins.data.admin.find(admin => admin.email === email);
        return admin && admin.thresh_kill;
      });

      if (adminThreshKill) {
        console.log(`Skipping threshold check for ${metric} due to admin-level thresh_kill.`);
        continue;
      }

      // Check individual threshold killswitch and timeframe
      if (thresh_kill && timeframe) {
        const timePeriodDuration = parseTimeframeToDuration(timeframe); // Use new parser
        const pauseEndTime = moment(timestamp).add(timePeriodDuration);

        if (moment().isBefore(pauseEndTime)) {
          console.log(`Skipping threshold check for ${metric} due to sensor-level pause still active. ${formatDateTime(pauseEndTime)}`);
          continue;
        } else {
          console.log(`Threshold-level pause has expired for ${metric}, resuming checks. ${formatDateTime(pauseEndTime)} was the pause end time.`);
          
          const timestampNow = new Date().toISOString();
          try {
            await createThreshold(
              metric,
              high,
              low,
              phone,
              email,
              timestampNow,
              false, // Set thresh_kill to false
              null // Clear the timeframe
            );
            console.log(`New threshold entry created for ${metric} with thresh_kill off and no timeframe.`);
            console.log(`Timestamp: ${timestampNow}, metric: ${metric}, high: ${high}, low: ${low}, phone: ${phone}, email: ${email}, thresh_kill: false, timeframe: null`);
            
          } catch (error) {
            console.error('Error creating new threshold entry:', error);
          }
        }
      }

      // Continue with the rest of the threshold logic, like checking the current value, sending alerts, etc...
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
    process.exit(1); // Ensure the script exits with an error code if there's an issue
  }
};

if (import.meta.url === `file://${process.argv[1]}`) {
  checkThresholds();
}
