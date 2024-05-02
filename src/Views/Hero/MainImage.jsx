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
  
  const MainImage = () => {
    return (
      <Box>
        <Box
          as="section"
          
          color="white"
          py="2.5rem"
        >
          <Box
            maxW={{ base: "xl", md: "8xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
          >
  
                 
            <Box
              cursor="pointer"
              position="relative"
              rounded="lg"
              overflow="hidden"
            >
              <Img
                alt="Screenshot of Envelope App"
                src={platform}
              />
              {/* <Circle
                size="20"
                as="button"
                bg="white"
                shadow="lg"
                color="teal.600"
                position="absolute"
                top="50%"
                left="50%"
                transform="translate3d(-50%, -50%, 0)"
                fontSize="xl"
                transition="all 0.2s"
                _groupHover={{
                  transform: "translate3d(-50%, -50%, 0) scale(1.05)",
                }}
              >
                <VisuallyHidden>Play demo video</VisuallyHidden>
                <FaPlay />
              </Circle> */}
            </Box>
          </Box>
        </Box>
  
        <Box as="section" py="24" bg={'whitesmoke'}>
          <Box
            maxW={{ base: "xl", md: "7xl" }}
            mx="auto"
            px={{ base: "6", md: "8" }}
          >
            <Text
              fontWeight="bold"
              fontSize="sm"
              textAlign="center"
              textTransform="uppercase"
              letterSpacing="wide"
              color="gray.600" // Assuming light mode by default
            >
              Partnered with multiple universitys and Companies
            </Text>
            <SimpleGrid
              mt="8"
              columns={{ base: 1, md: 3, lg: 3 }}
              color="gray.500"
              alignItems="center"
              justifyItems="center"
              spacing={{ base: "12", lg: "24" }}
              fontSize="2xl"
            >
              <Text> NDSU</Text>
              <Text> UND</Text>
              <Text> Devii</Text>
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    );
  };
  export default MainImage;
  