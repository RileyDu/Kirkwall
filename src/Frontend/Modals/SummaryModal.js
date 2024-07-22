import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    Flex,
    Text,
  } from '@chakra-ui/react';


const SummaryModal = (props) => {
  return (
    <Modal isOpen={props.isSummaryOpen} onClose={props.onSummaryToggle}>
        <ModalOverlay />
        <ModalContent
          sx={{
            border: '2px solid black',
            bg: '#2D3748',
          }}
        >
          <ModalHeader bg={'#212121'} color={'white'}>
            Weather Summary
          </ModalHeader>
          <ModalCloseButton color={'white'} size={'lg'} mt={1} />
          <ModalBody>
            {props.loading ? (
              <Flex justify="center" align="center" height="100%">
                <Text>Loading...</Text>
              </Flex>
            ) : props.error ? (
              <Text color="red.500">{props.error}</Text>
            ) : (
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {props.summaryMetrics.map((metric, index) => (
                  <GridItem key={index}>
                    <Stat>
                      <StatLabel color="white" textDecoration={'underline'}>{metric.label}</StatLabel>
                      <StatNumber color="white">{metric.value}</StatNumber>
                    </Stat>
                  </GridItem>
                ))}
              </Grid>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
  )
}

export default SummaryModal


