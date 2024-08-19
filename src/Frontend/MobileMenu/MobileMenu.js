import React from 'react';
import { Box, Stack, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { WiThermometer, WiStrongWind, WiRain, WiHumidity } from 'react-icons/wi';
import Logout from '../AuthComponents/Logout.js';
import { FaDog } from "react-icons/fa";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Box position="fixed" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.9)" zIndex="1000" color="white">
      <Flex justify="space-between" align="center" p="4" bg="#212121">
        <img
          src="/kirkwall_logo_1_white.png"
          alt="kirkwall logo"
          height="150px"
          width="150px"
          onClick={() => handleNavigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </Flex>
      <Stack spacing="8" p="4">
        <Button variant="outline" color="white" leftIcon={<WiThermometer size="30" />} onClick={() => handleNavigate('/TempSensors')}>Temperature Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiStrongWind size="30" />} onClick={() => handleNavigate('/WindSensors')}>Wind Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiRain size="30" />} onClick={() => handleNavigate('/RainSensors')}>Rain Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiHumidity size="30" />} onClick={() => handleNavigate('/HumiditySensors')}>Humidity Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<FaDog size="30" />} onClick={() => handleNavigate('/WatchdogSensors')}>Watchdog Sensors</Button>
        <Logout onLogout={onClose} />
      </Stack>
    </Box>
  );
};

export default MobileMenu;
