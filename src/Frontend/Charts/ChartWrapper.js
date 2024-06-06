import { Box, Button, Flex, Text, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip, Divider } from '@chakra-ui/react';
import { FaCog, FaQuestionCircle } from 'react-icons/fa';
import { BsBarChartFill } from "react-icons/bs";
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
            <Text fontWeight="bold" fontSize={'lg'} py={2} textAlign={"center"}>Select Chart Type</Text>
            <Button mr={2} mb={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"} onClick={() => changeChartType('line')}>Line</Button>
            <Button mr={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"} onClick={() => changeChartType('bar')}>Bar</Button>
            {/* <Divider my={4} mt={6} borderColor={"green"} borderWidth={"2px"} borderRadius={"full"}/>
            <Text fontWeight="bold" fontSize={'lg'} pb={2}  textAlign={"center"}>Select Time Interval</Text>
            <Button mr={2} mb={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"}>5 minutes</Button>
            <Button mr={2} mb={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"}>15 minutes</Button>
            <Button mr={2} borderRadius={"full"} border={"1px"} color={"green"} width={"100%"}>30 minutes</Button> */}
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
            <Text>Hello World</Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
        </Flex>
      </Flex>
      {children}
    </Box>
  );
};

  export default ChartWrapper