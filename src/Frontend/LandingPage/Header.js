import React from 'react';
import { Box, Flex, Button, Icon, Heading, Link, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { FaChessRook, FaBars } from 'react-icons/fa';

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="navy.900" color="white" py={4} px={8} width="100%" position="sticky" top="0" zIndex="1000">
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto">
        <Flex align="center">
          <Icon as={FaChessRook} w={10} h={10} mr={3} color="primary.300" />
          <Heading size="lg">Kirkwall</Heading>
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }}>
          <Link href="https://kirkwall-demo.vercel.app/login" style={{ textDecoration: 'none' }}>
            <Button colorScheme="primary">Get Started</Button>
          </Link>
        </Flex>
        <Icon as={FaBars} w={8} h={8} display={{ base: 'block', md: 'none' }} onClick={onOpen} />
      </Flex>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg="navy.800" color="white">
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" borderColor="primary.300" >Menu</DrawerHeader>
          <DrawerBody>
            <Link href="#overview" onClick={onClose}>
              <Button color={'whitesmoke'} w="100%" my={2} bg="navy.700" _hover={{ bg: "navy.600" }}>Overview</Button>
            </Link>
            <Link href="#core-values" onClick={onClose}>
              <Button color={'whitesmoke'} w="100%" my={2} bg="navy.700" _hover={{ bg: "navy.600" }}>Core Values</Button>
            </Link>
            <Link href="#our-philosophy" onClick={onClose}>
              <Button color={'whitesmoke'} w="100%" my={2} bg="navy.700" _hover={{ bg: "navy.600" }}>Our Philosophy</Button>
            </Link>
            <Link href="https://kirkwall-demo.vercel.app/login" onClick={onClose}>
              <Button w="100%" my={2} colorScheme="primary">Get Started</Button>
            </Link>
            
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
