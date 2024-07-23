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

  try {
    const response = await axios.post(QUERY_URL, payload, { headers });
    return response.data;
  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}

// Generalized function to get weather data based on requested type
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
    temperature_low_threshold
    temperature_high_threshold
    percent_humidity_low_threshold
    percent_humidity_high_threshold
    wind_speed_low_threshold
    wind_speed_high_threshold
    rain_15_min_inches_low_threshold
    rain_15_min_inches_high_threshold
    leaf_wetness_low_threshold
    leaf_wetness_high_threshold
    soil_moisture_low_threshold
    soil_moisture_high_threshold
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
          temperature_low_threshold
          temperature_high_threshold
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
          rain_15_min_inches_low_threshold
          rain_15_min_inches_high_threshold
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
          percent_humidity_low_threshold
          percent_humidity_high_threshold
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
          wind_speed_low_threshold
          wind_speed_high_threshold
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
        leaf_wetness_low_threshold
        leaf_wetness_high_threshold
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
      soil_moisture_low_threshold
      soil_moisture_high_threshold
    }
  }
`,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}

// Generalized function to get watchdog data based on requested type
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
          hum_low_threshold
          hum_high_threshold
          temp_low_threshold
          temp_high_threshold
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
          temp_low_threshold
          temp_high_threshold
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
          hum_low_threshold
          hum_high_threshold
        }
      }
    `,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}

async function getRivercityData(type, limit) {
  const queryMap = {
    all: `
      query rivercity_data($limit: Int!) {
        rivercity_data(ordering: "publishedat desc", limit: $limit) {
          rctemp
          humidity
          deveui
          publishedat
          dataid
          apiid
          battery
          humidity_low_threshold
          humidity_high_threshold
          rctemp_low_threshold
          rctemp_high_threshold
        }
      }
    `,
    temp: `
      query rivercity_data($limit: Int!) {
        rivercity_data(ordering: "publishedat desc", limit: $limit) {
          rctemp
          dataid
          deveui
          publishedat
          rctemp_low_threshold
          rctemp_high_threshold
        }
      }
    `,
    hum: `
      query rivercity_data($limit: Int!) {
        rivercity_data(ordering: "publishedat desc", limit: $limit) {
          humidity
          dataid
          deveui
          publishedat
          humidity_low_threshold
          humidity_high_threshold
        }
      }
    `,
  };

  const query = queryMap[type] || queryMap.all; // Default to 'all' if type is invalid
  return executeGraphqlQuery(query, { limit });
}

// Function to get the latest data ID based on the metric type
async function getLatestDataId(type) {
  const queryMap = {
    weather_data: `
      query {
        weather_data(filter: "stationid = 181795", ordering: "ts desc", limit: 1) {
          dataid
        }
      }
    `,
    watchdog_data: `
      query {
        watchdog_data(ordering: "reading_time desc", limit: 1) {
          dataid
        }
      }
    `,
    rivercity_data: `
      query {
        rivercity_data(ordering: "publishedat desc", limit: 1) {
          dataid
        }
      }
    `,
  };

  let query;
  switch (type) {
    case 'temperature':
    case 'rain_15_min_inches':
    case 'percent_humidity':
    case 'wind_speed':
    case 'soil_moisture':
    case 'leaf_wetness':
      query = queryMap.weather_data;
      break;
    case 'temp':
    case 'hum':
      query = queryMap.watchdog_data;
      break;
    case 'rctemp':
    case 'humidity':
      query = queryMap.rivercity_data;
      break;
    default:
      throw new Error('Invalid metric type');
  }

  const response = await executeGraphqlQuery(query);
  return response.data[Object.keys(response.data)[0]][0]?.dataid;
}

// Function to set new thresholds
async function setNewThresholds(type, highThreshold, lowThreshold) {
  const dataid = await getLatestDataId(type);

  if (!dataid) {
    throw new Error('No latest data found');
  }

  const mutationMap = {
    temperature: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          temperature_low_threshold
          temperature_high_threshold
        }
      }
    `,
    rain_15_min_inches: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          rain_15_min_inches_low_threshold
          rain_15_min_inches_high_threshold
        }
      }
    `,
    percent_humidity: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          percent_humidity_low_threshold
          percent_humidity_high_threshold
        }
      }
    `,
    wind_speed: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          wind_speed_low_threshold
          wind_speed_high_threshold
        }
      }
    `,
    soil_moisture: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          soil_moisture_low_threshold
          soil_moisture_high_threshold
        }
      }
    `,
    leaf_wetness: `
      mutation ($input: weather_dataInput!, $id: ID!) {
        update_weather_data(dataid: $id, input: $input) {
          leaf_wetness_low_threshold
          leaf_wetness_high_threshold
        }
      }
    `,
    temp: `
      mutation ($input: watchdog_dataInput!, $id: ID!) {
        update_watchdog_data(dataid: $id, input: $input) {
          temp_low_threshold
          temp_high_threshold
        }
      }
    `,
    hum: `
      mutation ($input: watchdog_dataInput!, $id: ID!) {
        update_watchdog_data(dataid: $id, input: $input) {
          hum_low_threshold
          hum_high_threshold
        }
      }
    `,
    rctemp: `
      mutation ($input: rivercity_dataInput!, $id: ID!) {
        update_rivercity_data(dataid: $id, input: $input) {
          rctemp_low_threshold
          rctemp_high_threshold
        }
      }
    `,
    humidity: `
      mutation ($input: rivercity_dataInput!, $id: ID!) {
        update_rivercity_data(dataid: $id, input: $input) {
          humidity_low_threshold
          humidity_high_threshold
        }
      }
    `,
  };

  const setThresholdsMutation = mutationMap[type];
  if (!setThresholdsMutation) {
    throw new Error('Invalid metric type');
  }

  const variables = {
    input: {
      [`${type}_low_threshold`]: parseFloat(lowThreshold),
      [`${type}_high_threshold`]: parseFloat(highThreshold),
    },
    id: dataid,
  };

  return executeGraphqlQuery(setThresholdsMutation, variables);
}

// Function to get API ID of user
async function getAPIIds() {
  const query = `
  query{
    api{
      customer {
        name
      }
      apiid
      apiname
    }
  }
  `;
  return executeGraphqlQuery(query);
}

// Function to edit weather data
async function editWeatherData(
  dataid,
  temperature,
  humidity,
  windSpeed,
  windDirection
) {
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
      wind_direction: Number(windDirection),
    },
  };

  return executeGraphqlQuery(editWeatherMutation, variables);
}

// Export the functions to be used elsewhere in the project
export {
  getWeatherData,
  editWeatherData,
  getWatchdogData,
  getRivercityData,
  getAPIIds,
  setNewThresholds
};
