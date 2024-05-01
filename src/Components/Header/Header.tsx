import {
  Box,
  Button,
  ButtonGroup,
  Container,
  HStack,
  useBreakpointValue,
  useDisclosure,
  Image,
  Flex,
} from "@chakra-ui/react";
import Logo from "../../Assets/Images/Logo.svg";
import { MobileDrawer } from "./MobileNavbar";
import { ToggleButton } from "./ToggleButton";

const Header = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const mobileNavbar = useDisclosure();
  return (
    <Box as="section" minH="50px">
  <Flex
    borderBottomWidth="1px"
    bg="#052C42"
    position="relative"
    zIndex="tooltip"
    h="6rem"
    align="center"
    justify="center" // Changed from 'space-evenly' to 'center' for better control
    padding={3}
    color="gold"
  >
    <Container maxW="container.xl" py="4"> {/* Adjusted max width for better distribution */}
      <HStack justify="center" width="full"> {/* Ensuring the HStack uses the full width */}
        <Image src={Logo} alt="Kirkwall Logo" boxSize="15rem" /> {/* Optional: Adjust size as needed */}
        {isDesktop ? (
          <HStack spacing="24" align="center"> {/* Increased spacing */}
            <ButtonGroup
              size="lg"
              variant="text"
              colorScheme="gray"
              spacing="3"
            >
              {["Components", "Support"].map(
                (item) => (
                  <Button key={item}>{item}</Button>
                )
              )}
            </ButtonGroup>
            <Button bg={'goldenrod'} color={"black"}>Contact us</Button>
          </HStack>
        ) : (
          <>
            <ToggleButton
              onClick={mobileNavbar.onToggle}
              isOpen={mobileNavbar.isOpen}
              aria-label="Open Menu"
            />
            <MobileDrawer
              isOpen={mobileNavbar.isOpen}
              onClose={mobileNavbar.onClose}
            />
          </>
        )}
      </HStack>
    </Container>
  </Flex>
</Box>

  );
};
export default Header;
