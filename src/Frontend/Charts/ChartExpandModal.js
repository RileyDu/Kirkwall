import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, Box } from '@chakra-ui/react';

const ChartExpandModal = ({ isOpen, onClose, children, title }) => {
  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton size={"lg"}/>
        <ModalBody>

            {children}
        </ModalBody>
        {/* <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default ChartExpandModal;
