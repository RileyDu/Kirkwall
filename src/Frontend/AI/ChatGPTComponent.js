// frontend/src/components/ChatGPTComponent.jsx

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
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
  const [hiddenData, setHiddenData] = useState(null); // This will hold your dailyData array

  const { currentUser } = useAuth();
  const userEmail = currentUser?.email;

  const messagesEndRef = useRef(null);

  const botBg = useColorModeValue('blue.200', 'blue.600');
  const userBg = useColorModeValue('blue.500', 'blue.300');

  const starterPrompts = [
    'Give me a summary of the data from WatchDog for the last week.',
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handlePromptClick = async prompt => {
    if (!userEmail) {
      setError('User email not available.');
      return;
    }

    const userMessage = { sender: 'user', text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: prompt },
    ]);
    setStarterSelected(true);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/nlquery/', {
        question: prompt,
        conversation: [
          ...conversationHistory,
          { role: 'user', content: prompt },
        ],
        userEmail,
      });

      if (response.data.response) {
        // Store dailyData for table rendering
        if (response.data.dailyData && response.data.dailyData.length > 0) {
          setHiddenData(response.data.dailyData);
        }

        const botMessage = {
          sender: 'summary',
          // Instead of just response.data.response (a string),
          // now you might do something like JSON.stringify or build a custom UI:
          text: JSON.stringify(response.data.response.summary, null, 2),
          // or store it as a structured object
          data: response.data.response,
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationHistory(prev => [
          ...prev,
          { role: 'assistant', content: botMessage.text },
        ]);
        setLastBotResponse(response.data.response);
        setIsFollowUp(true);
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
    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [
      ...prev,
      { role: 'user', content: userInput },
    ]);
    setUserInput('');
    setLoading(true);
    setError(null);

    try {
      let response;
      if (isFollowUp && lastBotResponse) {
        response = await axios.post(`/api/followup/`, {
          lastResponse: lastBotResponse,
          question: userInput,
          userEmail,
          readingsData: hiddenData,
        });
      } else {
        response = await axios.post(`/api/nlquery/`, {
          question: userInput,
          conversation: conversationHistory.concat({
            role: 'user',
            content: userInput,
          }),
          userEmail,
        });
      }

      if (response.data.response.summary) {
        const botMessage = {
          sender: 'bot',
          // Instead of just response.data.response (a string),
          // now you might do something like JSON.stringify or build a custom UI:
          text: JSON.stringify(response.data.response, null, 2),
          // or store it as a structured object
          data: response.data.response,
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationHistory(prev => [
          ...prev,
          { role: 'assistant', content: botMessage.text },
        ]);
        setLastBotResponse(response.data.response);
        setIsFollowUp(true);
      }
      else if (response.data.response) {
        const botMessage = {
          sender: 'bot',
          text: response.data.response
        };
        setMessages(prev => [...prev, botMessage]);
        setConversationHistory(prev => [
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
    setHiddenData(null); // Clear the daily data
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  // Build a display array that injects the table as the third item (right after the second message).
  const displayedMessages = useMemo(() => {
    // If we don't have hiddenData or we have fewer than two messages, just display messages as usual.
    if (!hiddenData || messages.length < 2) {
      return messages.map(msg => ({ ...msg, isTable: false }));
    }

    // Otherwise, take the first two, add a special placeholder for the table, then the rest
    const firstTwo = messages
      .slice(0, 2)
      .map(msg => ({ ...msg, isTable: false }));
    const rest = messages.slice(2).map(msg => ({ ...msg, isTable: false }));
    // This is our special placeholder for rendering the table
    const tablePlaceholder = { isTable: true };
    return [...firstTwo, tablePlaceholder, ...rest];
  }, [messages, hiddenData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay />
      <ModalContent
        sx={{
          border: '2px solid black',
          bg: useColorModeValue('white', 'gray.800'),
        }}
        maxW={['90vw', '800px']}
      >
        <ModalHeader bg="gray.900" color="white">
          Kirkwall AI
        </ModalHeader>
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
              {displayedMessages.map((msg, index) => {
                // 1) If this item is the table placeholder, render the table
                if (msg.isTable) {
                  return (
                    <Box
                      key={`table-${index}`}
                      alignSelf="stretch"
                      boxShadow="sm"
                      borderRadius="md"
                      overflowX="auto"
                    >
                      <Table variant="simple" size="sm">
                        <Thead>
                          <Tr>
                            <Th>Date</Th>
                            <Th>Avg Temp (°F)</Th>
                            <Th>Min Temp (°F)</Th>
                            <Th>Max Temp (°F)</Th>
                            <Th>Avg Hum (%)</Th>
                            <Th>Min Hum (%)</Th>
                            <Th>Max Hum (%)</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {hiddenData.map((dayRow, idx) => {
                            const dayStr = new Date(
                              dayRow.day
                            ).toLocaleDateString();
                            return (
                              <Tr key={idx}>
                                <Td>{dayStr}</Td>
                                <Td>{dayRow.avg_temp.toFixed(2)}</Td>
                                <Td>{dayRow.min_temp.toFixed(2)}</Td>
                                <Td>{dayRow.max_temp.toFixed(2)}</Td>
                                <Td>{dayRow.avg_hum.toFixed(2)}</Td>
                                <Td>{dayRow.min_hum.toFixed(2)}</Td>
                                <Td>{dayRow.max_hum.toFixed(2)}</Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  );
                }

                // 2) If the bot sent a structured JSON response (msg.data), render the JSON fields
                else if (msg.sender === 'summary' && msg.data) {
                  return (
                    <Box
                      key={index}
                      alignSelf="flex-start"
                      bg={botBg}
                      px="4"
                      py="2"
                      borderRadius="md"
                      maxW="70%"
                      wordBreak="break-word"
                      boxShadow="sm"
                    >
                      {/* Example of using specific fields from msg.data */}
                      <Text color="white" fontWeight="bold">
                        Summary:
                      </Text>
                      <Text color="white">{msg.data.summary}</Text>
                      {/* {console.log(msg.data)} */}
                      <Divider my={2} />
                      <Text color="white" fontWeight="bold">What would you like to know about your watchdog sensors from the past week?</Text>
                    </Box>
                  )
                }

                // 3) Otherwise, render a normal message (text)
                return (
                  <Box
                    key={index}
                    alignSelf={
                      msg.sender === 'user' ? 'flex-end' : 'flex-start'
                    }
                    bg={msg.sender === 'user' ? userBg : botBg}
                    px="4"
                    py="2"
                    borderRadius="md"
                    maxW="70%"
                    wordBreak="break-word"
                    boxShadow="sm"
                  >
                    <Text color={msg.sender === 'user' ? 'black' : 'white'}>
                      {msg.text}
                    </Text>
                  </Box>
                );
              })}

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
            <Flex
              mt="4"
              spacing="4"
              align="stretch"
              justify="space-between"
              alignItems="center"
            >
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
                    onChange={e => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
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
