// src/components/Logout.js
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@chakra-ui/react';

const Logout = () => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <Button onClick={handleLogout} size={'lg'} w="100%" fontSize="x-large">LOGOUT</Button>
  );
};

export default Logout;
