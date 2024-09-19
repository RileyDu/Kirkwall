import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Heading, Text } from '@chakra-ui/react';

const EnergyPage = () => {
  const [zipCode, setZipCode] = useState('');
  const [energyRates, setEnergyRates] = useState(null);
  const [error, setError] = useState(null);

  const apiKey= process.env.EIA_API_KEY

  // Function to fetch energy rates from EIA API based on zip code
  const fetchEnergyRates = async () => {
    setError(null); // Reset error
    setEnergyRates(null); // Reset rates
    try {
      // Fetch electricity data
      const electricityResponse = await axios.get('https://api.eia.gov/series/', {
        params: {
          api_key: {apiKey},
          series_id: `ELEC.PRICE.${zipCode}-ALL.M`, // Replace this series ID with the appropriate one for electricity prices by zip code
        },
      });

      // Fetch natural gas data
      const naturalGasResponse = await axios.get('https://api.eia.gov/series/', {
        params: {
            api_key: {apiKey},
            series_id: `NG.RNGWHHD.${zipCode}-A`, // Replace with the appropriate series ID for natural gas prices by zip code
        },
      });

      // Fetch propane data (if available)
      const propaneResponse = await axios.get('https://api.eia.gov/series/', {
        params: {
            api_key: {apiKey},
            series_id: `PET.EER_EPD2_PF4_Y35NY_DPG.${zipCode}-W`, // Replace with appropriate series ID for propane prices by zip code
        },
      });

      // Extract relevant data from responses
      const rates = {
        electricity: electricityResponse.data.series[0].data[0][1], // Latest electricity rate
        naturalGas: naturalGasResponse.data.series[0].data[0][1], // Latest natural gas rate
        propane: propaneResponse.data.series[0].data[0][1], // Latest propane rate
      };

      console.log('Energy rates after processing:', rates);
      setEnergyRates(rates);
    } catch (error) {
      setError('Failed to fetch energy rates. Please check the zip code or try again later.');
      console.error('Error fetching energy rates:', error);
    }
  };

  // Handle user input for zip code
  const handleZipCodeChange = e => setZipCode(e.target.value);

  return (
    <Box
      minHeight={'100vh'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Heading>Energy Rates Calculator</Heading>

      <Box display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
        <label>
          Enter your zip code:
          <input type="text" value={zipCode} onChange={handleZipCodeChange} />
          <Button variant={'blue'} onClick={fetchEnergyRates}>Get Energy Rates</Button>
        </label>
      </Box>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display energy rates if available */}
      {energyRates && (
        <Box 
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        p={8}
        background={'gray.600'}
        borderRadius={'lg'}
        boxShadow={'lg'}
        maxWidth={'600px'}
        textAlign={'center'}
        color={'white'}
        >
          <h2>Rates for Zip Code: {zipCode}</h2>
          <Text>Electricity: ${energyRates.electricity} per kWh</Text>
          <Text>Natural Gas: ${energyRates.naturalGas} per therm</Text>
          <Text>Propane: ${energyRates.propane} per gallon</Text>
        </Box>
      )}
    </Box>
  );
};

export default EnergyPage;
