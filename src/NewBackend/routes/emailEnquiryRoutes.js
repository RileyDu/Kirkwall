// routes/emailEnquiryRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import multer from 'multer';
import sgMail from '@sendgrid/mail';

// Initialize PostgreSQL client if needed (not used in this route)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Email Enquiry Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Email Enquiry Routes: Connection error', err.stack));

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// POST /api/send-enquiry
router.post(
  '/',
  upload.array('attachments', 10), // Allow up to 10 attachments
  async (req, res) => {
    const { fromEmail, title, description } = req.body;

    // Validate title
    if (!title || title.trim() === '') {
      return res.status(400).send({ message: 'Title (subject) is required.' });
    }

    // Process attachments
    const attachments = req.files.map(file => ({
      content: file.buffer.toString('base64'),
      filename: file.originalname,
      type: file.mimetype,
      disposition: 'attachment',
    }));

    // Configure SendGrid message
    const msg = {
      to: 'ujj.code@gmail.com',
      from: {
        name: 'Contact Form',
        email: 'alerts@kirkwall.io',
      },
      subject: title,
      text: description,
      html: `<p>Problem Description: ${description}<br/>Contact customer at: ${fromEmail}</p>`,
      attachments: attachments,
    };

    try {
      await sgMail.send(msg);
      console.log('Email Enquiry Routes: Email sent successfully');
      res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Email Enquiry Routes: Error sending email:', error);
      if (error.response) {
        console.error('Email Enquiry Routes: Error response body:', error.response.body);
      }
      res.status(500).send({ message: 'Failed to send email' });
    }
  }
);

export default router;
