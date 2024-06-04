import { Box, Flex, IconButton, Popover, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Tooltip } from '@chakra-ui/react';
import { FaCog, FaQuestionCircle } from 'react-icons/fa';

const ChartWrapper = ({ title, children }) => (
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
            <PopoverTrigger>
          <Tooltip label="Customize">
            <IconButton
              icon={<FaCog />}
              variant="outline"
              colorScheme="green"
              size="sm"
              mr="2"
            />
          </Tooltip>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverCloseButton />
          <PopoverHeader>Customize Chart</PopoverHeader>
          <PopoverBody>
            <p>Coming Soon!</p>
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

  export default ChartWrapper