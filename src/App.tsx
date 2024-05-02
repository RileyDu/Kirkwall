// import libaries
import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
// import files
import Header from "./Components/Header/Header";
import Hero from "./Views/Hero/Hero";
import Footer from "./Components/Footer/Footer";
import MainImage from "./Views/Hero/MainImage";
import Cta from './Views/Hero/Cta'
import Team from './Views/Team/Team'
import "./App.css";

export const App = () => (
  <ChakraProvider theme={theme}>
    <div className="background" >
      <Header />
      <Hero />
      <MainImage />
      <Cta />
      <Team />
      <Footer />
    </div>
  </ChakraProvider>
);
