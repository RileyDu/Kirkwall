import React from 'react';
import { Box, Heading, Text, Spinner, Flex } from '@chakra-ui/react';
import ReactSpeedometer from "react-d3-speedometer";

export default function WindSensors({ weatherData }) {
    if (!weatherData) {
        return (
            console.log("WeatherData is not defined", weatherData),
            <Box p="4" width="100%" height="100%" textAlign="center">
                <Spinner size="xl" />
                <Text mt="4">Loading wind data...</Text>
            </Box>
        );
    }

    const latestWindSpeed = weatherData[0]?.wind_speed;

    if (latestWindSpeed === undefined) {
        return (
            <Box p="4" width="100%" height="100%" textAlign="center">
                <Heading size="xl">Wind Sensors</Heading>
                <Box p="4" width="100%" height="100%" textAlign="center">
                    <Text>No wind data available.</Text>
                </Box>
            </Box>
        );
    }

    const windSpeedMph = (latestWindSpeed * 2.23694).toFixed(2);

    return (
        <Box width="100%" height="100%" textAlign="center">
            <Heading size="xl" py={"4"} bg={"blue.400"}>Wind Sensors</Heading>
            <Flex width="100%" height="100vh" bg="blue.200" justifyContent="center" alignItems="center">
                <Box p="4" textAlign="center">
                    <ReactSpeedometer
                        minValue={0}
                        maxValue={100}
                        value={Number(windSpeedMph)}
                        segments={9}
                        segmentColors={[
                            "#00FF00", // Calm
                            "#7FFF00", // Light Breeze
                            "#FFFF00", // Gentle Breeze
                            "#FFD700", // Moderate Breeze
                            "#FFA500", // Fresh Breeze
                            "#FF8C00", // Strong Breeze
                            "#FF4500", // Gale
                            "#FF0000", // Strong Gale
                            "#8B0000", // Storm
                        ]}
                        customSegmentStops={[0, 5, 11, 19, 28, 38, 49, 61, 74, 100]}
                        customSegmentLabels={[
                            { text: "0-5", position: "INSIDE" },
                            { text: "6-11", position: "INSIDE" },
                            { text: "12-19", position: "INSIDE" },
                            { text: "20-28", position: "INSIDE" },
                            { text: "29-38", position: "INSIDE" },
                            { text: "39-49", position: "INSIDE" },
                            { text: "50-61", position: "INSIDE" },
                            { text: "62-74", position: "INSIDE" },
                            { text: "75+", position: "INSIDE" },
                        ]}
                        needleHeightRatio={0.7}
                        needleColor="#000000"
                        needleTransitionDuration={1000}
                        needleTransition="easeElastic"
                        height={600}
                        width={900}
                        // labelFontColor="white"
                        // valueFontColor="white"
                        textColor="black"
                        valueTextFontSize="x-large"
                        // valueTextFontWeight="bold"
                        valueTextShadowColor="black"
                                            />
                    <Text mt="4" fontSize="xxx-large">Current Wind Speed: {windSpeedMph} mph</Text>
                </Box>
            </Flex>
        </Box>
    );
}
