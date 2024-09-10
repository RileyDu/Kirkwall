import React, { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Center,
  useBreakpointValue,
  FormErrorMessage,
  Image,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// error messages for Firebase Auth
const errorMessages = {
  'auth/invalid-email': 'The email address is not valid.',
  'auth/user-disabled': 'The user account has been disabled.',
  'auth/user-not-found': 'No user found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'This email is already in use.',
  'auth/weak-password': 'The password is too weak.',
  'auth/invalid-password': 'The password is invalid.',
  'auth/invalid-credential': 'Your password or email is invalid.',
};

const MotionText = motion(Text);

// Login component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const showMobileLogo = useBreakpointValue({ base: true, md: false });
  const logoSrc = useBreakpointValue({
    base: '/images/kirkwall_logo_1_white.png',
    md: '/images/kirkwall_logo_1_white.png',
  });

  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleLogin = async event => {
    event.preventDefault();
    setIsLoading(true);
    let hasError = false;

    if (!email) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Email is not valid.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    const auth = getAuth();

    // Sign in with email and password
    // Redirect to the appropriate dashboard based on the user's email
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in successfully');
        navigate('/');
    } catch (error) {
      const errorCode = error.code;
      const errorMessage =
        errorMessages[errorCode] ||
        'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Let user press enter to log in after entering email and password
  useEffect(() => {
    const handleEnterPress = event => {
      if (event.key === 'Enter') {
        handleLogin(event);
      }
    };
    window.addEventListener('keydown', handleEnterPress);
    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, [email, password]);

  return (
    <Flex
      minH="100vh"
      bg="#1A202C"
      color="white"
      direction="column"
      justify="center"
      align="center"
    >
      <Container
        maxW="md"
        py={{ base: '12', md: '24' }}
        px={{ base: '4', sm: '8' }}
        borderRadius="xl"
        boxShadow="2xl"
        bg="#2D3748"
      >
        <Stack spacing="8">
          <Box textAlign="center">
            <Image
              src={logoSrc}
              alt="Kirkwall logo"
              boxSize="200px"
              mx="auto"
              mb="4"
              objectFit="contain"
            />
            <Heading size="lg" color="white">
              Login
            </Heading>
            <Text color="gray.400">Please sign in to continue.</Text>
          </Box>
          <form onSubmit={handleLogin}>
            <Stack spacing="4">
              <FormControl isInvalid={emailError}>
                <FormLabel htmlFor="email" color="gray.400">
                  Email
                </FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  bg="#2D3748"
                  border="2px solid"
                  borderColor="#cee8ff"
                  _hover={{ borderColor: '#cee8ff' }}
                  _focus={{
                    borderColor: '#cee8ff',
                    bg: 'white',
                    color: 'black',
                  }}
                  focusBorderColor="#cee8ff"
                  color="white"
                />
                <FormErrorMessage>{emailError}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={passwordError}>
                <FormLabel htmlFor="password" color="gray.400">
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  bg="#2D3748"
                  border="2px solid"
                  borderColor="#cee8ff"
                  _hover={{ borderColor: '#cee8ff' }}
                  _focus={{
                    borderColor: '#cee8ff',
                    bg: 'white',
                    color: 'black',
                  }}
                  focusBorderColor="#cee8ff"
                  color="white"
                />
                <FormErrorMessage>{passwordError}</FormErrorMessage>
              </FormControl>
              {error && (
                <MotionText
                  color="red.500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {error}
                </MotionText>
              )}
              <Button
                type="submit"
                size="lg"
                fontSize="md"
                borderRadius="full"
                bg="#cee8ff"
                color="black"
                isLoading={isLoading}
                loadingText="Logging in"
              >
                Login
              </Button>
              {/* <Link color="#F4B860" textAlign="center">Forgot Password?</Link> */}
            </Stack>
          </form>
          {/* <Divider my="4" /> */}
          {/* <Text color="gray.400" textAlign="center">
            Don't have an account? <Link color="#F4B860">Sign up</Link>
          </Text> */}
          {/* <Divider my="4" /> */}
          <Text color="gray.400" textAlign="center">
            <Link color="white" href='https://www.kirkwall.io' textDecoration={'underline'}>
              Back to Home
            </Link>
          </Text>
        </Stack>
      </Container>
      <Center py={4}>
        <Text color="gray.600">&copy; 2024 Kirkwall. All rights reserved.</Text>
      </Center>
    </Flex>
  );
};

export default Login;
