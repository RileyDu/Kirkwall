// FullscreenModal.js
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';

const FullscreenModal = ({ isOpen, onClose, streamUrl }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent bg="black">
        <ModalBody display="flex" justifyContent="center" alignItems="center">
          <iframe
            width="100%"
            height="100%"
            src={streamUrl}
            title="Fullscreen Video Feed"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullscreenModal;
