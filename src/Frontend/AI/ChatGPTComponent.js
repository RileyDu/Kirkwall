// frontend/src/components/ChatGPTComponent.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { useAuth } from '../AuthComponents/AuthContext.js';

const ChatGPTComponent = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);

  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const messagesEndRef = useRef(null);

  const bgGradient = useColorModeValue(
    'linear(to-r, white, white)',
    'linear(to-r, gray.700, gray.800)'
  );
  const botBg = useColorModeValue('blue.200', 'blue.600');
  const userBg = useColorModeValue('blue.500', 'blue.300');

  const starterPrompts = [
    'Could you give me a recap of the week?',
    'Has there been any network security alerts in the last week?',
    'How many alerts have been generated in the last 24 hours?',
    'When was the last alert generated?',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handlePromptClick = async (prompt) => {
    if (!userEmail) {
      setError('User email not available.');
      return;
    }

    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { role: 'user', content: prompt }]);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/nlquery/`,
        {
          question: prompt,
          conversation: conversationHistory,
          userEmail, // Include userEmail in the request body
        },
      );

      if (response.data.response) {
        const botMessage = {
          sender: 'bot',
          text: response.data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
        setConversationHistory((prev) => [
          ...prev,
          { role: 'assistant', content: botMessage.text },
        ]);
      }
    } catch (err) {
      console.error('Error communicating with API:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent
        sx={{
          border: '2px solid black',
          bg: useColorModeValue('white', 'gray.800'), // Adjust as needed for light/dark mode
        }}
        maxW={['90vw', '800px']} // Responsive array for max width
      >
        <ModalHeader>Kirkwall AI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            direction="column"
            h="60vh"
            maxW="800px"
            mx="auto"
            my="4"
            p="4"
            bg={useColorModeValue('white', 'gray.700')}
            borderRadius="lg"
            boxShadow="lg"
          >
            <VStack
              flex="1"
              overflowY="auto"
              spacing="4"
              bg={useColorModeValue('gray.100', 'gray.600')}
              borderRadius="lg"
              p="4"
              boxShadow="base"
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
                  bg={msg.sender === 'user' ? userBg : botBg}
                  px="4"
                  py="2"
                  borderRadius="md"
                  maxW="70%"
                  wordBreak="break-word"
                  boxShadow="sm"
                >
                  <Text color="white">{msg.text}</Text>
                </Box>
              ))}
              {loading && (
                <HStack alignSelf="flex-start">
                  <Spinner color="blue.500" />
                  <Text color="gray.300">Thinking...</Text>
                </HStack>
              )}
              <div ref={messagesEndRef} />
            </VStack>
            {error && (
              <Text color="red.400" textAlign="center" mt="2">
                {error}
              </Text>
            )}
            <VStack mt="4" spacing="4" align="stretch">
              {starterPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  colorScheme="blue"
                  isDisabled={loading}
                >
                  {prompt}
                </Button>
              ))}
            </VStack>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatGPTComponent;
