import {
  Box,
  Button,
  Circle,
  Heading,
  Img,
  LightMode,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  useColorModeValue as mode,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  Container,
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import * as Logos from "./Brands";
import platform from '../../Assets/Images/platform.png'

const Hero = () => {
  return (
    <Box>
      <Box
        as="section"
        color="white"
        py="6.5rem"
      >
        <Box
          maxW={{ base: "xl", md: "5xl" }}
          mx="auto"
          px={{ base: "6", md: "8" }}
        >
          <Box textAlign="center">
            <Heading
              as="h1"
              size="3xl"
              fontWeight="extrabold"
              maxW="48rem"
              mx="auto"
              lineHeight="1.2"
              letterSpacing="tight"
            >
              ❝ Keeping robots on their best behavior ❞
            </Heading>
            <Text fontSize="xl" mt="4" maxW="xl" mx="auto">
              We utilize state-of-the-art diagnostic tools to ensure you are
              well-informed and your equipment is meticulously maintained.
              Prevent downtime with our expert services
            </Text>
          </Box>

          {/* <Box as="section"  bgGradient="linear(to-br, #052C42, #034C6A)" color="fg.accent.default">
            <Container py={{ base: "16", md: "24" }}>
              <Stack spacing={{ base: "8", md: "10" }}>
                <Stack spacing={{ base: "4", md: "5" }} align="center">
                  <Heading size={{ base: "sm", md: "md" }}>
                    Ready to Grow?
                  </Heading>
                  <Text
                    color="on-accent-muteed"
                    maxW="2xl"
                    textAlign="center"
                    fontSize="xl"
                  >
                    With this beautiful and responsive React components you will
                    realize your next project in no time.
                  </Text>
                </Stack>
                <Stack
                  spacing="3"
                  direction={{ base: "column", sm: "row" }}
                  justify="center"
                >
                  <Button
                    mt={5}
                    fontSize={"20px"}
                    height={"3rem"}
                    size={"lg"}
                    bg={"goldenrod"}
                    type="submit"
                    color={"#052C42"}
                    width={"50%"}
                  >
                    Learn more
                  </Button>
                  <Button
                    mt={5}
                    fontSize={"20px"}
                    height={"3rem"}
                    size={"lg"}
                    bg={"goldenrod"}
                    type="submit"
                    color={"#052C42"}
                    width={"50%"}
                  >
                    Start Free Trial
                  </Button>
                </Stack>
              </Stack>
            </Container>
          </Box> */}

          <Stack
            justify="center"
            direction={{ base: "column", md: "row", xl: "column" }}
            mt="10"
            mb="20"
            spacing="4"
          >
            <LightMode>
              {/* <Button
                size="lg"
                colorScheme="teal"
                px="8"
                fontWeight="bold"
                fontSize="md"
              >
                Get started free
              </Button> */}
              <FormControl
                // onSubmit={sendEmail}
                isRequired
                marginTop={"2rem"}
                color={"goldenrod"}
                as="form"
              >
                <FormLabel fontSize={{ base: "25px", sm: "20px", xl: "20px" }}>
                  Email
                </FormLabel>
                <Input
                  //   for="user_email"
                  marginRight={"2rem"}
                  background={"white"}
                  type="email"
                  //   value={input}
                  //   onChange={handleInputChange}
                  name="user_email"
                  height={"3rem"}
                  placeholder="Email"
                />

                <FormHelperText fontSize={"20px"} color={"goldenrod"}>
                  We'll never share your email.
                </FormHelperText>
                <Button
                  mt={5}
                  fontSize={"25px"}
                  height={"3rem"}
                  size={"lg"}
                  bg={"goldenrod"}
                  type="submit"
                  color={"#052C42"}
                  width={"100%"}
                >
                  Learn more
                </Button>
              </FormControl>
            </LightMode>
          </Stack>

        </Box>
      </Box>

    </Box>
  );
};
export default Hero;
