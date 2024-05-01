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
  useToast
} from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";
import * as Logos from "./Brands";
import platform from '../../Assets/Images/platform.png'
import emailjs from "emailjs-com";
import React, { useRef, useState, props } from "react";

const Hero = () => {
  const form = useRef();
  const toast = useToast();
  // CODE TO SEND EMAIL
  const sendEmail = (e) => {
    e.preventDefault();

    // Replace 'your_service_id', 'your_template_id', and 'your_user_id' with your actual EmailJS details
    emailjs
      .sendForm(
        "service_dakyqbe",
        "template_bhvy1tq",
        e.target,
        "14bYaszt4CBGDyU3u"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast({
            title: "Email sent successfully",
            description:
              "We have received your message and will get back to you shortly!",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          setInput(""); // Clear the input after sending the email
        },
        (error) => {
          console.log(error.text);
          toast({
            title: "Email sending failed",
            description:
              "There was an error sending your email, please try again.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      );
  };

  // Form Erroring
  const [input, setInput] = useState("");
  const handleInputChange = (e) => setInput(e.target.value);
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

          <Stack
            justify="center"
            direction={{ base: "column", md: "row", xl: "column" }}
            mt="10"
            mb="20"
            spacing="4"
          >
            <LightMode>
         
              <FormControl
                onSubmit={sendEmail}
                isRequired
                marginTop={"2rem"}
                color={"goldenrod"}
                as="form"
              >
                <FormLabel fontSize={{ base: "25px", sm: "20px", xl: "20px" }}>
                  Email
                </FormLabel>
                <Input
                    for="user_email"
                  marginRight={"2rem"}
                  background={"white"}
                  type="email"
                    value={input}
                    onChange={handleInputChange}
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
