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
        metric:"monnit_bathroom",
        name:"Bathroom Temp & Hum",
        unit:"°F",
        color:"orange",
        company:"Monnit",
        soloData:"monnitBathroomData",
        sourceData: "monnitBathroomData"
    },
    {
        id:10,
        metric:"monnit_fridge",
        name:"Fridge Temp",
        unit:"°F",
        color:"orange",
        company:"Monnit",
        soloData:"monnitFridgeData",
        sourceData: "monnitFridgeData"
    },  
    {
        id:11,
        metric:"monnit_freezer",
        name:"Freezer Temp",
        unit:"°F",
        color:"orange",
        company:"Monnit",
        soloData:"monnitFreezerData",
        sourceData: "monnitFreezerData"
    },
    {
        id:12,
        metric:"monnit_amp",
        name:"Lamp Amp Hours",
        unit:"Ah",
        color:"orange",
        company:"Monnit",
        soloData:"monnitAmpData",
        sourceData: "monnitAmpData"}
];
