const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
require('dotenv').config(); // Ensure this line is at the very top
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

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

//Initialize SengGrid keys
const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);

// Ensure the SendGrid API key is correctly loaded
if (!sendGridApiKey) {
  throw new Error("SendGrid API key is missing. Check your .env file.");
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to send SMS
thresholdtemp: [highThreshold, lowThreshold];
app.post('/send-email', async (req, res) => {
  const { to, tempData, thresholdtemp } = req.body;
  console.log('Request received to send Email:', { to, tempData, thresholdtemp });

  const msg = {
    to: to,
    from: 'alerts@kirkwall.io', // Replace with your verified email
    templateId: 'Kirkwall_TempAlerts_v2', // Replace with your SendGrid template ID
    dynamic_template_data: {
      currenttemp: tempData,
      thresholdtemp: [highThreshold, lowThreshold]
    },
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending Email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).send({ message: 'Failed to send Email', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/*
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


//construct message
// Endpoint to send email using SendGrid
app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;
  console.log('Request received to send Email:', { to, subject, text, html });

  const msg = {
    to: to,
    from: 'alerts@kirkwall.io', // Replace with your verified email
    subject: subject,
    text: text,
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
    res.status(200).send({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending Email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).send({ message: 'Failed to send Email', error: error.message });
  }
});
*/
