// routes/webScrapingRoutes.js

import express from 'express';
const router = express.Router();
import pkg from 'pg';
const { Client } = pkg;
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as chromium from 'chrome-aws-lambda';

// Initialize PostgreSQL client if needed (not used in this route)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Azure
});

client
  .connect()
  .then(() => console.log('Web Scraping Routes: Connected to PostgreSQL'))
  .catch(err => console.error('Web Scraping Routes: Connection error', err.stack));

// GET /api/scrape/scrapeBigIron
router.get('/scrapeBigIron', async (req, res) => {
  const { query, page = 1 } = req.query;
  const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '+');

  try {
    // Check if chromium.args exists and is an array
    const args = Array.isArray(chromium.args) ? chromium.args : [];
    const executablePath =
      process.env.CHROME_PATH || (await chromium.executablePath);

    const browser = await puppeteer.launch({
      args: args.length ? args : ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath, // Use puppeteer's local path
      headless: true,
    });

    const pageObj = await browser.newPage();
    const url = `https://www.bigiron.com/Search?showTab=true&search=${formattedQuery}&searchMode=All&userControlsVisible=false&distance=500&historical=false&tab=equipment-tab&page=${page}&itemsPerPage=20&filter=Open&sort=Start&sortOrder=Ascending`;

    await pageObj.goto(url, { waitUntil: 'networkidle2' });
    await pageObj.waitForSelector('.pager-data', { timeout: 10000 });

    const content = await pageObj.content();
    const $ = cheerio.load(content);

    let bigIronResults = [];
    $('.pager-list-item').each((i, el) => {
      if (i < 20) {
        const equipmentName = $(el).find('.lot-title h1').text().trim();
        const price = $(el).find('.bidding-js-amount').first().text().trim();
        const link = $(el).find('a').attr('href');
        const imageUrl = $(el).find('.bidding-js-preview img').attr('src');

        bigIronResults.push({
          equipmentName,
          price,
          link: `https://www.bigiron.com${link}`,
          image: imageUrl ? `${imageUrl}` : null,
          source: 'Big Iron',
        });
      }
    });

    await browser.close();
    res.json(bigIronResults);
  } catch (error) {
    console.error('Web Scraping Routes: Error scraping Big Iron:', error);
    res.status(500).send('Failed to scrape Big Iron data');
  }
});

// GET /api/scrape/scrapePurpleWave
router.get('/scrapePurpleWave', async (req, res) => {
  const { query, page = 1 } = req.query;
  const formattedQuery = query.trim().toLowerCase().replace(/\s+/g, '%20');

  try {
    const args = Array.isArray(chromium.args) ? chromium.args : [];
    const executablePath =
      process.env.CHROME_PATH || (await chromium.executablePath);

    const browser = await puppeteer.launch({
      args: args.length ? args : ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: executablePath, // Use puppeteer's local path
      headless: true,
    });

    const pageObj = await browser.newPage();
    const url = `https://www.purplewave.com/search/${formattedQuery}?searchType=all&dateType=upcoming&zipcodeRange=all&sortBy=current_bid-desc&perPage=20&grouped=true&viewtype=compressed&page=${page}`;

    await pageObj.goto(url, { waitUntil: 'networkidle2' });
    await pageObj.waitForSelector(
      '.panel.panel-default.auction-item-compressed',
      { timeout: 10000 }
    );

    const content = await pageObj.content();
    const $ = cheerio.load(content);

    let purpleWaveResults = [];
    $('.panel.panel-default.auction-item-compressed').each((i, el) => {
      if (i < 20) {
        const equipmentName = $(el).find('.first-line h3').text().trim();
        const price = $(el)
          .find('.table-cell label:contains("Current")')
          .parent()
          .contents()
          .not('label')
          .text()
          .trim();
        const link = $(el).find('.thumbnail').attr('href');
        const imageUrl = $(el).find('.thumbnail img').attr('src');

        purpleWaveResults.push({
          equipmentName,
          price,
          link: link ? `https://www.purplewave.com${link}` : null,
          image: imageUrl ? `${imageUrl}` : null,
          source: 'Purple Wave',
        });
      }
    });

    await browser.close();
    res.json(purpleWaveResults);
  } catch (error) {
    console.error('Web Scraping Routes: Error scraping Purple Wave:', error);
    res.status(500).send('Failed to scrape Purple Wave data');
  }
});

export default router;
