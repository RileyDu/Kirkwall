export const MetricSettings = [
    {
        id:1,
        metric:"temperature",
        name:"Temperature",
        unit:"°F",
        color:"green",
        company:"Grand Farm",
        sourceData:"weatherData",
        soloData:"tempData",
    },
    {
        id:2,
        metric:"percent_humidity",
        name:"Humidity",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"humidityData",
        sourceData: "weatherData"
    },
    {
        id:3,
        metric:"wind_speed",
        name:"Wind Speed",
        unit:"mph",
        color:"green",
        company:"Grand Farm",
        soloData:"windData",
        sourceData: "weatherData"
    },
    {
        id:4,
        metric:"rain_15_min_inches",
        name:"Rain",
        unit:"inches",
        color:"green",
        company:"Grand Farm",
        soloData:"rainfallData",
        sourceData: "weatherData"
    },
    {
        id:5,
        metric:"soil_moisture",
        name:"Soil Moisture",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"soilMoistureData",
        sourceData: "weatherData"
    },
    {
        id:6,
        metric:"leaf_wetness",
        name:"Leaf Wetness",
        unit:"%",
        color:"green",
        company:"Grand Farm",
        soloData:"leafWetnessData",
        sourceData: "weatherData"
    },
    {
        id:7,
        metric:"temp",
        name:"Temperature",
        unit:"°F",
        color:"orange",
        company:"Watchdog",
        soloData:"watchdogTempData",
        sourceData: "watchdogData"
    },
    {
        id:8,
        metric:"hum",
        name:"Humidity",
        unit:"%",
        color:"orange",
        company:"Watchdog",
        soloData:"watchdogHumData",
        sourceData: "watchdogData"
    },
    {
        id:9,
        metric:"rctemp",
        name:"Temperature",
        unit:"°F",
        color:"blue",
        company:"River City",
        soloData:"rivercityTempData",
        sourceData: "rivercityData"
    },
    {
        id:10,
        metric:"humidity",
        name:"Humidity",
        unit:"%",
        color:"blue",
        company:"River City",
        soloData:"rivercityHumData",
        sourceData: "rivercityData"
    },
    {
        id:11,
        metric:"imFreezerOneTemp",
        name:"Freezer #1 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerOneTempData",
        sourceData: "imFreezerOneTempData"
    },
    {
        id:12,
        metric:"imFreezerOneHum",
        name:"Freezer #1 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerOneHumData",
        sourceData: "imFreezerOneHumData"
    },
    {
        id:13,
        metric:"imFreezerTwoTemp",
        name:"Freezer #2 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerTwoTempData",
        sourceData: "imFreezerTwoTempData"
    },
    {
        id:14,
        metric:"imFreezerTwoHum",
        name:"Freezer #2 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerTwoHumData",
        sourceData: "imFreezerTwoHumData"
    },
    {
        id:15,
        metric:"imFreezerThreeTemp",
        name:"Freezer #3 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerThreeTempData",
        sourceData: "imFreezerThreeTempData"
    },
    {
        id:16,
        metric:"imFreezerThreeHum",
        name:"Freezer #3 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imFreezerThreeHumData",
        sourceData: "imFreezerThreeHumData"
    },
    {
        id:17,
        metric:"imFridgeOneTemp",
        name:"Friidge #1 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imFridgeOneTempData",
        sourceData: "imFridgeOneTempData"
    },
    {
        id:18,
        metric:"imFridgeOneHum",
        name:"Fridge #1 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imFridgeOneHumData",
        sourceData: "imFridgeOneHumData"
    },
    {
        id:19,
        metric:"imFridgeTwoTemp",
        name:"Fridge #2 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imFridgeTwoTempData",
        sourceData: "imFridgeTwoTempData"
    },
    {
        id:20,
        metric:"imFridgeTwoHum",
        name:"Fridge #2 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imFridgeTwoHumData",
        sourceData: "imFridgeTwoHumData"

    },
    {
        id:21,
        metric:"imIncubatorOneTemp",
        name:"Incubator #1 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imIncubatorOneTempData",
        sourceData: "imIncubatorOneTempData"
    },
    {
        id:22,
        metric:"imIncubatorOneHum",
        name:"Incubator #1 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imIncubatorOneHumData",
        sourceData: "imIncubatorOneHumData"
    },
    {
        id:23,
        metric:"imIncubatorTwoTemp",
        name:"Incubator #2 (°C)",
        unit:"°C",
        color:"red",
        company:"ImpriMed",
        soloData:"imIncubatorTwoTempData",
        sourceData: "imIncubatorTwoTempData"
    },
    {
        id:24,
        metric:"imIncubatorTwoHum",
        name:"Incubator #2 (Hum %)",
        unit:"%",
        color:"red",
        company:"ImpriMed",
        soloData:"imIncubatorTwoHumData",
        sourceData: "imIncubatorTwoHumData"
    }
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