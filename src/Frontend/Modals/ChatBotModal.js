// frontend/src/components/ChatBotModal.jsx

import React from 'react';
import ChatGPTComponent from '../AI/ChatGPTComponent.js';

const ChatBotModal = ({ isOpen, onClose }) => {
  return (
    <>
      <ChatGPTComponent isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ChatBotModal;
