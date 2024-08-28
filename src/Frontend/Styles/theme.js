import { color, extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  colors: {
    brand: {
      50: "#fef4e5",
      100: "#feeaec",
      200: "#fee0b2",
      300: "#fed599",
      400: "#fdcb80",
      500: "#fdc166",
      600: "#fdb64d",
      700: "#fdac33",
      800: "#fda21a",
      900: "#fd9801",
      950: "#e38800",
      1000: "#ca7900",
      1100: "#b16a00",
      1200: "#975b00",
      1300: "#7e4c00",
      1400: "#653c00",
      1500: "#4b2d00",
      1600: "#321e00",
      1700: "#190f00",
      1800: "#000000",
    },
  },
  fonts: {
    heading: 'Oswald, sans-serif',
    body: 'Oswald, sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'light' ? '#FFFFFF' : 'gray.700',
        color: props.colorMode === 'light' ? 'gray.800' : 'white',
      },
      a: {
        color: props.colorMode === 'light' ? 'brand.900' : 'brand.50',
        _hover: {
          textDecoration: 'underline',
        },
      },
    }),
  },
  components: {
    Button: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'light' ? 'brand.400' : 'brand.700',
        color: '#212121',
        _hover: {
          bg: props.colorMode === 'light' ? 'brand.600' : 'brand.800',
        },
      }),
      variants: {
        pill: {
          borderRadius: 'full',
          border: '3px solid #3D5A80',
          _hover: {
            bg: '#3D5A80',
            color: 'white',
          },
          _active: {
            bg: '#3D5A80',
            color: 'white',
          },
        },
        sidebar: {
          borderRadius: 'full',
          border: '3px solid #FD9801',
          color: '#212121',
          _hover: {
            bg: 'brand.800',
          },
          _active: {
            bg: 'brand.500',
            color: '#212121',
          },
        },
        blue: {
          borderRadius: 'full',
          border: '3px solid #3D5A80',
          color: '#212121',
          bg: '#cee8ff',
          _hover: {
            bg: '#3D5A80',
            color: 'white',
          },
          _active: {
            bg: 'brand.500',
            color: '#212121',
          },
        },
      },
    },
    Heading: {
      baseStyle: (props) => ({
        color: props.colorMode === 'light' ? '#212121' : 'white',
      }),
    },
    Box: {
      baseStyle: (props) => ({
        color: props.colorMode === 'light' ? '#212121' : 'white',
      }),
    },
    Divider: {
      baseStyle: (props) => ({
        borderColor: props.colorMode === 'light' ? '#212121' : 'white',
      }),
    },
    Modal: {
      baseStyle: (props) => ({
        dialog: {
          bg: props.colorMode === 'light' ? 'brand.50' : 'gray.800',
          color: props.colorMode === 'light' ? 'gray.800' : 'white',
        },
      }),
    },
    Input: {
      baseStyle: (props) => ({
        field: {
          bg: 'white',
          border: '2px solid #fd9801',
          _hover: {
            borderColor: '#fd9801',
          },
          _focus: {
            borderColor: '#fd9801',
            boxShadow: '0 0 0 1px #fd9801',
          },
        },
      }),
    },
  },
});

export default customTheme;