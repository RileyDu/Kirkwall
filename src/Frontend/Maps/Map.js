import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin } from '@vis.gl/react-google-maps';
import { Heading, Box, useMediaQuery } from '@chakra-ui/react';

const center = {
  lat: 46.877186,
  lng: -96.789803,
};

const locations = [
  { lat: 46.948580, lng: -97.262730, info: 'Grand Farm' },
  { lat: 46.904340, lng: -96.810500, info: 'Incubator (Garage)' },
];

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapID = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

const MapComponent = () => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  const mapContainerStyles = {
    width: '60%',
    height: isMobile ? '400px' : '800px',
    margin: '0 auto',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    border: '3px solid #212121',
  };

  const mapOptions = {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
    mapTypeId: 'satellite', // Always show the satellite view
    disableDefaultUI: true, // Disable all default UI controls
    // scrollwheel: false, // Disable zooming with the mouse wheelc
    zoomControl: true, // Enable the zoom control
    mapTypeControl: false, // Disable the map type control
    streetViewControl: false, // Disable the Street View control
    fullscreenControl: false, // Disable the fullscreen control
    gestureHandling: 'greedy', // Allow gestures on the map
    styles: [
      { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] } // Custom style example
    ],
    backgroundColor: '#f0f0f0', // Set the background color
  };
  

  return (
    <APIProvider apiKey={apiKey}>
      <Box width="100%" textAlign="center" p={'4'} pt={'64px'}>
        <Heading size="xl" pb={'4'}>
          Sensor Map
        </Heading>
      </Box>
      <div className="map-container" style={mapContainerStyles}>
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
              <Pin background={'#fd9801'} borderColor={'#212121'} glyphColor={'#212121'} />
              {openInfoIndex === index && (
                <InfoWindow
                  position={{ lat: location.lat, lng: location.lng }}
                  onCloseClick={() => setOpenInfoIndex(null)}
                  background={'#fd9801'}
                >
                  <div style={{ color: '#212121', fontWeight: 'bold', fontSize: '16px' }}>{location.info}</div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
