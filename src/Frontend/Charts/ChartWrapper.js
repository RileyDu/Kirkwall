import {
  Box, Button, Flex, Text, IconButton, Popover, PopoverBody,
  PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { BsBarChartFill } from 'react-icons/bs';
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
                  colorScheme="green"
                  size="sm"
                  mr="2"
                />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold" fontSize={'lg'}>Customize Chart</PopoverHeader>
              <PopoverBody>
                <Text fontWeight="bold" fontSize={'lg'} py={2} textAlign={"center"}>Select Chart Type</Text>
                <Button mr={2} mb={2} borderRadius={"full"} border={"1px"} color={"#fd9801"} width={"100%"} onClick={() => changeChartType('line')}>LINE</Button>
                <Button mr={2} borderRadius={"full"} border={"1px"} color={"#fd9801"} width={"100%"} onClick={() => changeChartType('bar')}>BAR</Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Popover>
            <Tooltip label="Details">
              <PopoverTrigger>
                <IconButton
                  icon={<BsBarChartFill />}
                  variant="outline"
                  colorScheme="navy"
                  size="sm"
                />
              </PopoverTrigger>
            </Tooltip>
            <PopoverContent>
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold" fontSize={'lg'}>Details</PopoverHeader>
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
