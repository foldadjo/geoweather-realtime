import React from 'react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  return (
    <div className="glassmorphic-card shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-2xl my-8 text-sky-50 animate-fadeIn">
      <button 
        onClick={onBack} 
        className="mb-6 bg-sky-600 hover:bg-sky-500 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to App
      </button>

      <h1 className="text-3xl font-bold mb-6 text-sky-100">Privacy Policy</h1>

      <div className="space-y-4 text-sky-100/90">
        <p>Your privacy is important to us. It is GeoWeather Realtime App's policy to respect your privacy regarding any information we may collect from you through our application.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">1. Information We Collect</h2>
        <p><strong>Geolocation Data:</strong> If you grant permission, we access your device's geolocation (latitude and longitude) to provide localized weather information and set the initial map view. This data is used only for the current session and is not stored or transmitted to our servers beyond its use in API calls to third-party weather and geocoding services (Google Gemini API, OpenStreetMap Nominatim).</p>
        <p><strong>Search Queries:</strong> If you use the location search feature, the search terms you enter are sent to the OpenStreetMap Nominatim API to find corresponding geographic coordinates. These queries are not stored by GeoWeather Realtime App.</p>
        <p><strong>API Key:</strong> The Google Gemini API key is required for this application to function. This key is assumed to be configured in the environment where the application is run (e.g., as an environment variable) and is accessed directly by the client-side code to make API calls. We do not ask for, collect, or store this API key through any user interface elements.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">2. How We Use Information</h2>
        <p>The information collected is used solely for the purpose of providing and improving the application's functionality:</p>
        <ul className="list-disc list-inside ml-4">
            <li>To fetch and display weather information relevant to your selected or current location.</li>
            <li>To allow you to search for locations on the map.</li>
            <li>To operate and maintain the service.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">3. Third-Party Services</h2>
        <p>Our application interacts with the following third-party services:</p>
        <ul className="list-disc list-inside ml-4">
            <li><strong>Google Gemini API:</strong> Used to fetch weather data. Your interactions are subject to Google's Privacy Policy.</li>
            <li><strong>OpenStreetMap Nominatim:</strong> Used for geocoding search queries. Your interactions are subject to OpenStreetMap Foundation's Privacy Policy.</li>
            <li><strong>Leaflet (OpenStreetMap Tiles):</strong> Used for map display. Tile usage may be subject to OpenStreetMap's tile usage policy.</li>
        </ul>
        <p>We are not responsible for the privacy practices of these third-party services. We encourage you to review their privacy policies.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">4. Data Security</h2>
        <p>Since this application primarily runs on the client-side and does not have its own backend for storing user data, the security of your data largely depends on the security of your own device and browser, and the security practices of the third-party APIs used. We do not store personal data on any servers controlled by GeoWeather Realtime App.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">5. Children's Privacy</h2>
        <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">6. Changes to This Privacy Policy</h2>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">7. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:adibmaknun16@gmail.com" className="text-sky-300 hover:underline">adibmaknun16@gmail.com</a>.</p>
        
        <p className="mt-6 text-sm"><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;