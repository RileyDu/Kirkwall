import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  IconButton,
  VStack,
  HStack,
  Spinner,
  Avatar,
  Heading,
  CloseButton,
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Icon,
  useToast,
  Badge,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaArrowUp, FaLeaf, FaExclamationTriangle, FaLightbulb, FaCheckCircle } from 'react-icons/fa';
import { GiChessRook, GiWaterDrop, GiAerosol } from 'react-icons/gi';
import { WiHumidity } from 'react-icons/wi';
import axios from 'axios';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

// Helper function to safely parse JSON content from the API
const parseAnalysisContent = (content) => {
  try {
    // Handle plain text answers for follow-up questions
    if (typeof content === 'string' && 
        !content.includes('SUMMARY') && 
        !content.includes('KEY_INSIGHTS') && 
        !content.includes('RECOMMENDATIONS') && 
        !content.includes('RISK_AREAS') &&
        !content.includes('{') && 
        !content.includes('[')) {
      // This is plain text, likely a follow-up response
      return { plainTextResponse: content };
    }

    // If the content is already a structured object, just return it
    if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
      return content;
    }

    // Try to parse as JSON directly first
    if (typeof content === 'string') {
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (e) {
        console.warn('Direct JSON parsing failed, trying alternative methods:', e);
      }
    }

    // If JSON parsing fails, try the regex approach
    if (typeof content === 'string') {
      // Check if it's a JSON string with escaped quotes
      if (content.includes('\\\"') || content.includes('\\"')) {
        // Replace escaped quotes
        let cleanedContent = content.replace(/\\"/g, '"').replace(/\\\\"/g, '"').replace(/\\\"/g, '"');
        
        // Ensure there are no unescaped quotes causing issues
        cleanedContent = cleanedContent.replace(/\"\s*\"/g, '","');
        
        // Make sure arrays are properly formatted (replace parentheses with brackets if needed)
        cleanedContent = cleanedContent.replace(/\(\s*\"/g, '["').replace(/\"\s*\)/g, '"]');
        
        try {
          return JSON.parse(cleanedContent);
        } catch (jsonError) {
          console.warn('Standard JSON parsing failed after cleaning:', jsonError);
          // Continue to next approach if this fails
        }
      }

      // Extract sections using regex as a last resort
      try {
        // Extract the main sections using regex
        const summaryMatch = content.match(/["']?SUMMARY["']?\s*:?\s*["']([^"']*)["']/);
        const summary = summaryMatch ? summaryMatch[1] : 'Summary data unavailable';

        // Function to extract array items
        const extractArrayItems = (sectionName, content) => {
          const sectionRegex = new RegExp(`["']?${sectionName}["']?\\s*:?\\s*\\[(.*?)\\]`, 's');
          const sectionMatch = content.match(sectionRegex);
          
          if (!sectionMatch || !sectionMatch[1]) return ['Data unavailable'];
          
          // Match strings within the array
          const itemRegex = /["']([^"']*)["']/g;
          const items = [];
          let match;
          
          while ((match = itemRegex.exec(sectionMatch[1])) !== null) {
            items.push(match[1]);
          }
          
          return items.length > 0 ? items : [`${sectionName} data unavailable`];
        };

        return {
          SUMMARY: summary,
          KEY_INSIGHTS: extractArrayItems('KEY_INSIGHTS', content),
          RECOMMENDATIONS: extractArrayItems('RECOMMENDATIONS', content),
          RISK_AREAS: extractArrayItems('RISK_AREAS', content)
        };
      } catch (regexError) {
        console.warn('Regex extraction failed:', regexError);
      }
    }

    // If all parsing methods fail, return fallback values
    return { 
      SUMMARY: 'Unable to parse analysis data',
      KEY_INSIGHTS: ['Error processing data'],
      RECOMMENDATIONS: ['Please try refreshing or contact support'],
      RISK_AREAS: ['Data parsing error']
    };
  } catch (error) {
    console.error('Error parsing analysis content:', error);
    console.error('Content that failed parsing:', typeof content === 'string' ? 
      content.substring(0, 100) + "..." : typeof content);
    
    return { 
      SUMMARY: 'Unable to parse analysis data',
      KEY_INSIGHTS: ['Error processing data'],
      RECOMMENDATIONS: ['Please try refreshing or contact support'],
      RISK_AREAS: ['Data parsing error']
    };
  }
};

const RecapChatbot = ({ recapData, recentAlerts, userEmail, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinkerVisible, setIsThinkerVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const [initialAnalysisDone, setInitialAnalysisDone] = useState(false);
  const { isOpen } = useDisclosure({ defaultIsOpen: true });
  const toast = useToast();

  // Automatically scroll to the bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate initial analysis when component mounts
  useEffect(() => {
    const generateInitialAnalysis = async () => {
      setIsLoading(true);
      setIsThinkerVisible(true);
      try {
        const response = await axios.post('/api/weekly-recap/analyze', {
          recapData,
          recentAlerts,
          userEmail
        });
        
        // Get the analysis content
        let analysisContent = response.data.analysis;
        console.log("Initial analysis received:", analysisContent?.substring(0, 100));
        
        setMessages([
          {
            role: 'assistant',
            content: analysisContent,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setInitialAnalysisDone(true);
      } catch (error) {
        console.error('Error generating initial analysis:', error);
        
        // Show a toast with the error
        toast({
          title: 'Error',
          description: 'Failed to analyze data. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        
        setMessages([
          {
            role: 'assistant',
            content: "I'm having trouble analyzing your data. Please try asking a specific question about your weekly recap data.",
            timestamp: new Date().toLocaleTimeString()
          }
        ]);
        setInitialAnalysisDone(true);
      } finally {
        setIsLoading(false);
        setIsThinkerVisible(false);
      }
    };

    generateInitialAnalysis();
  }, [recapData, recentAlerts, userEmail, toast]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsThinkerVisible(true);
    
    try {
      const response = await axios.post('/api/weekly-recap/followup', {
        lastResponse: messages.length > 0 ? messages[messages.length - 1].content : '',
        question: input,
        userEmail,
        recapData,
        recentAlerts
      });
      
      // Log the response to help debug
      console.log("Follow-up response received:", response.data);
      
      // Get the response content - should be directly accessible now with our backend fix
      const responseContent = response.data.response;
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } catch (error) {
      console.error('Error getting follow-up response:', error);
      
      // Show a toast with the error
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error while processing your question. Please try again.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsLoading(false);
      setIsThinkerVisible(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Select an icon based on the content
  const getIconForInsight = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('temperature') || lowerText.includes('°f') || 
        lowerText.includes('heat') || lowerText.includes('cold')) {
      return GiAerosol;
    } else if (lowerText.includes('humidity') || lowerText.includes('%')) {
      return WiHumidity;
    } else if (lowerText.includes('moisture') || lowerText.includes('water') || 
               lowerText.includes('wet') || lowerText.includes('saturation')) {
      return GiWaterDrop;
    }
    return FaLeaf;
  };

  // Render AI message content in a visually appealing way
  const renderAIMessageContent = (content) => {
    try {
      // Try to parse the content
      const parsedContent = parseAnalysisContent(content);

      // Check if this is a plain text follow-up response
      if (parsedContent.plainTextResponse) {
        return (
          <Box>
            <Text whiteSpace="pre-line">{parsedContent.plainTextResponse}</Text>
          </Box>
        );
      }

      // Check if parsing was successful and if we have a structured analysis
      if (parsedContent.SUMMARY || parsedContent.KEY_INSIGHTS || 
          parsedContent.RECOMMENDATIONS || parsedContent.RISK_AREAS) {
        
        return (
          <Box>
            {/* Summary Section */}
            {parsedContent.SUMMARY && (
              <Box mb={4} p={3} bg="gray.800" borderRadius="md">
                <Text fontSize="lg" fontWeight="bold" mb={2} color="#63B3ED">Weekly Summary</Text>
                <Text>{parsedContent.SUMMARY}</Text>
              </Box>
            )}
            
            {/* Key Insights Section */}
            {parsedContent.KEY_INSIGHTS && parsedContent.KEY_INSIGHTS.length > 0 && 
             !parsedContent.KEY_INSIGHTS.includes('Key insights data unavailable') && (
              <Box mb={4}>
                <Flex align="center" mb={2}>
                  <Icon as={FaLightbulb} color="#F6E05E" mr={2} />
                  <Text fontSize="md" fontWeight="bold" color="#F6E05E">Key Insights</Text>
                </Flex>
                <List spacing={2}>
                  {parsedContent.KEY_INSIGHTS.map((insight, idx) => (
                    <ListItem key={`insight-${idx}`} display="flex" alignItems="flex-start">
                      <ListIcon as={getIconForInsight(insight)} color="#F6E05E" mt={1} />
                      <Text>{insight}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Recommendations Section */}
            {parsedContent.RECOMMENDATIONS && parsedContent.RECOMMENDATIONS.length > 0 && 
             !parsedContent.RECOMMENDATIONS.includes('Recommendations data unavailable') && (
              <Box mb={4}>
                <Flex align="center" mb={2}>
                  <Icon as={FaCheckCircle} color="#68D391" mr={2} />
                  <Text fontSize="md" fontWeight="bold" color="#68D391">Recommendations</Text>
                </Flex>
                <List spacing={2}>
                  {parsedContent.RECOMMENDATIONS.map((rec, idx) => (
                    <ListItem key={`rec-${idx}`} display="flex" alignItems="flex-start">
                      <ListIcon as={FaCheckCircle} color="#68D391" mt={1} />
                      <Text>{rec}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Risk Areas Section */}
            {parsedContent.RISK_AREAS && parsedContent.RISK_AREAS.length > 0 && 
             !parsedContent.RISK_AREAS.includes('Risk areas data unavailable') && (
              <Box>
                <Flex align="center" mb={2}>
                  <Icon as={FaExclamationTriangle} color="#FC8181" mr={2} />
                  <Text fontSize="md" fontWeight="bold" color="#FC8181">Risk Areas</Text>
                </Flex>
                <List spacing={2}>
                  {parsedContent.RISK_AREAS.map((risk, idx) => (
                    <ListItem key={`risk-${idx}`} display="flex" alignItems="flex-start">
                      <ListIcon as={FaExclamationTriangle} color="#FC8181" mt={1} />
                      <Text>{risk}</Text>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        );
      }
      
      // If all else fails, just display the original content
      return <Text whiteSpace="pre-line">{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</Text>;
    } catch (error) {
      console.error('Error rendering AI message:', error);
      return <Text whiteSpace="pre-line">{typeof content === 'string' ? content : JSON.stringify(content, null, 2)}</Text>;
    }
  };

  // Render user message content
  const renderUserMessageContent = (content) => {
    return <Text fontSize="md">{content}</Text>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" motionPreset="scale">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent bg="transparent" shadow="none" maxW="100vw" maxH="100vh" m={0} p={0}>
        <Flex 
          direction="column" 
          w="100%" 
          h="100vh" 
          bg="gray.900" 
          borderRadius="0"
          overflow="hidden"
        >
          {/* Chat Header */}
          <Flex 
            bg="gray.800" 
            p={4} 
            justifyContent="space-between" 
            alignItems="center"
            borderBottomWidth="1px"
            borderColor="gray.700"
          >
            <HStack spacing={3}>
              <Avatar 
                bg="#3D5A80" 
                icon={<Icon as={GiChessRook} fontSize="xl" />} 
                size="sm" 
              />
              <Heading size="md" color="white">Weekly Recap AI Assistant</Heading>
            </HStack>
            <CloseButton color="white" onClick={onClose} size="lg" />
          </Flex>

          {/* Chat Messages */}
          <VStack 
            flex="1" 
            p={6} 
            spacing={6} 
            overflowY="auto" 
            bg="gray.900"
            align="stretch"
            position="relative"
            maxW="1200px"
            mx="auto"
            w="full"
          >
            {!initialAnalysisDone && (
              <Flex 
                position="absolute" 
                top="0" 
                left="0" 
                right="0" 
                bottom="0" 
                justify="center" 
                align="center" 
                bg="rgba(26, 32, 44, 0.9)" 
                zIndex="1"
              >
                <VStack spacing={6}>
                  <Icon as={GiChessRook} fontSize="6xl" color="#3D5A80" />
                  <Spinner size="xl" thickness="4px" color="#3D5A80" />
                  <Text color="white" fontWeight="medium" fontSize="xl">Analyzing your weekly data...</Text>
                </VStack>
              </Flex>
            )}
            
            {messages.map((message, index) => (
              <Box 
                key={index} 
                alignSelf={message.role === 'user' ? 'flex-end' : 'flex-start'}
                maxWidth={{ base: "90%", md: "80%" }}
                width={message.role === 'assistant' ? "full" : "auto"}
              >
                <Box
                  p={4}
                  bg={message.role === 'user' ? '#3D5A80' : 'gray.700'}
                  color="white"
                  borderRadius="xl"
                  borderBottomRightRadius={message.role === 'user' ? '2px' : 'xl'}
                  borderBottomLeftRadius={message.role === 'assistant' ? '2px' : 'xl'}
                  shadow="md"
                >
                  {message.role === 'assistant' && (
                    <Flex align="center" mb={3}>
                      <Icon as={GiChessRook} mr={2} color="#CBD5E0" />
                      <Text fontWeight="bold" color="#CBD5E0">AI Assistant</Text>
                      <Badge ml={2} colorScheme="blue" variant="solid" fontSize="xs">Weekly Analysis</Badge>
                    </Flex>
                  )}
                  
                  {/* Render message content based on role */}
                  {message.role === 'assistant' 
                    ? renderAIMessageContent(message.content)
                    : renderUserMessageContent(message.content)
                  }
                </Box>
                <Text fontSize="xs" color="gray.500" mt={1} textAlign={message.role === 'user' ? 'right' : 'left'}>
                  {message.timestamp}
                </Text>
              </Box>
            ))}
            
            {/* Thinking indicator */}
            {isThinkerVisible && (
              <Box 
                alignSelf="flex-start"
                maxWidth={{ base: "90%", md: "70%" }}
              >
                <Box
                  p={4}
                  bg="gray.700"
                  color="white"
                  borderRadius="xl"
                  borderBottomLeftRadius="2px"
                  shadow="md"
                >
                  <Flex align="center" mb={2}>
                    <Icon as={GiChessRook} mr={2} color="#CBD5E0" />
                    <Text fontWeight="bold" color="#CBD5E0">AI Assistant</Text>
                  </Flex>
                  <Flex align="center">
                    <Text fontSize="md">Thinking</Text>
                    <Box as="span" ml={2} display="inline-flex" alignItems="center">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                      >
                        .
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
                      >
                        .
                      </motion.span>
                    </Box>
                  </Flex>
                </Box>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>

          {/* Message Input */}
          <Box p={6} bg="gray.800" borderTopWidth="1px" borderColor="gray.700">
            <Flex maxW="1200px" mx="auto" w="full">
              <Input
                placeholder="Ask about your weekly data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                mr={3}
                size="lg"
                bg="gray.700"
                color="white"
                borderColor="gray.600"
                _hover={{ borderColor: 'gray.500' }}
                _focus={{ borderColor: '#3D5A80', boxShadow: '0 0 0 1px #3D5A80' }}
                disabled={isLoading || !initialAnalysisDone}
              />
              <IconButton
                colorScheme="blue"
                aria-label="Send message"
                icon={isLoading ? <Spinner size="sm" /> : <FaArrowUp />}
                onClick={handleSendMessage}
                disabled={isLoading || !initialAnalysisDone || !input.trim()}
                bg="#3D5A80"
                _hover={{ bg: '#2C4A70' }}
                size="lg"
                borderRadius="md"
              />
            </Flex>
          </Box>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default RecapChatbot;