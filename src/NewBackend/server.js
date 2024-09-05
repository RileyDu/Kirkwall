const express = require('express');
const axios = require('axios');
require('dotenv').config(); // to use environment variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON
app.use(express.json());

// Example Route
app.get('/', (req, res) => {
  res.send('Welcome to the REST API');
});

// Starting the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Simulate fetching weather data from a database (replace this with actual DB logic)
const getWeatherDataFromDB = async (limit) => {
    // Simulating database fetch for now
    return [
      {
        stationid: 181795,
        temperature: 23.5,
        wind_speed: 12,
        ts: new Date(),
      },
      // More weather data objects here...
    ].slice(0, limit);
  };
  
  // Route to get weather data
  app.get('/api/weather_data', async (req, res) => {
    try {
      const { limit = 10 } = req.query; // Default limit of 10
      const weatherData = await getWeatherDataFromDB(limit); // Fetch data from DB
      res.status(200).json(weatherData); // Send the weather data as JSON
    } catch (error) {
      console.error('Error fetching weather data:', error);
      res.status(500).json({ error: 'An error occurred while fetching weather data' });
    }
  });
  