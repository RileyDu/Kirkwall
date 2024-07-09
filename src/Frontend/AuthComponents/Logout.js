import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
  const location = useLocation();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      navigate('/login');
      if (onLogout) onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!user || location.pathname === '/login') return null;

  return (
    <Button onClick={handleLogout} size={'lg'} w="100%" fontSize="x-large" borderRadius={'full'} variant={'sidebar'}>
      LOGOUT
    </Button>
  );
};

export default Logout;
