// src/components/SignUp.js

import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
  Image,
  Link,
  Center,
  FormErrorMessage,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Optional: reuse the same error messages from your login or add more as needed
const errorMessages = {
  'auth/invalid-email': 'The email address is not valid.',
  'auth/email-already-in-use': 'This email is already in use.',
  'auth/weak-password': 'The password is too weak.',
  'auth/invalid-password': 'The password is invalid.',
  'auth/invalid-credential': 'Your password or email is invalid.',
};

const MotionText = motion(Text);

const SignUp = () => {
  // State for form fields and errors
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const logoSrc = useBreakpointValue({
    base: '/kirkwall_logo_1_white.png',
    md: '/kirkwall_logo_1_white.png',
  });

  // Simple email validation check
  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleSignUp = async event => {
    event.preventDefault();
    setIsLoading(true);
    let hasError = false;

    // Validate email
    if (!email) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Email is not valid.');
      hasError = true;
    } else {
      setEmailError('');
    }

    // Validate password
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

    // Create user with email and password
    const auth = getAuth();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully');
      navigate('/dashboard'); // or wherever you want to navigate after signup
    } catch (error) {
      const errorCode = error.code;
      const errorMessage =
        errorMessages[errorCode] ||
        'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Let the user press "Enter" to submit the signup form
  useEffect(() => {
    const handleEnterPress = event => {
      if (event.key === 'Enter') {
        handleSignUp(event);
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
          {/* Logo and Title */}
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
              Sign Up
            </Heading>
            <Text color="gray.400">Create your account to get started.</Text>
          </Box>

          {/* Form */}
          <form onSubmit={handleSignUp}>
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

              {/* Display SignUp Error */}
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
                loadingText="Signing up"
              >
                Sign Up
              </Button>
            </Stack>
          </form>

          <Text color="gray.400" textAlign="center">
            Already have an account?{' '}
            <Link color="#cee8ff" href="/">
              Login
            </Link>
          </Text>

          <Text color="gray.400" textAlign="center">
            <Link
              color="white"
              href="https://www.kirkwall.io"
              textDecoration="underline"
            >
              Back to Home
            </Link>
          </Text>
        </Stack>
      </Container>
      <Center py={4}>
        <Text color="gray.600">&copy; 2024 Kirkwall. All rights reserved.</Text>
      </Center>
      <Text
        color="gray.600"
        textDecor={'underline'}
        onClick={() => navigate('/privacypolicy')}
        cursor={'pointer'}
      >
        Privacy Policy
      </Text>
    </Flex>
  );
};

export default SignUp;
