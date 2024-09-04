import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Heading,
  Text,
  Flex,
  IconButton,
  useColorMode,
  Divider,
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FaqsModal = ({ isOpen, onClose }) => {
  const [expandedFaqs, setExpandedFaqs] = useState({});
  const { colorMode } = useColorMode();

  const faqs = [
    {
      question: 'What should I do if I get a threshold alert?',
      answer:
        'Assess the data and act appropriately, after action has been taken, you can choose to pause alerts until the data is back to normal.',
    },
    {
      question: 'How do I onboard more sensors into my dashboard?',
      answer: 'Please contact us at ujjwal@kirkwall.io to onboard new sensors.',
    },
    // { question: 'My data stream is not showing up or is inconsistent, why?', answer: 'Answer 3' },
    {
      question: 'If I come across a bug what should I do?',
      answer:
        'Please submit an entry into the contact form found at the bottom left of the dashboard and we will get back to you in a timely manner.',
    },
  ];

  const toggleFaq = index => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        sx={{
          border: '2px solid black',
          bg: colorMode === 'light' ? 'whitesmoke' : 'gray.700',
        }}
        maxW={['90vw', '600px']}  // Responsive array for max width
      >
        <ModalHeader bg="gray.800" color="white">
          FAQs
        </ModalHeader>
        <ModalCloseButton color="white" size="lg" mt={1} />
        <ModalBody>
          <Box>
            {faqs.map((faq, index) => (
              <Box key={index} mb={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  cursor="pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <Heading size="md">{faq.question}</Heading>
                  <IconButton
                    icon={
                      expandedFaqs[index] ? <FaChevronUp /> : <FaChevronDown />
                    }
                    size="sm"
                    variant="blue"
                    aria-label="Expand/Collapse FAQ"
                    onClick={e => {
                      e.stopPropagation();
                      toggleFaq(index);
                    }}
                  />
                </Flex>
                {expandedFaqs[index] && (
                  <Text mt={2} pl={4} fontSize={'lg'}>
                    {faq.answer}
                    <Divider mt={1} />
                  </Text>
                )}
              </Box>
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FaqsModal;
