/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const axios = require('axios');

admin.initializeApp();

// Twilio and SendGrid credentials
const accountSid = functions.config().twilio.account_sid;
const authToken = functions.config().twilio.auth_token;
const twilioPhoneNumber = functions.config().twilio.phone_number;
const sendGridApiKey = functions.config().sendgrid.api_key;

const client = twilio(accountSid, authToken);
sgMail.setApiKey(sendGridApiKey);

exports.checkThresholdsAndAlert = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
    const db = admin.database();
    const snapshot = await db.ref('/sensorData').once('value');
    const sensorData = snapshot.val();
    
    for (const sensorId in sensorData) {
        const sensor = sensorData[sensorId];
        const { currentValue, highThreshold, lowThreshold, phoneNumber, userEmail } = sensor;

        const alertMessages = [];
        if (currentValue > highThreshold) {
            alertMessages.push(`Alert: The value of ${currentValue} exceeds the high threshold of ${highThreshold}.`);
        }

        if (currentValue < lowThreshold) {
            alertMessages.push(`Alert: The value of ${currentValue} is below the low threshold of ${lowThreshold}.`);
        }

        for (const alertMessage of alertMessages) {
            if (phoneNumber) {
                try {
                    await client.messages.create({
                        body: alertMessage,
                        from: twilioPhoneNumber,
                        to: phoneNumber,
                    });
                    console.log(`SMS alert sent to ${phoneNumber}: ${alertMessage}`);
                } catch (error) {
                    console.error('Error sending SMS:', error);
                }
            }

            if (userEmail) {
                const msg = {
                    to: userEmail,
                    from: 'evan@kirkwall.io', // Replace with your verified email
                    subject: 'Threshold Alert',
                    text: alertMessage,
                    html: `<p>${alertMessage}</p>`,
                };
                try {
                    await sgMail.send(msg);
                    console.log(`Email alert sent to ${userEmail}: ${alertMessage}`);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
        }
    }
});

