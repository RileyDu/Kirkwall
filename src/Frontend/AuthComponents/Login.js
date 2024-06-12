import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const errorMessages = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "The user account has been disabled.",
  "auth/user-not-found": "No user found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "This email is already in use.",
  "auth/weak-password": "The password is too weak.",
  "auth/invalid-password": "The password is invalid.",
  "auth/invalid-credential": "Your password or email is invalid.",
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both the email and password fields.");
      return;
    }

    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
      navigate('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = errorMessages[errorCode] || "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Box
      h="100vh"
      w="100%"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: '/slide-wheat.jpg',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(10px)',
        zIndex: -1,
      }}
    >
      <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
              <Heading size={{ base: 'sm', md: 'md' }}>Log in to your account</Heading>
            </Stack>
          </Stack>
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={{ base: 'secondary.100', sm: 'white' }}
            borderRadius="lg"
            boxShadow="lg"
            zIndex={1}
            position="relative"
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
              </Stack>
              {error && <Text color="red.500">{error}</Text>}
              <Stack spacing="6">
                <Button
                  onClick={handleLogin}
                  color='#fd9801'
                  isDisabled={!email || !password}
                >
                  Sign In
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Login;
