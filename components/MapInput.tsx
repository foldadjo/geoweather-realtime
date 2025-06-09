import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { searchLocationByName } from '../services/geocodingService';
import { GeocodingResult } from '../types';

// Set up Leaflet's default icon paths.
try {
  // @ts-ignore L.Icon.Default.prototype._getIconUrl is not in types but needed for some setups
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
} catch (e) {
  console.error("Could not set Leaflet default icon options:", e);
}


interface MapInputProps {
  latitude: string;
  setLatitude: (value: string) => void;
  longitude: string;
  setLongitude: (value: string) => void;
  isLoading: boolean;
}

const MapInput: React.FC<MapInputProps> = ({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  isLoading,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const isInitialMountRef = useRef(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);


  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const initialLat = parseFloat(latitude) || 0;
      const initialLng = parseFloat(longitude) || 0;
      const initialZoom = (initialLat === 0 && initialLng === 0) ? 2 : 12;

      const map = L.map(mapRef.current, {
        scrollWheelZoom: 'center', 
      }).setView([initialLat, initialLng], initialZoom);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 2,
      }).addTo(map);

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        autoPan: true,
      }).addTo(map);
      markerRef.current = marker;

      marker.on('dragend', () => {
        if (markerRef.current) {
          const newLatLng = markerRef.current.getLatLng();
          setLatitude(newLatLng.lat.toFixed(6));
          setLongitude(newLatLng.lng.toFixed(6));
          setSearchQuery(''); // Clear search query on manual pin drag
          setSearchError(null);
        }
      });
      isInitialMountRef.current = false;
    }
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null; 
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    const map = mapInstanceRef.current;
    const marker = markerRef.current;

    if (map && marker) {
      const propLat = parseFloat(latitude);
      const propLng = parseFloat(longitude);

      if (!isNaN(propLat) && !isNaN(propLng)) {
        const newLatLng = L.latLng(propLat, propLng);
        if (!marker.getLatLng().equals(newLatLng)) {
          marker.setLatLng(newLatLng);
          const isDefaultCoords = propLat === 0 && propLng === 0;
          const currentMapCenter = map.getCenter();
          const distance = currentMapCenter.distanceTo(newLatLng);
         
          if (distance > 1000 || (!isInitialMountRef.current && !isDefaultCoords)) {
             const newZoom = (isDefaultCoords && map.getZoom() < 5) ? 2 : map.getZoom() < 10 ? 12 : map.getZoom();
             map.setView(newLatLng, newZoom);
          } else if (isDefaultCoords && map.getZoom() > 3){
             map.setView(newLatLng, 2);
          }
        }
      }

      const mapBusy = isLoading || isSearching;
      if (mapBusy) {
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        marker.dragging?.disable();
        if (mapRef.current) mapRef.current.style.cursor = 'not-allowed';
      } else {
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        marker.dragging?.enable();
        if (mapRef.current) mapRef.current.style.cursor = 'grab';
      }
    }
  }, [isLoading, isSearching, latitude, longitude]);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a location to search.");
      return;
    }
    setIsSearching(true);
    setSearchError(null);
    try {
      const results = await searchLocationByName(searchQuery);
      if (results && results.length > 0) {
        const firstResult = results[0];
        setLatitude(firstResult.latitude);
        setLongitude(firstResult.longitude);
        // Map will update via useEffect watching latitude/longitude props
        // setSearchQuery(''); // Optionally clear search query
      } else {
        setSearchError(`No results found for "${searchQuery}". Please try a different location.`);
      }
    } catch (error: any) {
      setSearchError(error.message || "Failed to search for location.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSearch} className="flex gap-2 items-start">
        <div className="flex-grow">
          <label htmlFor="location-search" className="sr-only">Search for a location</label>
          <input
            id="location-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (searchError) setSearchError(null); // Clear error on new input
            }}
            placeholder="Search city, address, or landmark..."
            className="w-full px-3 py-2.5 bg-slate-700/50 border border-slate-500 rounded-md text-sky-50 placeholder-sky-300/70 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-colors"
            disabled={isLoading || isSearching}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || isSearching || !searchQuery.trim()}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors flex items-center justify-center"
          style={{ height: '46px' }} // Match input height
        >
          {isSearching ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          )}
          <span className="sr-only">Search</span>
        </button>
      </form>
      {searchError && <p className="text-sm text-red-400 animate-fadeIn">{searchError}</p>}


      <div>
        <label htmlFor="map-container-label" className="block text-sm font-medium text-sky-100 mb-2">
          Or drag the pin on the map:
        </label>
        <div 
          id="map-container" 
          ref={mapRef} 
          className="h-64 md:h-72 w-full rounded-md shadow-md border border-white/20"
          style={{ cursor: (isLoading || isSearching) ? 'not-allowed' : (mapRef.current && mapRef.current.classList.contains('leaflet-dragging') ? 'grabbing' : 'grab') }}
          aria-labelledby="map-container-label"
          role="application"
        >
          <span id="map-container-label" className="sr-only">Interactive map for selecting coordinates. Current latitude: {latitude}, Current longitude: {longitude}. Map is {(isLoading || isSearching) ? 'busy' : 'interactive'}.</span>
        </div>
      </div>
    </div>
  );
};

export default MapInput;