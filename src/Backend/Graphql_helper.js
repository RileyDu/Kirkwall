// Helper functions for GraphQL queries and mutations
import axios from 'axios';
import { getAccessToken, setupAuthHeaders } from './Auth.js';
// const axios = require('axios');
// const { getAccessToken, setupAuthHeaders } = require('./Auth');

const QUERY_URL = 'https://api.devii.io/query';

// General helper function for executing GraphQL queries and mutations
async function executeGraphqlQuery(query, variables = {}) {
  const payload = {
    query: query,
    variables: variables,
  };

  const headers = await setupAuthHeaders(); // Ensure headers are awaited here

  try {
    const response = await axios.post(QUERY_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

// Generalized function to get weather data based on requested metric
// All is triggerd on page load
async function getWeatherData(type, limit) {
  const queryMap = {
    all: `
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
          leaf_wetness
          soil_moisture
        }
      }
    `,
    temperature: `
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
        }
      }
    `,
    rain_15_min_inches: `
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
          rain_15_min_inches
          ts
          stationid
        }
      }
    `,
    percent_humidity: `
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
          percent_humidity
          ts
          stationid
        }
      }
    `,
    wind_speed: `
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
          wind_speed
          wind_direction
          ts
          stationid
        }
      }
    `,
    leaf_wetness: `
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
        leaf_wetness
        ts
        stationid
      }
    }
  `,
    soil_moisture: `
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
      soil_moisture
      ts
      stationid
    }
  }
`,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}

// Generalized function to get watchdog data based on requested metric
// All is triggerd on page load
async function getWatchdogData(type, limit) {
  const queryMap = {
    all: `
      query watchdog_data($limit: Int!) {
        watchdog_data(ordering: "reading_time desc", limit: $limit) {
          hum
          temp
          water
          dataid
          device_location
          reading_time
        }
      }
    `,
    temp: `
      query watchdog_data($limit: Int!) {
        watchdog_data(ordering: "reading_time desc", limit: $limit) {
          temp
          dataid
          device_location
          reading_time
        }
      }
    `,
    hum: `
      query watchdog_data($limit: Int!) {
        watchdog_data(ordering: "reading_time desc", limit: $limit) {
          hum
          dataid
          device_location
          reading_time
        }
      }
    `,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}



// Generalized function to get rivercity data based on requested metric
// All is triggerd on page load
async function getRivercityData(type, limit) {
  const queryMap = {
    all: `
      query rivercity_data($limit: Int!) {
        rivercity_data(filter: "deveui = '0080E115054FF0B7'", ordering: "publishedat desc", limit: $limit) {
          rctemp
          humidity
          publishedat
          dataid
          apiid
          battery
        }
      }
    `,
    temp: `
      query rivercity_data($limit: Int!) {
        rivercity_data(filter: "deveui = '0080E115054FF0B7'", ordering: "publishedat desc", limit: $limit) {
          rctemp
          dataid
          deveui
          publishedat
        }
      }
    `,
    hum: `
      query rivercity_data($limit: Int!) {
        rivercity_data(filter: "deveui = '0080E115054FF0B7'", ordering: "publishedat desc", limit: $limit) {
          humidity
          dataid
          deveui
          publishedat
        }
      }
    `,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}

// Function to get the latest threshold data from the database
async function getLatestThreshold() {
  const query = `
    query getLatestThreshold {
      thresholds(ordering: "timestamp desc") {
        metric
        high
        low
        phone
        email
        timestamp
        id
      }
    }
      
  `;
  return executeGraphqlQuery(query);
}

// Function to create a new threshold for a metric in the database
async function createThreshold(metric, high, low, phone, email, timestamp) {
  const mutation = `
    mutation($i: thresholdsInput! ) {
      create_thresholds(input: $i) {
        metric
        high
        low
        phone
        email
        timestamp
      }
    }
  `;
  const variables = {
    i: {
      metric: metric,
      high: high,
      low: low,
      phone: phone,
      email: email,
      timestamp: timestamp,
    },
  };
  return executeGraphqlQuery(mutation, variables);
}

// Function to get all alerts from the database
async function getAlerts() {
  const query = `
  query {
    alerts(ordering: "timestamp desc") {
      id
      metric
      message
      timestamp
      }
      }
      `;
  return executeGraphqlQuery(query);
}

// Function to add a new alert to the database
async function createAlert(metric, message, timestamp) {
  const mutation = `
    mutation($i: alertsInput! ) {
      create_alerts(input: $i) {
        metric
        message
        timestamp
      }
    }
  `;
  const variables = {
    i: {
      metric: metric,
      message: message,
      timestamp: timestamp,
    },
  };
  return executeGraphqlQuery(mutation, variables);
}

async function deleteAlert(id) {
  const mutation = `
      mutation($id: ID!) {
      delete_alerts(id: $id) {
        id
      }
    }
  `;
  const variables = {
    id: id,
  };
  return executeGraphqlQuery(mutation, variables);
}


// This is a query to get the details of the admin that is logged in based on their email
const getAdminById = async () => {
  const query = `
    query {
      admin(filter: "id = 4") {
        id
        firstname
        lastname
        email
        phone
        company
        thresh_kill
      }
    }
  `;

  // const variables = {
  //   email: email,
  // };

  return executeGraphqlQuery(query);
};


// Update admin query

const updateAdmin = async (id, firstname, lastname, email, phone, company, threshKill) => {
  const mutation = `
    mutation UpdateAdmin($id: ID!, $input: adminInput!) {
      update_admin(id: $id, input: $input) {
        id
        firstname
        lastname
        email
        phone
        company
        thresh_kill
      }
    }
  `;

  const variables = {
    id: id,
    input: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      company: company,
      thresh_kill: threshKill,
    },
  };

  return executeGraphqlQuery(mutation, variables);
};




// Function to get API ID of user
// async function getAPIIds() {
//   const query = `
//   query{
//     api{
//       customer {
//         name
//       }
//       apiid
//       apiname
//     }
//   }
//   `;
//   return executeGraphqlQuery(query);
// }

// Export the functions to be used elsewhere in the project

// Function to edit weather data
// async function editWeatherData(
//   dataid,
//   temperature,
//   humidity,
//   windSpeed,
//   windDirection
// ) {
//   const editWeatherMutation = `
//                   mutation ($i: weather_dataInput, $j: ID!) {
//                       update_weather_data(input: $i, dataid: $j) {
//                           station {
//                               name
//                               location {
//                                   srid
//                                   wkt
//                               }
//                           }
//                           message_timestamp
//                           temperature
//                           percent_humidity
//                           wind_speed
//                           wind_direction
//                           ts
//                           stationid
//                       }
//                   }`;

//   const variables = {
//     j: dataid,
//     i: {
//       temperature: Number(temperature),
//       percent_humidity: Number(humidity),
//       wind_speed: Number(windSpeed),
//       wind_direction: Number(windDirection),
//     },
//   };

//   return executeGraphqlQuery(editWeatherMutation, variables);
// }

export {
  getWeatherData,
  getWatchdogData,
  getRivercityData,
  getLatestThreshold,
  createThreshold,
  getAlerts,
  createAlert,
  deleteAlert,
  getAdminById,
  updateAdmin
};
