const dotenv = require('dotenv');
dotenv.config({ path: 'src/NewBackend/.env' });
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const moment = require('moment-timezone');
const axios = require('axios');
const baseURL = process.env.BACKEND_URL || 'https://kirkwall-demo.vercel.app/'; // Set your backend URL

// Initialize only when the function is called
const checkThresholds = async () => {
  console.log('Checking thresholds...');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  // Initialize the Twilio client
  const client = twilio(accountSid, authToken);

  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(sendGridApiKey);

  // Send an SMS alert to the specified phone numbers
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

  // Send an Email alert to the specified email addresses
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

  // Send an alert to the database
  const sendAlertToDB = async (metric, message, timestamp) => {
    try {
      console.log(`Sending alert to database: ${message}`);
      await axios.post(`${baseURL}/api/create_alert`, {
        metric: metric,
        message: message,
        timestamp: timestamp,
      });
    } catch (error) {
      console.error('Error sending alert to database:', error);
    }
  };

  // Sensor locations for alert messages
  const getLocationforAlert = async metric => {
    try {
      console.log('Getting location data for alert message...');
      const response = await axios.get(`${baseURL}/api/charts`);
      const charts = response.data;
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
      return response.data[0]?.[metric];
    }

    console.error('Invalid response structure:', response);
    return null;
  };

  // Get the latest thresholds for each metric
  const getLatestThresholds = thresholds => {
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

  // In-memory store for last alert times
  const lastAlertTimes = {};

  const parseTimeframeToDuration = timeframe => {
    // Check if timeframe is an object and convert it to a string if necessary
    if (typeof timeframe === 'object') {
      console.error('Timeframe is an object:', timeframe);
      timeframe = JSON.stringify(timeframe);
    }

    console.log('Processing timeframe:', timeframe);

    let days = 0;
    let timePart = timeframe;

    // Handle the 'day' part if it exists
    if (timeframe.includes('day')) {
      const dayMatch = timeframe.match(/(\d+) day/);
      if (dayMatch) {
        days = parseInt(dayMatch[1], 10);
      }
      timePart = timeframe.split(', ')[1] || '0:00:00';
    }

    // Split the timeframe into hours, minutes, and seconds
    const [hours = 0, minutes = 0, seconds = 0] = timePart
      .split(':')
      .map(Number);

    return moment.duration({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  function formatDateTime(date) {
    const timezone = 'America/Chicago';
    const localDate = moment(date).tz(timezone);
    return localDate.format('MMMM D, YYYY h:mm A');
  }

  const debounceTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  try {
    const admins = await axios.get(`${baseURL}/api/admins`);
    // console.log('Admins data:', admins.data);
    const thresholds = await axios.get(`${baseURL}/api/thresholds`);
    // console.log('Thresholds data:', thresholds.data);
    const latestThresholds = getLatestThresholds(thresholds.data);

    for (const threshold of latestThresholds) {
      //   console.log('Processing threshold:', threshold);

      const {
        id,
        metric,
        high,
        low,
        phone,
        email,
        thresh_kill,
        timeframe,
        timestamp,
      } = threshold;
      // console.log('=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=');
      // console.log(`Checking threshold for metric: ${metric}`);

      // Split and trim emails and phone numbers
      const emails = email ? email.split(',').map(em => em.trim()) : [];
      const phones = phone ? phone.split(',').map(ph => ph.trim()) : [];

      // Check if any admin matches for the threshold alert credentials email or phone and has thresh_kill set to true
      const adminThreshKillByEmail = emails.some(email => {
        const admin = admins.data.find(admin => admin.email === email);
        return admin && admin.thresh_kill;
      });

      const adminThreshKillByPhone = phones.some(phone => {
        const admin = admins.data.find(admin => admin.phone === phone);
        return admin && admin.thresh_kill;
      });

      // If either email or phone returns true for thresh_kill, skip the threshold check
      if (adminThreshKillByEmail || adminThreshKillByPhone) {
        console.log(
          `Skipping threshold check for ${metric} due to admin-level thresh_kill.`
        );
        continue;
      }

      // Check individual threshold killswitch and timeframe
      if (thresh_kill && timeframe) {
        const timePeriodDuration = parseTimeframeToDuration(timeframe);
        const pauseEndTime = moment(timestamp).add(timePeriodDuration);

        if (moment().isBefore(pauseEndTime)) {
          console.log(
            `Skipping threshold check for ${metric} due to sensor-level pause still active. ${formatDateTime(
              pauseEndTime
            )} is the end time of the pause.`
          );
          continue;
        } else {
          console.log(
            `Threshold-level pause has expired for ${metric}, resuming checks. ${formatDateTime(
              pauseEndTime
            )} was the pause end time.`
          );

          const timestampNow = new Date().toISOString();
          try {
            await axios.post(`${baseURL}/api/create_threshold`, {
              metric,
              high: high,
              low: low,
              phone: phone,
              email: email,
              timestamp: timestampNow,
              thresh_kill: false,
              timeframe: null,
            });
            console.log(
              `New threshold entry created for ${metric} with thresh_kill off and no timeframe.`
            );
            console.log(
              `Timestamp: ${timestampNow}, metric: ${metric}, high: ${high}, low: ${low}, phone: ${phone}, email: ${email}, thresh_kill: false, timeframe: null`
            );
          } catch (error) {
            console.error('Error creating new threshold entry:', error);
          }
        }
      }

      const renameKeyToMetric = (data, metric) => {
        return data.map(d => {
          const value = metric.endsWith('Temp') ? d.rctemp : d.humidity;
          return {
            [metric]: value,
            publishedat: d.publishedat,
          };
        });
      };

      // Get the latest data for the metric
      let responseData;
      let response;
      let formattedData;

      switch (metric) {
        case 'temperature':
        case 'percent_humidity':
        case 'wind_speed':
        case 'rain_15_min_inches':
        case 'soil_moisture':
        case 'leaf_wetness':
          responseData = await axios.get(`${baseURL}/api/weather_data?limit=1`);
          break;

        case 'temp':
        case 'hum':
          responseData = await axios.get(
            `${baseURL}/api/watchdog_data?limit=1`
          );
          break;

        case 'rctemp':
        case 'humidity':
          responseData = await axios.get(
            `${baseURL}/api/rivercity_data?limit=1`
          );
          break;

        case 'imFreezerOneTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618C9DE&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerOneTemp');
          break;

        case 'imFreezerOneHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618C9DE&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerOneHum');
          break;

        case 'imFreezerTwoTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115054FC6DF&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerTwoTemp');
          break;

        case 'imFreezerTwoHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115054FC6DF&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerTwoHum');
          break;

        case 'imFreezerThreeTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618B549&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerThreeTemp');
          break;

        case 'imFreezerThreeHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618B549&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFreezerThreeHum');
          break;

        case 'imFridgeOneTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150619155F&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFridgeOneTemp');
          break;

        case 'imFridgeOneHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150619155F&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFridgeOneHum');
          break;

        case 'imFridgeTwoTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115061924EA&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFridgeTwoTemp');
          break;

        case 'imFridgeTwoHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115061924EA&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imFridgeTwoHum');
          break;

        case 'imIncubatorOneTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115054FF1DC&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imIncubatorOneTemp');
          break;

        case 'imIncubatorOneHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E115054FF1DC&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imIncubatorOneHum');
          break;

        case 'imIncubatorTwoTemp':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618B45F&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imIncubatorTwoTemp');
          break;

        case 'imIncubatorTwoHum':
          response = await axios.get(
            `${baseURL}/api/impriMed_data?deveui=0080E1150618B45F&limit=1`
          );
          formattedData = response.data;
          responseData = renameKeyToMetric(formattedData, 'imIncubatorTwoHum');
          break;

        default:
          console.error('Invalid metric:', metric);
      }

      const currentValue = extractCurrentValue(responseData, metric);
      const { label, addSpace } = getLabelForMetric(metric);
      const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

      if (currentValue == null) continue;

      const now = new Date();

      if (lastAlertTimes[id] && now - lastAlertTimes[id] < debounceTime) {
        console.log(`Skipping alert for ${metric}, recently alerted.`);
        continue;
      }

      const sendAlert = async alertMessage => {
        const formattedDateTime = formatDateTime(now);
        const location = await getLocationforAlert(metric);
        const message = `${alertMessage} at ${formattedDateTime} for ${location}.`;

        const phoneNumbers = phone
          ? phone.split(',').map(num => num.trim())
          : [];
        const emails = email ? email.split(',').map(em => em.trim()) : [];

        if (phoneNumbers.length > 0) await sendSMSAlert(phoneNumbers, message);
        if (emails.length > 0)
          await sendEmailAlert(emails, 'Threshold Alert', message);
        if (phoneNumbers.length > 0 || emails.length > 0)
          await sendAlertToDB(metric, message, now);

        lastAlertTimes[id] = now;
      };
      if (high !== null) {
        if (currentValue > high) {
          console.log(
            `${metric} High threshold exceeded: CURRENT = ${currentValue} // HIGH THRESHOLD = ${high}`
          );
          await sendAlert(
            `Alert: The ${metric} value of ${formatValue(
              currentValue
            )} exceeds the high threshold of ${formatValue(high)}`
          );
        } else {
          console.log(
            `${metric} High threshold NOT exceeded: CURRENT = ${currentValue} // HIGH THRESHOLD = ${high}`
          );
        }
      }

      // Check if the current value is below the low threshold
      if (low !== null) {
        if (currentValue < low) {
          console.log(
            `${metric} LOW threshold exceeded: CURRENT = ${currentValue} // LOW THRESHOLD = ${low}`
          );
          await sendAlert(
            `Alert: The ${metric} value of ${formatValue(
              currentValue
            )} is below the low threshold of ${formatValue(low)}`
          );
        } else {
          console.log(
            `${metric} LOW threshold NOT exceeded: CURRENT = ${currentValue} // LOW THRESHOLD = ${low}`
          );
        }
      }
    }
  } catch (error) {
    console.error('Error checking thresholds:', error);
  }
};

// Function to get the label for the metric for UX purposes
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

module.exports = { checkThresholds };
