// types.ts
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface WeatherDetails {
  locationName?: string;
  condition?: string;   // e.g., "Sunny", "Cloudy", "Rainy"
  temperature?: string; // e.g., "22°C / 72°F"
  humidity?: string;    // e.g., "55%"
  wind?: string;        // e.g., "10 km/h NW"
  source?: string[];    // e.g., ["www.example.com", "wether station of bandara souekarno hatta"]
}

export interface WeatherInfo {
  weatherDetails?: WeatherDetails; // Parsed structured data from JSON
  fullTextDescription?: string; // Original full text from AI, might be useful for debugging or fuller context
  sources: GroundingSource[];
}

// These types model the structure we expect from Gemini's response
// for grounding metadata, as per documentation and examples.
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // Other grounding types like "retrievedContext" can be added if used.
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}

// Types for Geocoding Service
export interface GeocodingResult {
  latitude: string;
  longitude: string;
  displayName: string;
}

export interface NominatimResponseItem {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string];
}
