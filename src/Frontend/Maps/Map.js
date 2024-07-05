// src/MapComponent.js
import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 39.8283,
  lng: -98.5795, // Center of the US
};

const locations = [
  { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  { lat: 40.7128, lng: -74.0060 },  // New York
  { lat: 41.8781, lng: -87.6298 },  // Chicago
  // Add more locations as needed
];

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const MapComponent = () => {
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={4}>
        {locations.map((location, index) => (
          <Marker key={index} position={location} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
