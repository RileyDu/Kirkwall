import { border, extendTheme } from '@chakra-ui/react';


const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#fef4e5", // Lightest tint
      100: "#feeaec", 
      200: "#fee0b2",
      300: "#fed599",
      400: "#fdcb80",
      500: "#fdc166", // Default brand color
      600: "#fdb64d",
      700: "#fdac33",
      800: "#fda21a",
      900: "#fd9801", // Darkest tint
      950: "#e38800", 
      1000: "#ca7900",
      1100: "#b16a00",
      1200: "#975b00",
      1300: "#7e4c00",
      1400: "#653c00",
      1500: "#4b2d00",
      1600: "#321e00",
      1700: "#190f00",
      1800: "#000000", // Black
    },
  },
    fonts: {
      heading: 'Oswald, sans-serif',
      body: 'Oswald, sans-serif',
    },
    components: {
      Button: {
        variants: {
        pill: {
          borderRadius: 'full',
          border: '2px solid #fd9801',
          _hover: {
            bg: 'brand.500',
            color: 'white',
          },
          _active: {
            bg: 'brand.500',
            color: 'white',
          },
        },

      },
    },
    },
  });
  export default customTheme