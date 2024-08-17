import React from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerImage from '../assets/images/marker.jpg';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [32, 32], // Adjust the size of the marker
  iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
  popupAnchor: [0, -32], // Position of the popup relative to the icon
});

export default function Map() {
  const { lat, lng } = useParams();

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[lat, lng]} icon={customIcon} />
      </MapContainer>
    </div>
  );
}
