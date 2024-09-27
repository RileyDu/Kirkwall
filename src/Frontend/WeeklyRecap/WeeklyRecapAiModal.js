import React from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useBreakpointValue
} from "@chakra-ui/react";

const ChatbotModal = ({ showChatbot, onClose }) => {
  const { isOpen, onOpen, onClose: handleClose } = useDisclosure({
    defaultIsOpen: showChatbot,
  });

  // Use `useBreakpointValue` to set the modal size based on the screen width
  const modalSize = useBreakpointValue({ base: "full", md: "3xl" });

  // Set padding and height values based on screen size for better UX on mobile
  const modalBodyPadding = useBreakpointValue({ base: ".5rem", md: "0" });
  const iframeHeight = useBreakpointValue({ base: "80vh", md: "800px" });

  return (
    <>
      {/* <Button onClick={onOpen}>Open Chatbot</Button> */}
      <Modal 
        isOpen={isOpen} 
        onClose={() => { handleClose(); onClose(); }} 
        size={modalSize} 
        isCentered 
        motionPreset="slideInBottom" // Smooth slide in animation on mobile
      >
        <ModalOverlay />
        <ModalContent 
          boxShadow="xl" 
          maxHeight={{ base: "100%", md: "95vh" }} // Prevents overflow on small screens
        >
          <ModalHeader 
            borderTopRadius={"md"} 
            bg={"gray.600"} 
            color={"white"} 
          >
            AI Recap
          </ModalHeader>
          <ModalCloseButton size={"lg"} mt={1} />
          <ModalBody padding={modalBodyPadding}>
            <Box
              as="iframe"
              src="https://kirkwallweeklyrecapanalyzer-14344.chipp.ai"
              height={iframeHeight}
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
