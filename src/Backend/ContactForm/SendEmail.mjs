import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import sgMail from '@sendgrid/mail';
import express from 'express';
import multer from 'multer';
import cors from 'cors';


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(cors());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
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
        to: 'thelifeofdu@gmail.com',
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
