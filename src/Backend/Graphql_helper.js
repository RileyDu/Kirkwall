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

// Function to set new thresholds
async function setNewThresholds(metric, dataid, highThreshold, lowThreshold) {
  let setThresholdsMutation;
  let variables;

  switch (metric) {
    case 'temperature':
      setThresholdsMutation = `
        mutation ($input: weather_dataInput!, $id: ID!) {
          update_weather_data(input: $input, dataid: $id) {
            temperature_low_threshold
            temperature_high_threshold
          }
        }
      `;
      variables = {
        input: {
          temperature_low_threshold: parseFloat(lowThreshold),
          temperature_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'rain_15_min_inches':
      setThresholdsMutation = `
        mutation ($input: weather_dataInput!, $id: ID!) {
          update_weather_data(input: $input, dataid: $id) {
            rain_15_min_inches_low_threshold
            rain_15_min_inches_high_threshold
          }
        }
      `;
      variables = {
        input: {
          rain_15_min_inches_low_threshold: parseFloat(lowThreshold),
          rain_15_min_inches_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'percent_humidity':
      setThresholdsMutation = `
        mutation ($input: weather_dataInput!, $id: ID!) {
          update_weather_data(input: $input, dataid: $id) {
            percent_humidity_low_threshold
            percent_humidity_high_threshold
          }
        }
      `;
      variables = {
        input: {
          percent_humidity_low_threshold: parseFloat(lowThreshold),
          percent_humidity_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'wind_speed':
      setThresholdsMutation = `
        mutation ($input: weather_dataInput!, $id: ID!) {
          update_weather_data(input: $input, dataid: $id) {
            wind_speed_low_threshold
            wind_speed_high_threshold
          }
        }
      `;
      variables = {
        input: {
          wind_speed_low_threshold: parseFloat(lowThreshold),
          wind_speed_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'soil_moisture':
      setThresholdsMutation = `
              mutation ($input: weather_dataInput!, $id: ID!) {
          update_weather_data(input: $input, dataid: $id) {
            soil_moisture_low_threshold
            soil_moisture_high_threshold
          }
        }
      `;
      variables = {
        input: {
          soil_moisture_low_threshold: parseFloat(lowThreshold),
          soil_moisture_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
      case 'leaf_wetness':
        setThresholdsMutation = `
                mutation ($input: weather_dataInput!, $id: ID!) {
            update_weather_data(input: $input, dataid: $id) {
              leaf_wetness_low_threshold
              leaf_wetness_high_threshold
            }
          }
        `;
        variables = {
          input: {
            leaf_wetness_low_threshold: parseFloat(lowThreshold),
            leaf_wetness_high_threshold: parseFloat(highThreshold),
          },
        };
        break;
    case 'temp':
      setThresholdsMutation = `
        mutation ($input: watchdog_dataInput!, $id: ID!) {
          update_watchdog_data(input: $input, dataid: $id) {
            temp_low_threshold
            temp_high_threshold
          }
        }
      `;
      variables = {
        input: {
          temp_low_threshold: parseFloat(lowThreshold),
          temp_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'hum':
      setThresholdsMutation = `
        mutation ($input: watchdog_dataInput!, $id: ID!) {
          update_watchdog_data(input: $input, dataid: $id) {
            hum_low_threshold
            hum_high_threshold
          }
        }
      `;
      variables = {
        input: {
          hum_low_threshold: parseFloat(lowThreshold),
          hum_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'rctemp':
      setThresholdsMutation = `
        mutation ($input: rivercity_dataInput!, $id: ID!) {
          update_rivercity_data(input: $input, dataid: $id) {
            rctemp_low_threshold
            rctemp_high_threshold
          }
        }
      `;
      variables = {
        input: {
          rctemp_low_threshold: parseFloat(lowThreshold),
          rctemp_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    case 'humidity':
      setThresholdsMutation = `
        mutation ($input: rivercity_dataInput!, $id: ID!) {
          update_rivercity_data(input: $input, dataid: $id) {
            humidity_low_threshold
            humidity_high_threshold
          }
        }
      `;
      variables = {
        input: {
          humidity_low_threshold: parseFloat(lowThreshold),
          humidity_high_threshold: parseFloat(highThreshold),
        },
      };
      break;
    default:
      throw new Error('Invalid metric type');
  }

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
