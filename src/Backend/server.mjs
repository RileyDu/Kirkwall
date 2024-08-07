// checkThresholds.js
import dotenv from 'dotenv';
dotenv.config();
import { getWeatherData, getWatchdogData, getRivercityData, getLatestThreshold, createAlert, getChartData, getImpriMedData } from './Graphql_helper.js';
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
    const renameKeyToMetric = (data, metric) => {
      return data.map(d => {
        const value = metric.endsWith('Temp') ? d.rctemp : d.humidity;
        return {
          [metric]: value,
          publishedat: d.publishedat,
        };
      });
    };

    for (const threshold of latestThresholds) {
      const { id, metric, high, low, phone, email } = threshold;
      let responseData;
      let latestData;

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
        case 'imFreezerOneTemp':
          latestData = await getImpriMedData("deveui = '0080E1150618C9DE'", 1);
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFreezerOneTemp);
          break;
        case 'imFreezerOneHum':
          latestData = await getImpriMedData("deveui = '0080E1150618C9DE'", 1);
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFreezerOneHum);
          break;
        case 'imFreezerTwoTemp':
          latestData = await getImpriMedData("deveui = '0080E115054FC6DF'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, 'imFreezerTwoTemp');
          break;
        case 'imFreezerTwoHum':
          latestData = await getImpriMedData("deveui = '0080E115054FC6DF'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, 'imFreezerTwoHum');
          break;
        case 'imFreezerThreeTemp':
          latestData = await getImpriMedData("deveui = '0080E1150618B549'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFreezerThreeTemp);
          break;
        case 'imFreezerThreeHum':
          latestData = await getImpriMedData("deveui = '0080E1150618B549'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFreezerThreeHum);
          break;
        case 'imFridgeOneTemp':
          latestData = await getImpriMedData("deveui = '0080E1150619155F'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFridgeOneTemp);
          break;
        case 'imFridgeOneHum':
          latestData = await getImpriMedData("deveui = '0080E1150619155F'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFreezerOneHum);
          break;
        case 'imFridgeTwoTemp':
          latestData = await getImpriMedData("deveui = '0080E115061924EA'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFridgeTwoTemp);
          break;
        case 'imFridgeTwoHum':
          latestData = await getImpriMedData("deveui = '0080E115061924EA'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imFridgeTwoHum);
          break;
        case 'imIncubatorOneTemp':
          latestData = await getImpriMedData("deveui = '0080E115054FF1DC'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imIncubatorOneTemp);
          break;
        case 'imIncubatorOneHum':
          latestData = await getImpriMedData("deveui = '0080E115054FF1DC'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imIncubatorOneHum);
          break;
        case 'imIncubatorTwoTemp':
          latestData = await getImpriMedData("deveui = '0080E1150618B45F'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imIncubatorTwoTemp);
          break;
        case 'imIncubatorTwoHum':
          latestData = await getImpriMedData("deveui = '0080E1150618B45F'",1)
          responseData = renameKeyToMetric(latestData.data.rivercity_data, imIncubatorTwoHum);
          break;
        default:
          console.error('Invalid metric:', metric);
          continue;
      }

      const currentValue = extractCurrentValue(responseData, metric);

      const getLabelForMetric = metric => {
        const metricLabels = {
          temperature: { label: '°F', addSpace: false },
          temp: { label: '°F', addSpace: false },
          rctemp: { label: '°F', addSpace: false },
      
          imFreezerOneTemp: { label: '°C', addSpace: false },
          imFreezerTwoTemp: { label: '°C', addSpace: false },
          imFreezerThreeTemp: { label: '°C', addSpace: false },
          imFridgeOneTemp: { label: '°C', addSpace: false },
          imFridgeTwoTemp: { label: '°C', addSpace: false },
          imIncubatorOneTemp: { label: '°C', addSpace: false },
          imIncubatorTwoTemp: { label: '°C', addSpace: false },
      
          imFreezerOneHum: { label: '%', addSpace: false },
          imFreezerTwoHum: { label: '%', addSpace: false },
          imFreezerThreeHum: { label: '%', addSpace: false },
          imFridgeOneHum: { label: '%', addSpace: false },
          imFridgeTwoHum: { label: '%', addSpace: false },
          imIncubatorOneHum: { label: '%', addSpace: false },
          imIncubatorTwoHum: { label: '%', addSpace: false },
      
          hum: { label: '%', addSpace: false },
          percent_humidity: { label: '%', addSpace: false },
          humidity: { label: '%', addSpace: false },
          rain_15_min_inches: { label: 'inches', addSpace: true },
          wind_speed: { label: 'MPH', addSpace: true },
          soil_moisture: { label: 'centibars', addSpace: true },
          leaf_wetness: { label: 'out of 15', addSpace: true },
        };
      
        return metricLabels[metric] || { label: '', addSpace: false };
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