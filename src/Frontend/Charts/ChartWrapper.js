import { Box, Flex, IconButton, Tooltip } from '@chakra-ui/react';
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
          <Tooltip label="Customize">
            <IconButton
              icon={<FaCog />}
              variant="outline"
              colorScheme="green"
              size="sm"
              mr="2"
            />
          </Tooltip>
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