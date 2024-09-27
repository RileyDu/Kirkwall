import React from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const ChatbotModal = ({ showChatbot, onClose }) => {
  const { isOpen, onOpen, onClose: handleClose } = useDisclosure({
    defaultIsOpen: showChatbot,
  });

  return (
    <>
      {/* <Button onClick={onOpen}>Open Chatbot</Button> */}
      <Modal isOpen={isOpen} onClose={() => { handleClose(); onClose(); }} size="3xl" isCentered>
        <ModalOverlay />
        <ModalContent boxShadow="xl">
          <ModalHeader borderTopRadius={"md"} bg={"gray.600"} color={"white"}>AI Recap</ModalHeader>
          <ModalCloseButton size={"lg"} mt={1} />
          <ModalBody padding="0">
            <Box
              as="iframe"
              src="https://kirkwallweeklyrecapanalyzer-14344.chipp.ai"
              height="800px"
              width="100%"
              border="none"
              borderBottomRadius="md"
              overflow="hidden"
              boxShadow="md"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChatbotModal;
