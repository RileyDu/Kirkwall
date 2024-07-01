const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config(); // Ensure this line is at the very top

const app = express();
const port = process.env.PORT || 5000;

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Ensure the credentials are correctly loaded
if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Twilio credentials are missing. Check your .env file.");
}

// Initialize Twilio client
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to send SMS
app.post('/send-sms', async (req, res) => {
  const { to, body } = req.body;
  console.log('Request received to send SMS:', { to, body });

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to,
    });
    console.log('Message sent:', message.sid);
    res.status(200).send({ message: 'SMS sent successfully!', sid: message.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send({ message: 'Failed to send SMS', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
