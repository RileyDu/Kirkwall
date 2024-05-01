import {
    Box,
    Button,
    Container,
    Heading,
    Stack,
    Text,
  } from "@chakra-ui/react";
  
  export const Cta = () => (
    <Box
      w="calc(100vw - 10%)" // Adjusting width to account for margins
      ml={["5%", "5%", "10%", "10%"]}
      mr={["5%", "5%", "10%", "10%"]}
      overflow="hidden" // Ensures no spillover if calculations are off
    >
      {/* This sets the outer Box to take the full width of the viewport with responsive margin */}
      <Container maxW="100vw" px="0" py={{ base: "16", md: "24" }}>
        {/* Removes maximum width constraint */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: "12", lg: "16" }}
          w="100%"
        >
          <Stack
            spacing={{ base: "8", md: "10" }}
            width="100%"
            justify="center"
            color="gold"
            p={{ base: "2rem", md: "5rem" }}  // Responsive padding
            bgGradient="linear(to-l, #FFD700, #FFA500)" // Adds a background gradient to make the header stand out
            opacity={'80%'}
          >
            <Heading size={{ base: "lg", md: "xl" }} color="black" textDecoration={'dashed 4px underline'}>Why us?</Heading>
            <Stack spacing={{ base: "4", md: "6" }}>
              <Heading size={{ base: "sm", md: "lg" }} color="black">☓ Reduce downtime</Heading>
              <Heading size={{ base: "sm", md: "lg" }} color="black">☓ Save on repair costs</Heading>
              <Heading size={{ base: "sm", md: "lg" }} color="black">☓ Defend your systems</Heading>
            </Stack>
          </Stack>
          <Box
            as="section"
            w="100%" // Ensure this section also takes full width
            color="gold"
            bgGradient="linear(to-br, #052C42, #034C6A)"
            border="1px solid gold" // Adds a border
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.15)"
            alignContent={'center'}
            marginRight={'10%'}
            
          >
            <Container
              maxW="100%"
              px="4"
              py={{ base: "16", md: "24" }}
             
              
            >
              {/* Adjust Container inside Box to be full width too */}
              <Stack spacing={{ base: "8", md: "10" }} align="center">
                <Heading size={{ base: "sm", md: "lg" }} color="white">
                Focus less on machinary and more on profits!
                </Heading>
                {/* <Text
                  color="fg.muted"
                  textAlign="center"
                  fontSize={{ base: "lg", md: "xl" }} // Responsive font size
                >
                 Focus less on machinary and more on profits!
                </Text> */}
                <Stack
                  spacing="3"
                  direction={{ base: "column", sm: "row" }}
                  justify="center"
                  w="full" // Full width for alignment
                >
                  {/* <Button
                    mt={5}
                    fontSize={"lg"} // Standardized button font size
                    height={"3rem"}
                    size="lg"
                    bg="goldenrod"
                    type="submit"
                    color="#052C42"
                    width={{ base: "100%", sm: "60%" }} // Responsive button width
                  >
                    Click here to learn more
                  </Button> */}
                </Stack>
              </Stack>
            </Container>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
  
  export default Cta;
  