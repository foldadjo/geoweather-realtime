// services/geocodingService.ts
import { GeocodingResult, NominatimResponseItem } from '../types';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
// It's good practice to set a custom User-Agent for Nominatim.
// Replace with your app name and contact email.
const USER_AGENT = 'GeoWeatherRealtimeApp/1.0 (adibmaknun16@gmail.com)';

export const searchLocationByName = async (query: string): Promise<GeocodingResult[] | null> => {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '0', // We don't need detailed address breakdown
    limit: '5', // Limit to 5 results
  });

  try {
    const response = await fetch(`${NOMINATIM_BASE_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'User-Agent': USER_AGENT,
      },
    });

    if (!response.ok) {
      // Nominatim might return error details in JSON or text
      let errorDetails = `Nominatim API request failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorDetails += `: ${errorData.error?.message || JSON.stringify(errorData)}`;
      } catch (e) {
        // If error response is not JSON, try text
        try {
          const errorText = await response.text();
          errorDetails += `: ${errorText}`;
        } catch (e2) {
            // ignore
        }
      }
      console.error(errorDetails);
      throw new Error('Could not connect to the location search service. Please try again later.');
    }

    const data: NominatimResponseItem[] = await response.json();

    if (data && data.length > 0) {
      return data.map(item => ({
        latitude: item.lat,
        longitude: item.lon,
        displayName: item.display_name,
      }));
    }
    return null; // No results found
  } catch (error: any) {
    console.error('Error in searchLocationByName:', error);
    if (error.message.startsWith('Could not connect')) throw error; // Re-throw specific error
    throw new Error('An error occurred while searching for the location. Please check your connection and try again.');
  }
};
