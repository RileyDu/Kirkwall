import {
  Box, Button, Flex, Text, IconButton, Popover, PopoverBody,
  PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { BsBarChartFill } from 'react-icons/bs';
import { FaChartBar, FaChartLine } from "react-icons/fa";

import { useState } from 'react';
import ChartDetails from './ChartDetails';

const ChartWrapper = ({ title, children, onChartChange, metric }) => {
  const [chartType, setChartType] = useState('bar');

  const changeChartType = (type) => {
    setChartType(type);
    if (onChartChange) {
      onChartChange(type);
    }
  };

  const iconSize = '24';

  return (
    <Box
      border="1px"
      borderColor="#fd9801"
      borderRadius="md"
      boxShadow="md"
      p="6"
      pb="12"
      bg="gray.50"
      h="500px"
      w="100%"
    >
      <Flex justify="space-between" mb="4">
        <Box fontSize="xl" fontWeight="bold">
          {title}
        </Box>
        <Flex>
          <Popover>
            <Tooltip label="Customize">
              <PopoverTrigger>
                <IconButton
                  icon={<FaCog />}
                  variant="outline"
                  colorScheme="#212121"
                  size="sm"
                  mr="2"
                />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent borderColor={'#212121'}>
              <PopoverCloseButton color={'white'} size={"lg"}/>
              <PopoverHeader fontWeight="bold" fontSize={'xl'} bg={'#fd9801'} color={'white'}>Customize Chart</PopoverHeader>
              <PopoverBody>
                <Text fontWeight="bold" fontSize={'lg'} py={2} textAlign={"center"}>Select Chart Type</Text>
                <Button mr={2} mb={2} borderRadius={"md"} border={"1px"} color={"#fd9801"} bg={"white"} borderColor={"#212121"} width={"100%"} onClick={() => changeChartType('line')} leftIcon={<FaChartLine size={iconSize} />}>LINE</Button>
                <Button mr={2} borderRadius={"md"} border={"1px"} color={"#fd9801"} bg={"white"} borderColor={"#212121"} width={"100%"} onClick={() => changeChartType('bar')} leftIcon={<FaChartBar size={iconSize} />}>BAR</Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Popover>
            <Tooltip label="Details">
              <PopoverTrigger>
                <IconButton
                  icon={<BsBarChartFill />}
                  variant="outline"
                  colorScheme="#212121"
                  size="sm"
                />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent borderColor={'#212121'}>
              <PopoverCloseButton color={'white'} size={"lg"}/>
              <PopoverHeader fontWeight="bold" fontSize={'xl'} bg={'#fd9801'} color={'white'}> Chart Details</PopoverHeader>
              <PopoverBody>
                <ChartDetails chartType={chartType} metric={metric} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
      {children}
    </Box>
  );
};

export default ChartWrapper;
