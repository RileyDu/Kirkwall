import axios from 'axios';
import { sendSMSAlert, sendEmailAlert } from './alertFunctions';

const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://kirkwall-demo.vercel.app'
  : 'http://localhost:3001';

const checkThresholds = async () => {
  // Fetch the latest thresholds
  const { data: thresholds } = await axios.get(`/api/get-thresholds`);
  const { phoneNumber, userEmail, highThreshold, lowThreshold, metric, lastAlertTime } = thresholds;

  // Mock data for currentValue for testing purposes
  const currentValue = 75; // Replace this with actual value

  const now = new Date();
  const lastAlertTimeObj = lastAlertTime ? new Date(lastAlertTime) : null;

  if (currentValue != null) {
    if (highThreshold < currentValue) {
      const alertMessage = `Alert: The ${metric} value of ${currentValue} exceeds the high threshold of ${highThreshold}.`;
      if (!lastAlertTimeObj || now - lastAlertTimeObj >= 5 * 60 * 1000) {
        phoneNumber && await sendSMSAlert(phoneNumber, alertMessage);
        userEmail && await sendEmailAlert(userEmail, 'Threshold Alert', alertMessage);
        // Update the last alert time in the database
        await axios.post(`${apiUrl}/update-last-alert-time`, { lastAlertTime: now });
      }
    }

    if (lowThreshold > currentValue) {
      const alertMessage = `Alert: The ${metric} value of ${currentValue} is below the low threshold of ${lowThreshold}.`;
      if (!lastAlertTimeObj || now - lastAlertTimeObj >= 5 * 60 * 1000) {
        phoneNumber && await sendSMSAlert(phoneNumber, alertMessage);
        userEmail && await sendEmailAlert(userEmail, 'Threshold Alert', alertMessage);
        // Update the last alert time in the database
        await axios.post(`${apiUrl}/update-last-alert-time`, { lastAlertTime: now });
      }
    }
  }
};

export default async function handler(req, res) {
  // Check for the CRON_SECRET in the Authorization header
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  await checkThresholds();
  res.status(200).json({ message: 'Threshold check complete' });
}
