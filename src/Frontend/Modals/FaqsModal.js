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
} from '@chakra-ui/react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa/index.esm.js';

const FaqsModal = ({ isOpen, onClose }) => {
  const [expandedFaqs, setExpandedFaqs] = useState({});

  const faqs = [
    { question: 'Question 1', answer: 'Answer 1' },
    { question: 'Question 2', answer: 'Answer 2' },
    { question: 'Question 3', answer: 'Answer 3' },
    // Add more FAQs here
  ];

  const toggleFaq = (index) => {
    setExpandedFaqs((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
      <ModalHeader align="center" bg="gray.700" mb="10px" color="white">
          FAQs
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Box>
            {faqs.map((faq, index) => (
              <Box key={index} mb={4}>
                <Flex justify="space-between" align="center" cursor="pointer" onClick={() => toggleFaq(index)}>
                  <Heading size="md">{faq.question}</Heading>
                  <IconButton
                    icon={expandedFaqs[index] ? <FaChevronUp /> : <FaChevronDown />}
                    size="sm"
                    variant="ghost"
                    aria-label="Expand/Collapse FAQ"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFaq(index);
                    }}
                  />
                </Flex>
                {expandedFaqs[index] && (
                  <Text mt={2} pl={4}>
                    {faq.answer}
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
