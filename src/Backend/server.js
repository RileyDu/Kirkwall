// server.js

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials from environment variables
const accountSid = "ACad06041d60cfeb7b97375601e4414634";
const authToken ="e978f8d6af51acdaf1a3ceff445dd37c";
const twilioPhoneNumber = "+17019296775";

// Initialize Twilio client
const client = twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to send SMS
app.post('/send-sms', async (req, res) => {
  const { to, body } = req.body;

  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to,
    });
    res.status(200).send({ message: 'SMS sent successfully!', sid: message.sid });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).send({ message: 'Failed to send SMS', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});