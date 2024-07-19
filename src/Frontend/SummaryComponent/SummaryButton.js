import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  Flex,
  Text,
} from '@chakra-ui/react';
import { useWeatherData } from '../WeatherDataContext';

const SummaryButton = ({ isSummaryOpen, onSummaryToggle }) => {
  const {
    weatherData,
    loading,
    error,
    tempData,
    humidityData,
    windData,
    rainfallData,
    soilMoistureData,
    leafWetnessData,
    watchdogTempData,
    watchdogHumData,
    watchdogData,
    rivercityTempData,
    rivercityHumData,
    rivercityData
  } = useWeatherData();

  const summaryMetrics = [
    {
      label: 'Average Temp (°F)',
      value: tempData
        ? (
            tempData.reduce((sum, data) => sum + data.temperature, 0) /
            tempData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.temperature, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Humidity (%)',
      value: humidityData
        ? (
            humidityData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            humidityData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.percent_humidity, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Wind Speed (mph)',
      value: windData
        ? (
            windData.reduce((sum, data) => sum + data.wind_speed, 0) /
            windData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData.reduce((sum, data) => sum + data.wind_speed, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Total Rainfall (inches)',
      value: rainfallData
        ? rainfallData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : weatherData
        ? weatherData
            .reduce((sum, data) => sum + data.rain_15_min_inches, 0)
            .toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Leaf Wetness (0-15)',
      value: leafWetnessData
        ? (
            leafWetnessData
              .reduce((sum, data) => sum + data.leaf_wetness, 0) /
            leafWetnessData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData
              .reduce((sum, data) => sum + data.leaf_wetness, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Average Soil Moisture (centibars)',
      value: soilMoistureData
        ? (
            soilMoistureData
              .reduce((sum, data) => sum + data.soil_moisture, 0) /
            soilMoistureData.length
          ).toFixed(2)
        : weatherData
        ? (
            weatherData
              .reduce((sum, data) => sum + data.soil_moisture, 0) /
            weatherData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Garage Average Temp (°F)',
      value: watchdogTempData
        ? (
          watchdogTempData.reduce((sum, data) => sum + data.temp, 0) /
          watchdogTempData.length
          ).toFixed(2)
        : watchdogData
        ? (
          watchdogData.reduce((sum, data) => sum + data.temp, 0) /
          watchdogData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Garage Humidity (%)',
      value: watchdogHumData
        ? (
          watchdogHumData.reduce((sum, data) => sum + data.hum, 0) /
          watchdogHumData.length
          ).toFixed(2)
        : watchdogData
        ? (
          watchdogData.reduce((sum, data) => sum + data.hum, 0) /
          watchdogData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Rivercity Temperature (°F)',
      value: rivercityTempData
        ? (
            rivercityTempData.reduce((sum, data) => sum + data.rctemp, 0) /
            rivercityTempData.length
          ).toFixed(2)
        : rivercityData
        ? (
          rivercityData.reduce((sum, data) => sum + data.rctemp, 0) /
          rivercityData.length
          ).toFixed(2)
        : 'N/A',
    },
    {
      label: 'Rivercity Humidity (%)',
      value: rivercityHumData
        ? (
            rivercityHumData.reduce((sum, data) => sum + data.humidity, 0) /
            rivercityHumData.length
          ).toFixed(2)
        : (rivercityData && rivercityData.length)
        ? (
            rivercityData.reduce((sum, data) => sum + data.humidity, 0) /
            rivercityData.length
          ).toFixed(2)
        : 'N/A',
    }

  ];

  const motionProps = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  };


  return (
    <>
      <motion.div {...motionProps}>
        <Button
          onClick={onSummaryToggle}
          size={{ base: 'xs', md: 'md' }}
          px={{ base: 4, md: 6 }}
          mr="4"
          variant="sidebar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          bg="#F4B860"
          color="black"
        >
          {isSummaryOpen ? 'Hide Summary' : 'Summary'}
        </Button>
      </motion.div>

      <Modal isOpen={isSummaryOpen} onClose={onSummaryToggle}>
        <ModalOverlay />
        <ModalContent
          sx={{
            border: '2px solid black',
            bg: '#2D3748',
          }}

          sy={{
            border: '2px solid black',
            bg: '#2D3748',
          }}
        >
          <ModalHeader bg={'#212121'} color={'white'}>
            Weather Summary
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            {loading ? (
              <Flex justify="center" align="center" height="100%">
                <Text>Loading...</Text>
              </Flex>
            ) : error ? (
              <Text color="red.500">{error}</Text>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {summaryMetrics.map((metric, index) => (
                  <GridItem key={index}>
                    <Stat>
                      <StatLabel color="white" textDecoration={'underline'}>{metric.label}</StatLabel>
                      <StatNumber color="white">{metric.value}</StatNumber>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SummaryButton;
