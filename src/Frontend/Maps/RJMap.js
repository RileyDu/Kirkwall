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

const center = {
    lat: 46.877229,
    lng: -96.789821,
};

const locations = [
    {
        lat: 46.9053111,
        lng: -96.8018717,
        info: 'BWW (19th Ave)',
        details: 'Temp & Humidity',
        dataReading: 'Sends data every 10 minutes',
      },
      {
        lat: 46.8580323,
        lng: -96.8507669,
        info: 'BWW (42nd St)',
        details: 'Temp & Humidity',
        dataReading: 'Sends data every 10 minutes',
      },
      {
        lat: 46.8762257,
        lng: -96.7468651,
        info: 'BWW (Moorhead)',
        details: 'Temp & Humidity',
        dataReading: 'Sends data every 10 minutes',
      }
];

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapID = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

const RJMap = ({ statusOfAlerts }) => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  const { colorMode } = useColorMode();

  const mapContainerStyles = {
    width: isMobile ? '90%' : '60%',
    height: isMobile ? '600px' : '800px',
    margin: '0 auto',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    border: '3px solid #fd9801',
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
        <Heading size="xl" pb={'4'}>
          RJ Energy Sensor Map
        </Heading>
      </Box>
      <div className="map-container" style={mapContainerStyles}>
        <Map
          defaultCenter={center}
          defaultZoom={12}
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
                background={'#fd9801'}
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
                    <strong>Sensors:</strong> {location.details}
                  </div>
                  <div style={{ color: '#212121', fontSize: '14px' }}>
                    <strong>Data:</strong> {location.dataReading}
                  </div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default RJMap;
