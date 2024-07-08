import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, Pin, Marker } from '@vis.gl/react-google-maps';
import { Heading, Box, useMediaQuery } from '@chakra-ui/react';

const center = {
  lat: 46.877186,
  lng: -96.789803,
};

const locations = [
  { lat: 46.948580, lng: -97.262730, info: 'Grand Farm', details: 'Temp, Humidity, Rainfall & Wind', dataReading: 'Sends data every 5 minutes'  },
  { lat: 46.904340, lng: -96.810500, info: 'Incubator (Garage)', details: 'Temp, Humidity & Water Detection', dataReading: 'Sends data every 10 minutes' },
];

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const mapID = process.env.REACT_APP_GOOGLE_MAPS_MAP_ID;

const MiniMap = () => {
  const [openInfoIndex, setOpenInfoIndex] = useState(null);
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  const mapContainerStyles = {
    width: isMobile ? '90%' : '100%',
    height: isMobile ? '400px' : '400px',
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
                  pixelOffset={[0, -30]}
                  headerContent={<div style={{ color: '#212121', fontWeight: 'bold', fontSize: '20px' }}>{location.info}</div>}
                >
                  <div style={{ color: '#212121', fontSize: '14px' }}><strong>Sensors:</strong> {location.details}</div>
                  <div style={{ color: '#212121', fontSize: '14px' }}><strong>Data:</strong> {location.dataReading}</div>
                </InfoWindow>
              )}
            </AdvancedMarker>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
};

export default MiniMap;
