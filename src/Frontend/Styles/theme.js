import { extendTheme } from '@chakra-ui/react';


const customTheme = extendTheme({
    colors: {
      navy: '#001f3f',
      black: '#000000',
      green: '#00a300',
      white: '#ffffff',
    },
    fonts: {
      heading: 'Oswald, sans-serif',
      body: 'Oswald, sans-serif',
    },
  });
  export default customTheme