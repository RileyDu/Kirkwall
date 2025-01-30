import dotenv from 'dotenv';
dotenv.config();
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';
import moment from 'moment-timezone';
import axios from 'axios';
const baseURL = process.env.BACKEND_URL || 'https://kirkwall-demo.vercel.app/'; // Set your backend URL

console.log('BACKEND_URL from .env:', baseURL);

// Initialize only when the function is called
export const checkThresholds = async () => {
  console.log('Checking thresholds...');

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  // Initialize the Twilio client
  const client = twilio(accountSid, authToken);

  const sendGridApiKey = process.env.SENDGRID_API_KEY;
  sgMail.setApiKey(sendGridApiKey);

  const sendAlert = async (alertMessage, metric, phone, email, id, type = 'threshold') => {
    // Log alert to the database if it's a sensor stoppage
    const location = await getLocationforAlert(metric);
    // if (type === 'sensor_stoppage') {
    //   await sendAlertToDB(metric, `Sensor stoppage: ${alertMessage} for ${location}.`, new Date());
    //   await sendSMSAlert(['7016393862'], `Sensor stoppage: ${alertMessage} for ${location}.`, id, null );
    //   return; // Abort further execution to prevent sending SMS/Email
    // }
  
    const formattedDateTime = formatDateTime(new Date());
    const message = `${alertMessage} at ${formattedDateTime} CST for ${location}.`;
  
    // Split phone numbers and emails if available
    const phoneNumbers = phone ? phone.split(',').map(num => num.trim()) : [];
    const emails = email ? email.split(',').map(em => em.trim()) : [];
  
    await sendAlertToDB(metric, message, new Date());
  
    // Send SMS if phone numbers are provided
    if (phoneNumbers.length > 0) await sendSMSAlert(phoneNumbers, message, id, phoneNumbers);
  
    // Send Email if emails are provided
    if (emails.length > 0) await sendEmailAlert(emails, 'Sensor Alert', message, id, phoneNumbers);
  
    lastAlertTimes[id] = new Date(); // Update last alert time to avoid redundant alerts
  };
  
  const checkForSensorStoppage = async (metric, responseData) => {
    if (!responseData || responseData.length === 0) {
      console.error(`No data available for metric: ${metric}`);
      return;
    }
  
    let lastDataPoint = responseData[0] || responseData.data[0]; // Most recent reading
    let lastTimestamp = new Date(
      lastDataPoint.publishedat || 
      lastDataPoint.reading_time || 
      lastDataPoint.message_timestamp
    );
  
    // If the metric starts with 'im' and `publishedat` is used, add 300 minutes (5 hours)
    if (metric.startsWith('im') && lastDataPoint.publishedat) {
      lastTimestamp = new Date(lastTimestamp.getTime() + 300 * 60000); // 300 minutes in milliseconds
    }
  
    const currentTime = new Date(); // Always use UTC for comparison
    const timeDifferenceInMinutes = (currentTime - lastTimestamp) / (1000 * 60); // Convert time difference to minutes
  
    if (timeDifferenceInMinutes > 30) {
      console.log(`Sensor for ${metric} has stopped sending data. Last reading was ${timeDifferenceInMinutes} minutes ago.`);
      
      // const alertMessage = `The sensor for ${metric} has not sent data in over 30 minutes. Last reading at ${formatDateTime(lastTimestamp)}, currently at ${formatDateTime(currentTime)}`;
  
      // await sendAlert(alertMessage, metric, null, null, null, 'sensor_stoppage');
    } else {
      console.log(`Sensor for ${metric} is active. Last reading was ${timeDifferenceInMinutes} minutes ago.`);
    }
  };
  
  
  

  // Send an SMS alert to the specified phone numbers
  const sendSMSAlert = async (
    toNumbers,
    alertMessage,
    thresholdId,
    adminPhone
  ) => {
    const alertUrl = `https://kirkwall-demo.vercel.app/api/thresholds/update_threshold/${thresholdId}?thresh_kill=true&timeframe=${encodeURIComponent(
      '99 days'
    )}`;
    const disableAll = `https://kirkwall-demo.vercel.app/api/thresholds/update_admin_thresh/${adminPhone}?thresh_kill=true`;

    const smsBody = `${alertMessage}.. Click to disable alerts for this sensor: ${alertUrl}.`;

    for (const to of toNumbers) {
      try {
        console.log(`Sending SMS to ${to}: ${smsBody}`);
        await client.messages.create({
          body: smsBody,
          from: twilioPhoneNumber,
          to: to,
        });
      } catch (error) {
        console.error('Error sending SMS:', error);
      }
    }
  };

  // Send an Email alert to the specified email addresses
  const sendEmailAlert = async (
    toEmails,
    subject,
    alertMessage,
    thresholdId,
    adminPhone
  ) => {
    const alertUrl = `https://kirkwall-demo.vercel.app/api/thresholds/update_threshold/${thresholdId}?thresh_kill=true&timeframe=${encodeURIComponent(
      '99 days'
    )}`;
    const disableAll = `https://kirkwall-demo.vercel.app/api/thresholds/update_admin_thresh/${adminPhone}?thresh_kill=true`;
    console.log(adminPhone);
    console.log(disableAll);
    console.log(alertUrl);

    for (const to of toEmails) {
      const msg = {
        to: to,
        from: 'alerts@kirkwall.io',
        subject: subject,
        templateId: 'd-c08fa5ae191549b3aa405cfbc16cd1cd',
        dynamic_template_data: {
          alertmessage: alertMessage,
          // Add a clickable link for disabling the threshold
          disableLink: `<a href="${alertUrl}" style="background-color: #6170E3; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                          Disable Threshold For Sensor
                        </a>`,
          disableAll: `<a href="${disableAll}" style="background-color: #6170E3; color: white; padding: 10px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                          Disable All Thresholds
                        </a>`,
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
      await axios.post(`${baseURL}/api/alerts/create_alert`, {
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

  const checkAlertInterval = async (thresholdId, alertInterval, metric) => {
    try {
      const lastAlertResponse = await axios.get(`${baseURL}/api/thresholds/get_last_alert_time/${thresholdId}`);
      const lastAlertTime = lastAlertResponse.data.lastAlertTime;
      const currentTime = new Date();
  
      if (lastAlertTime) {
        // Parse lastAlertTime properly with new Date()
        const parsedLastAlertTime = new Date(lastAlertTime);
  
        if (isNaN(parsedLastAlertTime)) {
          throw new Error(`Invalid lastAlertTime: ${lastAlertTime}`);
        }
  
        // Manually adjust for the 5-hour time zone difference
        const adjustedLastAlertTime = new Date(parsedLastAlertTime.getTime()); // Add 5 hours
  
        // Calculate the time difference in minutes
        const timeDiffInMinutes = Math.ceil((currentTime - adjustedLastAlertTime) / (1000 * 60));
  
        if (timeDiffInMinutes < alertInterval) {
          console.log(`Skipping ${metric}, interval of ${alertInterval} minutes not yet passed. Time since last alert: ${timeDiffInMinutes.toFixed(2)} minutes.`);
          return false; // Don't send alert if interval hasn't passed
        }
      }
  
      console.log(`${alertInterval} minutes passed since last alert @ ${lastAlertTime || 'N/A'} for ${metric}, alerts can now be sent.`);
      return true; // Allow the alert to be sent
    } catch (error) {
      console.error('Error checking alert interval:', error);
      return true; // Proceed with sending the alert if there's an error
    }
  };
  
  
  // Function to record the time of the first alert
  const recordAlertTime = async (thresholdId, metric) => {
    const currentTime = moment.utc().toISOString(); // Current time in UTC format
    try {
      await axios.put(`${baseURL}/api/thresholds/update_last_alert_time/${thresholdId}`, { lastAlertTime: currentTime });
      console.log(`Recorded new alert time for ${metric}`);
    } catch (error) {
      console.error('Error recording alert time:', error);
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
    // If the timeframe is an object and represents an indefinite pause
    if (typeof timeframe === 'object' && timeframe.days === 99) {
      console.log('Timeframe is an indefinite pause: 99 days');
      return null; // Return null to represent indefinite pause
    }

    // Check if timeframe is an object with specific hours, minutes, or seconds
    if (typeof timeframe === 'object') {
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = timeframe;
      console.log('Processing timeframe object:', timeframe);
      return moment.duration({ days, hours, minutes, seconds });
    }

    // Handle string-based timeframe, for example: "2 days, 03:00:00"
    console.log('Processing string timeframe:', timeframe);

    let days = 0;
    let timePart = timeframe;

    // Extract days if the string includes a 'day' part
    if (timeframe.includes('day')) {
      const dayMatch = timeframe.match(/(\d+) day/);
      if (dayMatch) {
        days = parseInt(dayMatch[1], 10);
      }
      // Split the timeframe into the day and time parts
      timePart = timeframe.split(', ')[1] || '0:00:00';
    }

    // Split the time part into hours, minutes, and seconds
    const [hours = 0, minutes = 0, seconds = 0] = timePart
      .split(':')
      .map(Number);

    // Return a moment duration object with the extracted values
    return moment.duration({ days, hours, minutes, seconds });
  };

  function formatDateTime(date) {
    const timezone = 'America/Chicago';
    const localDate = moment(date).tz(timezone);
    return localDate.format('MMMM D, YYYY h:mm A');
  }

  const debounceTime = 5 * 60 * 1000; // 5 minutes in milliseconds

  try {
    const admins = await axios.get(`${baseURL}/api/admin`);
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
        alert_interval,
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
        if (typeof timeframe === 'object' && timeframe.days === 99) {
          console.log(
            `Skipping threshold check for ${metric} due to indefinite pause at sensor-level.`
          );
          continue; // Skip further processing for this metric
        }

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
            await axios.post(`${baseURL}/api/thresholds/create_threshold`, {
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

      const shouldSendAlert = await checkAlertInterval(id, alert_interval || 10, metric); // Default to 10 minutes if no interval is provided

      if (!shouldSendAlert) continue; // Skip if interval hasn't passed


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
          responseData = await axios.get(`${baseURL}/api/weather_data?limit=3`);
          break;

        case 'temp':
        case 'hum':
          responseData = await axios.get(
            `${baseURL}/api/watchdog_data?limit=3`
          );
          break;
        default:
          console.error('Invalid metric:', metric);
      }

      await checkForSensorStoppage(metric, responseData);

      const currentValue = extractCurrentValue(responseData, metric);
      const { label, addSpace } = getLabelForMetric(metric);
      const formatValue = value => `${value}${addSpace ? ' ' : ''}${label}`;

      if (currentValue == null) continue;

      const now = new Date();

      if (lastAlertTimes[id] && now - lastAlertTimes[id] < debounceTime) {
        console.log(`Skipping alert for ${metric}, recently alerted.`);
        continue;
      }

      if (high !== null) {
        if (currentValue > high) {
          console.log(
            `${metric} High threshold exceeded: CURRENT = ${currentValue} // HIGH THRESHOLD = ${high}`
          );
          await sendAlert(
            `Alert: The ${metric} value of ${formatValue(
              currentValue
            )} exceeds the high threshold of ${formatValue(high)}`,
            metric,
            phone,
            email,
            id
          );
          await recordAlertTime(id, metric);
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
            )} is below the low threshold of ${formatValue(low)}`,
            metric,
            phone,
            email,
            id
          );
          await recordAlertTime(id, metric);

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
    hum: { label: '%', addSpace: false },
    percent_humidity: { label: '%', addSpace: false },
    rain_15_min_inches: { label: 'inches', addSpace: true },
    wind_speed: { label: 'MPH', addSpace: true },
    soil_moisture: { label: 'centibars', addSpace: true },
    leaf_wetness: { label: 'out of 15', addSpace: true },
  };

  return metricLabels[metric] || { label: '', addSpace: false };
};

// module.exports = { checkThresholds };
