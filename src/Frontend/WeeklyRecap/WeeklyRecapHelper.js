import { useWeatherData } from "../WeatherDataContext";

export const WeeklyRecapHelper = () => {
    const {
        weatherData,
        tempData,
        humidityData,
        windData,
        rainfallData,
        soilMoistureData,
        leafWetnessData,
        watchdogTempData,
        watchdogHumData,
        rivercityTempData,
        rivercityHumData,
        watchdogData,
        rivercityData,
        impriFreezerOneTempData,
        impriFreezerOneHumData,
        impriFreezerTwoTempData,
        impriFreezerTwoHumData,
        impriFreezerThreeTempData,
        impriFreezerThreeHumData,
        impriFridgeOneTempData,
        impriFridgeOneHumData,
        impriFridgeTwoTempData,
        impriFridgeTwoHumData,
        impriIncuOneTempData,
        impriIncuOneHumData,
        impriIncuTwoTempData,
        impriIncuTwoHumData,
    } = useWeatherData();
}