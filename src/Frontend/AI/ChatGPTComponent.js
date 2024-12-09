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
  Input,
  IconButton,
} from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';
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
  const [starterSelected, setStarterSelected] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [lastBotResponse, setLastBotResponse] = useState('');

  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

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
    setStarterSelected(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `/api/nlquery/`,
        {
          question: prompt,
          conversation: [...conversationHistory, { role: 'user', content: prompt }],
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
        setLastBotResponse(response.data.response); // Store last bot response
        setIsFollowUp(true); // Enable follow-up
      }
    } catch (err) {
      console.error('Error communicating with API:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserInput = async () => {
    if (!userInput.trim()) return;
    if (!userEmail) {
      setError('User email not available.');
      return;
    }

    const userMessage = { sender: 'user', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isFollowUp && lastBotResponse) {
        // Send to the new follow-up route
        response = await axios.post(
          `/api/followup/`,
          {
            lastResponse: lastBotResponse,
            question: userInput,
            userEmail, // Include userEmail if needed
          },
        );
      } else {
        // Fallback to the original route if not a follow-up
        response = await axios.post(
          `/api/nlquery/`,
          {
            question: userInput,
            conversation: conversationHistory.concat({ role: 'user', content: userInput }),
            userEmail,
          },
        );
      }

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
        setLastBotResponse(response.data.response); // Update last bot response
        setIsFollowUp(true); // Maintain follow-up state
      }
    } catch (err) {
      console.error('Error communicating with API:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setMessages([
      { sender: 'bot', text: 'Hello! How can I assist you today?' },
    ]);
    setConversationHistory([
      { role: 'assistant', content: 'Hello! How can I assist you today?' },
    ]);
    setStarterSelected(false);
    setUserInput('');
    setError(null);
    setIsFollowUp(false);
    setLastBotResponse('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay />
      <ModalContent
        sx={{
          border: '2px solid black',
          bg: useColorModeValue('white', 'gray.800'), // Adjust as needed for light/dark mode
        }}
        maxW={['90vw', '800px']} // Responsive array for max width
      >
        <ModalHeader bg="gray.900" color="white">Kirkwall AI</ModalHeader>
        <ModalCloseButton mt={1} size={'lg'} />
        <ModalBody>
          <Flex
            direction="column"
            h="90vh"
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
                  <Text color={msg.sender === 'user' ? 'black' : 'white'}>{msg.text}</Text>
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
            <Flex mt="4" spacing="4" align="stretch" justify="space-between" alignItems="center">
              {!starterSelected ? (
                <VStack spacing="4" align="stretch" flex="1">
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
              ) : (
                <HStack width="100%" spacing="2">
                  <Input
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    // bg={useColorModeValue('gray.200', 'gray.600')}
                  />
                  <IconButton
                    aria-label="Send message"
                    icon={<ArrowRightIcon />}
                    colorScheme="blue"
                    onClick={handleUserInput}
                    isDisabled={loading}
                  />
                  <Button
                    onClick={handleStartOver}
                    colorScheme="red"
                    variant="outline"
                  >
                    Start Over
                  </Button>
                </HStack>
              )}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChatGPTComponent;
