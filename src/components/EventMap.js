"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet's default icon path issues in Next.js
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}); 

// Helper to center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

  export default function EventMap({ location, disableDebounce = false }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debouncedLocation, setDebouncedLocation] = useState(location);
  const [isTyping, setIsTyping] = useState(false);

  // Debounce the location status
  useEffect(() => {
    if (disableDebounce) {
      setDebouncedLocation(location);
      return;
    }

    setIsTyping(true);
    const timer = setTimeout(() => {
      setDebouncedLocation(location);
      setIsTyping(false);
    }, 3000); // 3 seconds debounce

    return () => clearTimeout(timer);
  }, [location, disableDebounce]);

  useEffect(() => {
    // Manually fix icons if not present (simple hack for React Leaflet in Next.js)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    if (!debouncedLocation) {
      setLoading(false);
      return;
    }

    const geocode = async () => {
      try {
        setLoading(true);
        // Use Nominatim API (Free OSM Geocoding)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedLocation)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Geocoding failed:", error);
      } finally {
        setLoading(false);
      }
    };

    geocode();
  }, [debouncedLocation]);

  if (loading || (isTyping && !disableDebounce)) {
    return (
      <div className="w-full h-64 bg-muted animate-pulse rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        {isTyping ? "Waiting for input..." : "Locating on map..."}
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center text-muted-foreground text-sm">
        Location not found
      </div>
    );
  }

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden shadow-sm border border-border mt-6 relative z-0">
      <MapContainer 
        center={coordinates} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="w-full h-full"
      >
        <ChangeView center={coordinates} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>{location}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
