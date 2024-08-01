export const MetricSettings = [
    {
        id:1,
        metric:"temperature",
        name:"Temperature (°F)",
        unit:"°F",
        color:"green",
        company:"Grand Farm",
        sourceData:"weatherData",
        soloData:"tempData",
    },
    {
        id:2,
        metric:"percent_humidity",
        name:"Humidity (%)",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"humidityData",
        sourceData: "weatherData"
    },
    {
        id:3,
        metric:"wind_speed",
        name:"Wind Spee (mph)",
        unit:"mph",
        color:"green",
        company:"Grand Farm",
        soloData:"windData",
        sourceData: "weatherData"
    },
    {
        id:4,
        metric:"rain_15_min_inches",
        name:"Rain (15 min)",
        unit:"inches",
        color:"green",
        company:"Grand Farm",
        soloData:"rainfallData",
        sourceData: "weatherData"
    },
    {
        id:5,
        metric:"soil_moisture",
        name:"Soil Moisture (centibars)",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"soilMoistureData",
        sourceData: "weatherData"
    },
    {
        id:6,
        metric:"leaf_wetness",
        name:"Leaf Wetness (0-15)",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"leafWetnessData",
        sourceData: "weatherData"
    },
    {
        id:7,
        metric:"temp",
        name:"Temperature (°F)",
        unit:"°F",
        color:"orange",
        company:"Watchdog",
        soloData:"watchdogTempData",
        sourceData: "watchdogData"
    },
    {
        id:8,
        metric:"hum",
        name:"Humidity (%)",
        unit:"%",
        color:"orange",
        company:"Watchdog",
        soloData:"watchdogHumData",
        sourceData: "watchdogData"
    },
    {
        id:9,
        metric:"rctemp",
        name:"Temperature (°F)",
        unit:"°F",
        color:"blue",
        company:"River City",
        soloData:"rivercityTempData",
        sourceData: "rivercityData"
    },
    {
        id:10,
        metric:"humidity",
        name:"Humidity (%)",
        unit:"%",
        color:"blue",
        company:"River City",
        soloData:"rivercityHumData",
        sourceData: "rivercityData"
    },
];


// <div>
// {metricSettings.map(metric => (
//   <>
//   <p key={metric.id}>{metric.metric}</p>
//   <p key={metric.id}>{metric.name}</p>
//   <p key={metric.id}>{metric.unit}</p>
//   <p key={metric.id}>{metric.color}</p>
//   <p key={metric.id}>{metric.company}</p>
//   <p key={metric.id}>{metric.sourceData}</p>
//   <p key={metric.id}>{metric.soloData}</p>
//   <Divider />
//   </>
// ))}
// </div>