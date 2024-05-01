import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
  Image,
  Flex
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import Logo from "../../Assets/Images/Logo.svg";

const Footer = () => (
  <Flex
    borderBottomWidth="1px"
    bg="#052C42"
    position="relative"
    zIndex="tooltip"
    h="20rem"
    align="center"
    justify="center" // Changed from 'space-evenly' to 'center' for better control
    padding={3}
    color="gold"
  >
    <Container as="footer" role="contentinfo" py={{ base: "12", md: "16" }} >
      <Stack spacing={{ base: "4", md: "5" }}>
        <Stack justify="space-between" direction="row" align="center">
          <Image boxSize="10rem" src={Logo} alt="kirkwall logo" />
          <ButtonGroup variant="tertiary.accent">
            <IconButton
              as="a"
              href="#"
              aria-label="LinkedIn"
              icon={<FaLinkedin />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="GitHub"
              icon={<FaGithub />}
            />
            <IconButton
              as="a"
              href="#"
              aria-label="Twitter"
              icon={<FaTwitter />}
            />
          </ButtonGroup>
        </Stack>
        <Text fontSize="sm" color="fg.accent.subtle">
          &copy; {new Date().getFullYear()} Chakra UI Pro, Inc. All rights
          reserved.
        </Text>
      </Stack>
    </Container>
  </Flex>
);
export default Footer;
