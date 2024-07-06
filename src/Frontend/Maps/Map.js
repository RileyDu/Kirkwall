// src/MapComponent.js
import { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Heading, Box } from '@chakra-ui/react';

const mapStyles = {
  width: '60%',
  height: '800px',
  margin: '0 auto',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  border: '3px solid #212121',
};

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

  return (
    <APIProvider apiKey={apiKey}>
      <Box width="100%" textAlign="center" p={'4'} pt={'64px'}>
        <Heading size="xl" pb={'4'}>
          Sensor Map
        </Heading>
      </Box>
      <div className="map-container" style={mapStyles}>
        <Map defaultCenter={center} defaultZoom={10} mapId={mapID} borderRadius="10px">
          {locations.map((location, index) => (
            <AdvancedMarker
              key={index}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => setOpenInfoIndex(index)}
            //   icon=
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
