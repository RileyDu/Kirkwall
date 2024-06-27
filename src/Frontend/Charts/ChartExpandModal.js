import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from '@chakra-ui/react';

const ChartExpandModal = ({ isOpen, onClose, children, title }) => {
  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg={"#212121"} color={"white"} fontSize={"2xl"}>{title}</ModalHeader>
        <ModalCloseButton size={"lg"} color={"white"}/>
        <ModalBody>
            <Box display={"flex"}  justifyContent={"space-between"} my={4}>
                <Button variant={"pill"}>1H</Button>
                <Button variant={"pill"}>3H</Button>
                <Button variant={"pill"}>6H</Button>
                <Button variant={"pill"}>12H</Button>
                <Button variant={"pill"}>1D</Button>
                <Button variant={"pill"}>3D</Button>
                <Button variant={"pill"}>1W</Button>
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
          border={"2px solid #fd9801"}
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
