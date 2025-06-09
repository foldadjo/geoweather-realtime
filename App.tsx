import React, { useState, useCallback, useEffect } from 'react';
import { WeatherInfo } from './types';
import { fetchWeatherFromGemini } from './services/weatherService';
import MapInput from './components/MapInput';
import WeatherDisplay from './components/WeatherDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import TermsOfService from './components/TermsOfService';
import PrivacyPolicy from './components/PrivacyPolicy';

type View = 'main' | 'terms' | 'privacy';

const App: React.FC = () => {
  const [latitude, setLatitude] = useState<string>('0'); 
  const [longitude, setLongitude] = useState<string>('0');
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geolocationStatus, setGeolocationStatus] = useState<string>('Attempting to get your location...');
  const [currentView, setCurrentView] = useState<View>('main');

  useEffect(() => {
    if (currentView === 'main' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
          setGeolocationStatus('Location found!');
          setTimeout(() => setGeolocationStatus(''), 3000);
        },
        (err) => {
          console.warn(`Geolocation error: ${err.message}`);
          setGeolocationStatus('Could not get location. Using default. Please grant permission or select manually.');
           setTimeout(() => setGeolocationStatus(''), 5000);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    } else if (currentView === 'main') {
      setGeolocationStatus('Geolocation is not supported by your browser. Using default.');
      setTimeout(() => setGeolocationStatus(''), 5000);
    }
  }, [currentView]); // Rerun geolocation if user navigates back to main

  const handleFetchWeather = useCallback(async () => {
    if (!latitude.trim() || !longitude.trim()) {
      setError("Please select a location on the map.");
      return;
    }
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    if (isNaN(latNum) || isNaN(lonNum)) {
      setError("Latitude and Longitude must be valid numbers.");
      return;
    }
    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      setError("Coordinates are out of valid range. Latitude: -90 to 90, Longitude: -180 to 180.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setWeatherInfo(null); 

    try {
      const data = await fetchWeatherFromGemini(latitude, longitude);
      setWeatherInfo(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while fetching weather data.");
      setWeatherInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [latitude, longitude]);
  
  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0); // Scroll to top when changing views
  };

  const renderMainContent = () => (
    <>
      <header className="mb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">GeoWeather <span className="text-sky-300">Realtime</span></h1>
        <p className="text-md sm:text-lg text-sky-100 mt-2">Drag the pin, search, or use your current location for real-time weather updates.</p>
        {geolocationStatus && (
          <p className="text-xs text-sky-200 mt-1 animate-fadeIn">{geolocationStatus}</p>
        )}
      </header>

      <div className="glassmorphic-card shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-xl space-y-6">
        <MapInput
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
          isLoading={isLoading} 
        />
        <div className="text-center text-sky-100/90 text-sm">
          <p>Selected Coordinates:</p>
          <p>Latitude: {parseFloat(latitude).toFixed(4)}, Longitude: {parseFloat(longitude).toFixed(4)}</p>
        </div>
        <button
          onClick={handleFetchWeather}
          disabled={isLoading || !latitude || !longitude}
          className="w-full bg-sky-500 hover:bg-sky-400 disabled:bg-sky-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-sky-900/50 flex items-center justify-center"
          aria-label="Fetch weather for selected coordinates"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching Weather...
            </>
          ) : (
            'Get Weather 🌦️'
          )}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && !isLoading && <ErrorMessage message={error} />}
      {weatherInfo && !isLoading && !error && <WeatherDisplay weatherInfo={weatherInfo} />}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 text-white selection:bg-sky-300 selection:text-sky-900">
      <div className="flex flex-col items-center w-full flex-grow">
        {currentView === 'main' && renderMainContent()}
        {currentView === 'terms' && <TermsOfService onBack={() => navigateTo('main')} />}
        {currentView === 'privacy' && <PrivacyPolicy onBack={() => navigateTo('main')} />}
      </div>
      
      <footer className="mt-12 text-center text-sm text-sky-200 w-full max-w-xl">
        <div className="flex justify-center space-x-4 mb-2">
            <button onClick={() => navigateTo('terms')} className="hover:text-sky-50 hover:underline">Terms of Service</button>
            <span>|</span>
            <button onClick={() => navigateTo('privacy')} className="hover:text-sky-50 hover:underline">Privacy Policy</button>
            <span>|</span>
            <a href="mailto:adibmaknun16@gmail.com" className="hover:text-sky-50 hover:underline">Contact Us</a>
        </div>
        <p>Powered by Google Gemini API & OpenStreetMap. Weather data is subject to API availability and accuracy.</p>
        <p>&copy; {new Date().getFullYear()} GeoWeather Realtime App</p>
      </footer>
    </div>
  );
};

export default App;