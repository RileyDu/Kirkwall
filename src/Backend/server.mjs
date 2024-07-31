// checkThresholds.js
import dotenv from 'dotenv';
dotenv.config();
import { getWeatherData, getWatchdogData, getRivercityData, getLatestThreshold, createAlert, getChartData } from './Graphql_helper.js';
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

const sendEmailAlert = async (to, subject, alertMessage) => {
  const msg = {
    to: to,
    from: 'alerts@kirkwall.io', // Replace with your verified email
    subject: subject,
    templateId: 'd-c08fa5ae191549b3aa405cfbc16cd1cd', // Replace with your SendGrid template ID
    dynamic_template_data: {
      alertmessage: alertMessage,
    }
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
}

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

const lastAlertTimes = {};  // In-memory store for last alert times

const checkThresholds = async () => {
  console.log('Checking thresholds...');

  function formatDateTime(date) {
    const timezone = 'America/Chicago'; // Set your desired timezone here
    const localDate = moment(date).tz(timezone);
    return localDate.format('MMMM D, YYYY h:mm A');
  }

  const debounceTime = 5 * 60 * 1000;  // 5 minutes in milliseconds

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

      const getLabelForMetric = (metric) => {
        switch (metric) {
          case 'temperature':
            return { label: '°F', addSpace: false };
          case 'temp':
            return { label: '°F', addSpace: false };
            case 'rctemp':
              return { label: '°F', addSpace: false };
          case 'hum':
            return { label: '%', addSpace: false };
          case 'percent_humidity':
            return { label: '%', addSpace: false };
          case 'humidity':
            return { label: '%', addSpace: false };
          case 'rain_15_min_inches':
            return { label: 'inches', addSpace: true };
          case 'wind_speed':
            return { label: 'MPH', addSpace: true };
          case 'soil_moisture':
            return { label: 'centibars', addSpace: true };
          case 'leaf_wetness':
            return { label: 'out of 15', addSpace: true };
          default:
            return { label: '', addSpace: false };
        }
      };

      const { label, addSpace } = getLabelForMetric(metric);
      const formatValue = (value) => `${value}${addSpace ? ' ' : ''}${label}`;

      if (currentValue == null) continue;

      const now = new Date();

      // Check if the alert was recently sent
      if (lastAlertTimes[id] && (now - lastAlertTimes[id] < debounceTime)) {
        console.log(`Skipping alert for ${metric}, recently alerted.`);
        continue;
      }

      const sendAlert = async (alertMessage) => {
        const formattedDateTime = formatDateTime(now);
        const location = await getLocationforAlert(metric);
        const message = `${alertMessage} at ${formattedDateTime} for ${location}.`;
      
        if (phone) await sendSMSAlert(phone, message);
        if (email) await sendEmailAlert(email, 'Threshold Alert', message);
        if (phone || email) await sendAlertToDB(metric, message, now);
      
        lastAlertTimes[id] = now;  // Update last alert time
      };
      
      if (high !== null && currentValue > high) {
        await sendAlert(`Alert: The ${metric} value of ${formatValue(currentValue)} exceeds the high threshold of ${formatValue(high)}`);
      } else if (low !== null && currentValue < low) {
        await sendAlert(`Alert: The ${metric} value of ${formatValue(currentValue)} is below the low threshold of ${formatValue(low)}`);
      }      
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
    process.exit(1);  // Ensure the script exits with an error code if there's an issue
  }
};


if (import.meta.url === `file://${process.argv[1]}`) {
  checkThresholds();
}