// Helper functions for GraphQL queries and mutations
import axios from 'axios';

import { getAccessToken, setupAuthHeaders } from './Auth';

const QUERY_URL = 'https://api.devii.io/query';

// General helper function for executing GraphQL queries and mutations
async function executeGraphqlQuery(query, variables = {}) {
  const payload = {
    query: query,
    variables: variables,
  };

  const headers = await setupAuthHeaders(); // Ensure headers are awaited here
  //   console.log("Headers for the request:", headers); // Check this log

  try {
    const response = await axios.post(QUERY_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error executing GraphQL hquery:', error);
    throw error;
  }
}

// Function to retrieve all the list and item data
async function getWeatherData(limit) {
  const WeatherDataQuery = `
  query weather_data($limit: Int!) {
    weather_data(filter: "stationid = 181795", ordering: "ts desc", limit: $limit) {
      station {
        name
        location {
          srid
          wkt
        }
      }
      message_timestamp
      temperature
      ts
      stationid
      rain_15_min_inches
      barometric_pressure
      percent_humidity
      wind_speed
      wind_direction
    }
  }
  `;
  return executeGraphqlQuery(WeatherDataQuery, { limit });
}



async function editWeatherData(dataid, temperature, humidity, windSpeed, windDirection) {
    const editWeatherMutation = `
        mutation ($i: weather_dataInput, $j: ID!) {
            update_weather_data(input: $i, dataid: $j) {
                station {
                    name
                    location {
                        srid
                        wkt
                    }
                }
                message_timestamp
                temperature
                percent_humidity
                wind_speed
                wind_direction
                ts
                stationid
            }
        }`;
    
    const variables = {
        j: dataid,
        i: {
            temperature: Number(temperature),
            percent_humidity: Number(humidity),
            wind_speed: Number(windSpeed),
            wind_direction: Number(windDirection)
        }
    };
    
    return executeGraphqlQuery(editWeatherMutation, variables);
}






// Export the functions to be used elsewhere in the project
export { getWeatherData,editWeatherData };