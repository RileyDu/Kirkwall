const sgMail = require('@sendgrid/mail');
const express = require('express');
const multer = require('multer');
const cors = require('cors');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "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");

const app = express();

app.use(cors());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // File size limit
});

app.use(express.json());

app.post('/send-enquiry', upload.array('attachments', 10), async (req, res) => {
    const { fromEmail, title, description } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).send({ message: 'Title (subject) is required.' });
    }

    const attachments = req.files.map(file => ({
        content: file.buffer.toString('base64'),
        filename: file.originalname,
        type: file.mimetype,
        disposition: 'attachment',
    }));

    const msg = {
        to: 'adityabp@hotmail.co.uk',
        from: {
            name: 'Contact Form',
            email: 'alerts@kirkwall.io'
        },
        subject: title,
        text: description,
        html: `<p>Problem Description: ${description}<br/>Contact customer at: ${fromEmail}</p>`,
        attachments: attachments,
    };

    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('Error response body:', error.response.body);
        }
        res.status(500).send({ message: 'Failed to send email' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
