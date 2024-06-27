import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from '@chakra-ui/react';

const ChartExpandModal = ({ isOpen, onClose, children, title }) => {
  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton size={"lg"}/>
        <ModalBody>
            <Box display={"flex"}  justifyContent={"space-between"} mb={2}>
                <Button borderRadius={"full"}>1H</Button>
                <Button>3H</Button>
                <Button>6H</Button>
                <Button>12H</Button>
                <Button>1D</Button>
                <Button>3D</Button>
                <Button>1W</Button>
            </Box>
        <Box
          h="800px"
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="gray.50"
          p="4"
          borderRadius="md"
          boxShadow="md"
        >
          {children}
        </Box>
        </ModalBody>
        {/* <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
