import React from 'react';
import { Box, Stack, Button, IconButton, Flex, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverCloseButton, PopoverBody } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { WiThermometer, WiStrongWind, WiRain, WiHumidity } from 'react-icons/wi';
import { CloseIcon } from '@chakra-ui/icons';
import Logout from '../AuthComponents/Logout';

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <Box position="fixed" top="0" left="0" width="100%" height="100%" bg="rgba(0, 0, 0, 0.9)" zIndex="1000" color="white">
      <Flex justify="space-between" align="center" p="4" bg="#212121">
        <img
          src="/kirkwall_logo_1_white.png"
          alt="kirkwall logo"
          height="150px"
          width="150px"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <IconButton
          icon={<CloseIcon />}
          onClick={onClose}
          aria-label="Close Mobile Menu"
          bg="transparent"
          color="white"
        />
      </Flex>
      <Stack spacing="8" p="4">
        <Button variant="outline" color="white" leftIcon={<WiThermometer size="30" />} onClick={() => navigate('/TempSensors')}>Temperature Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiStrongWind size="30" />} onClick={() => navigate('/WindSensors')}>Wind Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiRain size="30" />} onClick={() => navigate('/RainSensors')}>Rain Sensors</Button>
        <Button variant="outline" color="white" leftIcon={<WiHumidity size="30" />} onClick={() => navigate('/HumiditySensors')}>Humidity Sensors</Button>
        <Logout />
      </Stack>
      {/* <Flex justify="center" mt="auto" p="4">
        <Popover>
          <PopoverTrigger>
            <Avatar size="md" name="Grand Farm Logo" src="/GrandFarmLogo.jpg" cursor="pointer" />
          </PopoverTrigger>
          <PopoverContent bg="white" borderColor="#212121" zIndex={1005}>
            <PopoverCloseButton size="lg" />
            <PopoverHeader fontWeight="bold" fontSize="xl" bg="#fd9801">Grand Farm</PopoverHeader>
            <PopoverBody>
              <Logout />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex> */}
    </Box>
  );
};

export default MobileMenu;
