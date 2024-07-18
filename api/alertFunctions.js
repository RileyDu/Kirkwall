import axios from 'axios';

const apiUrl = process.env.NODE_ENV === 'production'
  ? 'https://kirkwall-demo.vercel.app'
  : 'http://localhost:3001';

export const sendSMSAlert = async (to, body) => {
  try {
    const response = await axios.post(`$api/send-sms`, { to, body });
    console.log('SMS Alert sent.', response.data.message);
  } catch (error) {
    console.error('Error sending SMS alert.', error.message);
  }
};

export const sendEmailAlert = async (to, subject, text, html) => {
  try {
    const response = await axios.post(`api/send-email`, { to, subject, text, html });
    console.log('Email Alert sent.', response.data.message);
  } catch (error) {
    console.error('Error sending email alert.', error.message);
  }
};
