import React from 'react';

interface TermsOfServiceProps {
  onBack: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ onBack }) => {
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

      <h1 className="text-3xl font-bold mb-6 text-sky-100">Terms of Service</h1>
      
      <div className="space-y-4 text-sky-100/90">
        <p>Welcome to GeoWeather Realtime App! These terms and conditions outline the rules and regulations for the use of our application.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">1. Acceptance of Terms</h2>
        <p>By accessing and using our application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this application.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">2. Use of Service</h2>
        <p>GeoWeather Realtime App provides weather information based on geographical coordinates. This service is provided for informational purposes only. We utilize third-party APIs (Google Gemini API, OpenStreetMap Nominatim) for data retrieval. The accuracy, availability, and timeliness of the information are subject to these third-party services and are not guaranteed by us.</p>
        <p>You agree not to misuse the service or help anyone else to do so. You agree not to attempt to gain unauthorized access to our systems or engage in any activity that disrupts, diminishes the quality of, interferes with the performance of, or impairs the functionality of, the service.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">3. API Usage</h2>
        <p>The application relies on Google Gemini API and OpenStreetMap Nominatim. Your use of these APIs through our application is also subject to their respective terms of service. We are not responsible for any issues arising from your interaction with these third-party APIs, including but not limited to quota limitations, API key management (handled by the application environment), or data inaccuracies.</p>
        <p>The API Key for Google Gemini API is expected to be configured in the execution environment of this application and is not managed or stored by the client-side application itself.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">4. Intellectual Property</h2>
        <p>The application and its original content (excluding data retrieved from third-party APIs), features, and functionality are owned by the application creators and are protected by international copyright, trademark, and other intellectual property or proprietary rights laws.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">5. Limitation of Liability</h2>
        <p>In no event shall GeoWeather Realtime App, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">6. Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

        <h2 className="text-xl font-semibold mt-6 mb-2 text-sky-100">7. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us at <a href="mailto:adibmaknun16@gmail.com" className="text-sky-300 hover:underline">adibmaknun16@gmail.com</a>.</p>
        
        <p className="mt-6 text-sm"><em>Last updated: {new Date().toLocaleDateString()}</em></p>
      </div>
    </div>
  );
};

export default TermsOfService;