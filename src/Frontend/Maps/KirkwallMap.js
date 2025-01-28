import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
  Marker,
} from '@vis.gl/react-google-maps';
import { Heading, Box, useMediaQuery, useColorMode } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const center = {
  lat: 46.877186,
  lng: -96.789803,
};

const locations = [
  {
    lat: 46.832556,
    lng: -97.263596,
    info: 'Grand Farm',
    details: 'Temp, Humidity, Rainfall & Wind',
    dataReading: 'Sends data every 5 minutes',
  },
  {
    lat: 46.90434,
    lng: -96.8105,
    info: 'Incubator (Garage)',
    details: 'Temp, Humidity & Water Detection',
    dataReading: 'Sends data every 10 minutes',
  },
  {
    lat: 46.87762,
    lng: -96.78811,
    info: 'Freezer',
    details: 'Temp & Humidity',
    dataReading: 'Sends data every 10 minutes',
  },
];

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapID = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

const MapComponent = ({ statusOfAlerts }) => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  const { colorMode } = useColorMode();

  const mapContainerStyles = {
    width: isMobile ? '90%' : '60%',
    height: isMobile ? '600px' : '800px',
    margin: '0 auto',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    border: '3px solid #00BCD4',
  };

  const mapOptions = {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
    mapTypeId: 'terrain', // Always show the satellite view
    disableDefaultUI: true, // Disable all default UI controls
    scrollwheel: false, // Disable zooming with the mouse wheelc
    zoomControl: true, // Enable the zoom control
    mapTypeControl: false, // Disable the map type control
    streetViewControl: false, // Disable the Street View control
    fullscreenControl: false, // Disable the fullscreen control
    gestureHandling: 'greedy', // Allow gestures on the map
  };

  return (
    <APIProvider apiKey={apiKey}>
      <Box
        width="100%"
        textAlign="center"
        p={'4'}
        pt={statusOfAlerts ? '10px' : '74px'}
        color={colorMode === 'light' ? 'black' : 'white'}
      >
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="xl" pb={'4'}>
            Sensor Map
          </Heading>
        </motion.div>
      </Box>
      <motion.div
        className="map-container"
        style={mapContainerStyles}
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Map
          defaultCenter={center}
          defaultZoom={10}
          mapId={mapID}
          options={mapOptions} // Pass the options prop
        >
          {locations.map((location, index) => (
            <AdvancedMarker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setOpenInfoIndex(index)}
            >
              <Pin
                background={'#cee8ff'}
                borderColor={'#212121'}
                glyphColor={'#212121'}
              />
              {openInfoIndex === index && (
                <InfoWindow
                  position={{ lat: location.lat, lng: location.lng }}
                  onCloseClick={() => setOpenInfoIndex(null)}
                  background={'#fd9801'}
                  pixelOffset={[0, -30]}
                  headerContent={
                    <div
                      style={{
                        color: '#212121',
                        fontWeight: 'bold',
                        fontSize: '20px',
                      }}
                    >
                      {location.info}
                    </div>
                  }
                >
                  <div style={{ color: '#212121', fontSize: '14px' }}>
                    <em>Sensors:</em> {location.details}
                  </div>
                  <div style={{ color: '#212121', fontSize: '14px' }}>
                    <em>Data:</em> {location.dataReading}
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      </motion.div>
    </APIProvider>
  );
};

export default MapComponent;
