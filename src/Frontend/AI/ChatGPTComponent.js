import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';
import { FiSend } from 'react-icons/fi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ChatGPTComponent = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' },
  ]);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const lastRequestTimeRef = useRef(0);
  const REQUEST_INTERVAL = 1000;
  const messagesEndRef = useRef(null);

  const bgGradient = useColorModeValue(
    'linear(to-r, gray.100, gray.200)',
    'linear(to-r, gray.700, gray.800)'
  );
  const botBg = useColorModeValue('blue.200', 'blue.600');
  const userBg = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        setAuthToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTimeRef.current;

    if (timeSinceLastRequest < REQUEST_INTERVAL) {
      setError('Please wait a moment before sending another message.');
      return;
    }

    lastRequestTimeRef.current = currentTime;
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setConversationHistory((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      if (!authToken) {
        setError('You must be logged in to perform this action.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/nlquery/query`,
        {
          question: input,
          conversation: conversationHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data.response) {
        const botMessage = {
          sender: 'bot',
          text: response.data.response,
        };
        setMessages((prev) => [...prev, botMessage]);
        setConversationHistory((prev) => [...prev, { role: 'assistant', content: botMessage.text }]);
      }
    } catch (err) {
      console.error('Error communicating with API:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  return (
    <Flex
      direction="column"
      h="90vh"
      maxW="800px"
      mx="auto"
      my="8"
      p="4"
      bgGradient={bgGradient}
      borderRadius="lg"
      boxShadow="lg"
    >
      <Text fontSize="xl" fontWeight="bold" textAlign="center" color="blue.400" mb="4">
        Chat Assistant
      </Text>
      <VStack
        flex="1"
        overflowY="auto"
        spacing="4"
        bg="gray.700"
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
      <HStack mt="4" spacing="4">
        <Input
          placeholder="Type your query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          bg="gray.800"
          color="white"
          _placeholder={{ color: 'gray.500' }}
          isDisabled={loading}
        />
        <Button
          onClick={handleSend}
          isLoading={loading}
          colorScheme="blue"
          rightIcon={<FiSend />}
        >
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatGPTComponent;
