// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const twilio = require("twilio");
// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// admin.initializeApp();

// // Twilio and SendGrid credentials
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const sendGridApiKey = process.env.SENDGRID_API_KEY;

// const client = twilio(accountSid, authToken);
// sgMail.setApiKey(sendGridApiKey);

// exports.checkThresholdsAndAlert = functions.pubsub
// .schedule("every day 16:23")
// .timeZone("America/Chicago")
//   .onRun(async (context) => {
//     const db = admin.database();
//     const snapshot = await db.ref("/sensorData").once("value");
//     const sensorData = snapshot.val();

//     for (const sensorId in sensorData) {
//       if (sensorData.hasOwnProperty(sensorId)) {
//         const sensor = sensorData[sensorId];
//         const {
//           currentValue,
//           highThreshold,
//           lowThreshold,
//           phoneNumber,
//           userEmail,
//         } = sensor;

//         const alertMessages = [];
//         if (currentValue > highThreshold) {
//           alertMessages.push(
//             `Alert: The value of ${currentValue} exceeds the high threshold of ${highThreshold}.`
//           );
//         }

//         if (currentValue < lowThreshold) {
//           alertMessages.push(
//             `Alert: The value of ${currentValue} is below the low threshold of ${lowThreshold}.`
//           );
//         }

//         for (const alertMessage of alertMessages) {
//           if (phoneNumber) {
//             try {
//               await client.messages.create({
//                 body: alertMessage,
//                 from: twilioPhoneNumber,
//                 to: phoneNumber,
//               });
//               console.log(`SMS alert sent to ${phoneNumber}: ${alertMessage}`);
//             } catch (error) {
//               console.error("Error sending SMS:", error);
//             }
//           }

//           if (userEmail) {
//             const msg = {
//               to: userEmail,
//               from: "evan@kirkwall.io", // Replace with your verified email
//               subject: "Threshold Alert",
//               text: alertMessage,
//               html: `<p>${alertMessage}</p>`,
//             };
//             try {
//               await sgMail.send(msg);
//               console.log(`Email alert sent to ${userEmail}: ${alertMessage}`);
//             } catch (error) {
//               console.error("Error sending email:", error);
//             }
//           }
//         }
//       }
//     }
//   });
