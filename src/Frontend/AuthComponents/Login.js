import React, { useState } from 'react';
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
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const showMobileLogo = useBreakpointValue({ base: true, md: false });
  const logoSrc = useBreakpointValue({
    base: '/kirkwall_logo_1_white.png', // Mobile logo
    md: '/kirkwall_logo_1_white.png', // Desktop logo
  });

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both the email and password fields.');
      return;
    }

    const auth = getAuth();
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
    }
  };

  return (
    <Flex minH={{ base: 'auto', md: '100vh' }} bg="#212121">
      <Flex mx="auto" width="full">
        <Box flex="1" display={{ base: 'none', md: 'block' }}>
          <Flex
            direction="column"
            px={{ base: '4', md: '8' }}
            height="full"
            color="fg.accent.default"
          >
            <Flex flex="1" align="center">
              <Stack spacing="8">
                <Stack spacing="6">
                  <Flex align="center">
                    <Box
                      border={'2px'}
                      borderColor={'#fd9801'}
                      borderRadius={'md'}
                      p={2}
                      bg={'black'}
                      mt={16}
                    >
                      <img
                        src={logoSrc}
                        alt="kirkwall logo"
                        style={{ width: '450px', height: 'auto' }}
                      />
                    </Box>
                  </Flex>
                  <Heading size={{ md: 'lg', xl: 'xl' }} color={'white'}>
                  {/* <Divider borderColor={'#fd9801'} color={'#fd9801'} mt={2} mb={4} borderWidth={2} borderRadius={'full'} /> */}
                    Securing the Sky | Defending the Prairie
                  </Heading>
                  <Text
                    fontSize="2xl"
                    maxW="md"
                    fontWeight="light"
                    color="white"
                    width={'600px'}
                  >
                    Log in to access comprehensive monitoring of your sensors,
                    receive real-time updates, and be promptly alerted to any
                    and every detected issue.
                  </Text>
                </Stack>
              </Stack>
            </Flex>
            <Flex align="center" h="24">
              <Text color="white" textStyle="sm">
                © 2024 Kirkwall. All rights reserved
              </Text>
            </Flex>
          </Flex>
        </Box>
        <Center flex="1" bg={'white'}>
          <Container
            maxW="lg"
            py={{ base: '12', md: '48' }}
            px={{ base: '4', sm: '8' }}
          >
            <Stack spacing="8">
              {showMobileLogo && (
                <Center flexDirection="column" textAlign="center">
                  <Box
                    border={'2px'}
                    borderColor={'#fd9801'}
                    borderRadius={'md'}
                    p={2}
                    bg={'black'}
                  >
                  <img
                    src={logoSrc}
                    alt="kirkwall logo"
                    style={{ width: '250px', height: 'auto' }}
                  />
                  </Box>
                  <Divider borderColor={'#fd9801'} width={'300px'} mt={4} borderWidth={2} borderRadius={'full'}/>
                  <Heading size={{ base: 'md', md: 'md' }} color={'black'} my={4}>
                    Securing the Sky | Defending the Prairie
                  </Heading>
                </Center>
              )}
              <Stack spacing="6">
                <Stack spacing={{ base: '1', md: '2' }} textAlign="center">
                  <Heading size={{ base: 'lg', md: 'lg' }} mt={'-20px'}>
                    Log in to your account
                  </Heading>
                </Stack>
              </Stack>
              <Box
                py={{ base: '4', sm: '8' }}
                px={{ base: '4', sm: '10' }}
                m={'2'}
                bg="#212121"
                borderRadius="lg"
                boxShadow="lg"
                zIndex={1}
                position="relative"
                border={'2px solid #fd9801'}
              >
                <Stack spacing="6">
                  <Stack spacing="5">
                    <FormControl>
                      <FormLabel htmlFor="email" color={'white'}>
                        Email
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        bg={'white'}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor="password" color={'white'}>
                        Password
                      </FormLabel>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        bg={'white'}
                      />
                    </FormControl>
                  </Stack>
                  {error && <Text color="red.500">{error}</Text>}
                  <Stack spacing="6">
                    <Button
                      onClick={handleLogin}
                      color="#fd9801"
                      isDisabled={!email || !password}
                    >
                      Sign In
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
        </Center>
      </Flex>
    </Flex>
  );
};

export default Login;
