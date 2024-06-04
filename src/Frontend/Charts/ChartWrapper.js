import { Box, Button, Flex, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip } from '@chakra-ui/react';
import { FaCog, FaQuestionCircle } from 'react-icons/fa';
import { useState } from 'react';

const ChartWrapper = ({ title, children, onChartChange }) => {
  const [chartType, setChartType] = useState('line');


  const changeChartType = (type) => {
    setChartType(type);
    // Call the prop if available
    if (onChartChange) {
      onChartChange(type);
    }
  };

  return (
    <Box
      border="1px"
      borderColor="green"
      borderRadius="md"
      boxShadow="md"
      p="6"
      pb="12"
      bg="gray.50"
      h="500px"
      w="100%"
    >
      <Flex justify="space-between" mb="4">
        <Box fontSize="lg" fontWeight="bold">
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
            <Button mr={2} mb={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"} onClick={() => changeChartType('line')}>Line</Button>
            <Button mr={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"} onClick={() => changeChartType('bar')}>Bar</Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
          <Tooltip label="Help">
            <IconButton
              icon={<FaQuestionCircle />}
              variant="outline"
              colorScheme="navy"
              size="sm"
            />
          </Tooltip>
        </Flex>
      </Flex>
      {children}
    </Box>
  );
};

  export default ChartWrapper