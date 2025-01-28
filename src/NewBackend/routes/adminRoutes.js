// routes/adminRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;

// Initialize PostgreSQL client
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Admin Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Admin Routes: Connection error', err.stack));

// GET /api/admins
router.get('/', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM admin');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Admin Routes: Error fetching admins:', error);
    res.status(500).json({ error: 'An error occurred while fetching admins' });
  }
});

// GET /api/admin/:email
router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const result = await client.query('SELECT * FROM admin WHERE email = $1', [
      email,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Admin Routes: Error fetching admin by email:', error);
    res.status(500).json({ error: 'An error occurred while fetching admin' });
  }
});

// GET /api/admins/update_admin_thresh/:phone
router.get('/update_admin_thresh/:phone', async (req, res) => {
  const { phone } = req.params;
  const { thresh_kill } = req.query;

  const query = `
    UPDATE admin SET thresh_kill = $1 WHERE phone LIKE $2
    RETURNING *`;

  try {
    const result = await client.query(query, [thresh_kill, `%${phone}%`]);
    // Redirect to a thank you page after updating
    res.redirect('/thankyouadmin');
  } catch (error) {
    console.error('Admin Routes: Error updating threshold:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating threshold' });
  }
});

// PUT /api/admins/update_admin/:id
router.put('/update_admin/:id', async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, company, thresh_kill } = req.body;

  const query = `
    UPDATE admin SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, thresh_kill = $6
    WHERE id = $7
    RETURNING *`;

  try {
    const result = await client.query(query, [
      firstname,
      lastname,
      email,
      phone,
      company,
      thresh_kill,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Admin Routes: Error updating admin:', error);
    res.status(500).json({ error: 'An error occurred while updating admin' });
  }
});

// PUT /api/admins/update_profile_url/:id
router.put('/update_profile_url/:id', async (req, res) => {
  const { id } = req.params;
  const {
    firstname,
    lastname,
    email,
    phone,
    company,
    thresh_kill,
    profile_url,
  } = req.body;

  const query = `
    UPDATE admin
    SET firstname = $1, lastname = $2, email = $3, phone = $4, company = $5, thresh_kill = $6, profile_url = $7
    WHERE id = $8
    RETURNING *`;

  try {
    const result = await client.query(query, [
      firstname,
      lastname,
      email,
      phone,
      company,
      thresh_kill,
      profile_url,
      id,
    ]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Admin Routes: Error updating profile URL:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the profile URL' });
  }
});

export default router;
