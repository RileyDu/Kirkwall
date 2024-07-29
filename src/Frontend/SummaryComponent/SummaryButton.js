import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Button
} from '@chakra-ui/react';
import { useWeatherData } from '../WeatherDataContext.js';
import { useAuth } from '../AuthComponents/AuthContext.js';
import SummaryModal from '../Modals/SummaryModal.js';

const SummaryButton = ({ isSummaryOpen, onSummaryToggle, summaryMetrics }) => {
  const {
    loading,
    error,
  } = useWeatherData();

  const { currentUser } = useAuth();

  const motionProps = {
    initial: { opacity: 0, x: '-100%' },
    animate: { opacity: 1, x: 0 },
    transition: { type: 'spring', stiffness: 50, damping: 10 },
  };


  return (
    <>
      <motion.div {...motionProps}>
        <Button
          onClick={onSummaryToggle}
          size={{ base: 'xs', md: 'md' }}
          px={{ base: 4, md: 6 }}
          mr="4"
          variant="sidebar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          bg="#F4B860"
          color="black"
        >
          Summary
        </Button>
      </motion.div>

      <SummaryModal isSummaryOpen={isSummaryOpen} onSummaryToggle={onSummaryToggle} summaryMetrics={summaryMetrics} loading={loading} error={error} />
    </>
  );
};

export default SummaryButton;
