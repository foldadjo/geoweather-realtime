import React, { useState } from 'react';
import { WeatherInfo } from '../types';

interface WeatherDisplayProps {
  weatherInfo: WeatherInfo;
}

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;  
  }
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherInfo }) => {
  const { weatherDetails, sources: groundingSources, fullTextDescription } = weatherInfo;
  const aiProvidedSources = weatherDetails?.source;
  const [activeTab, setActiveTab] = useState<'summary' | 'json'>('summary');

  const TabButton: React.FC<{
    label: string;
    tabName: 'summary' | 'json';
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, tabName, isActive, onClick }) => (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${tabName}`}
      id={`tab-${tabName}`}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-700
                  ${isActive 
                    ? 'bg-slate-700/50 text-sky-100 border-b-2 border-sky-400' 
                    : 'text-sky-300 hover:bg-slate-600/50 hover:text-sky-50'
                  }`}
    >
      {label}
    </button>
  );

  const hasAiSources = aiProvidedSources && aiProvidedSources.length > 0;
  const hasGroundingSources = groundingSources && groundingSources.length > 0;

  return (
    <div className="glassmorphic-card shadow-2xl rounded-xl p-0 mt-8 w-full max-w-lg animate-fadeIn">
      <div className="flex border-b border-slate-600 px-4 pt-2" role="tablist" aria-label="Weather Data View">
        <TabButton 
          label="Summary" 
          tabName="summary"
          isActive={activeTab === 'summary'} 
          onClick={() => setActiveTab('summary')} 
        />
        <TabButton 
          label="JSON Data" 
          tabName="json"
          isActive={activeTab === 'json'} 
          onClick={() => setActiveTab('json')} 
        />
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'summary' && (
          <div role="tabpanel" id="tab-panel-summary" aria-labelledby="tab-summary">
            <h2 className="text-3xl font-semibold mb-4 text-sky-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-sky-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15L12 21l9.75-6M2.25 9l10.28-6.326a1.125 1.125 0 011.44 0L21.75 9M12 21V9.176M9 12.75L2.25 9m0 6l6.75-4.125M21.75 9l-6.75 4.125m0-4.125L12 2.674" />
              </svg>
              Weather Report
            </h2>
            
            {weatherDetails ? (
              <table className="w-full text-left text-sky-50 table-fixed">
                <caption className="sr-only">Detailed weather information</caption>
                <tbody>
                  {weatherDetails.locationName && weatherDetails.locationName !== "N/A" && (
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-3 font-semibold text-sky-100 w-1/3 sm:w-1/4">Location</td>
                      <td className="py-3 break-words">{weatherDetails.locationName}</td>
                    </tr>
                  )}
                  {weatherDetails.condition && (
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-3 font-semibold text-sky-100">Condition</td>
                      <td className="py-3 break-words">{weatherDetails.condition}</td>
                    </tr>
                  )}
                  {weatherDetails.temperature && (
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-3 font-semibold text-sky-100">Temperature</td>
                      <td className="py-3 break-words">{weatherDetails.temperature}</td>
                    </tr>
                  )}
                  {weatherDetails.humidity && (
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-3 font-semibold text-sky-100">Humidity</td>
                      <td className="py-3 break-words">{weatherDetails.humidity}</td>
                    </tr>
                  )}
                  {weatherDetails.wind && (
                    <tr className="border-b border-white/10">
                      <td className="py-3 pr-3 font-semibold text-sky-100">Wind</td>
                      <td className="py-3 break-words">{weatherDetails.wind}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <p className="text-sky-200 italic">Weather details are not available.</p>
            )}

            {(hasAiSources || hasGroundingSources) && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <h3 className="text-xl font-semibold mb-3 text-sky-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2 text-sky-300">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.978 11.978 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686-2.253A8.959 8.959 0 003 12c0-.778.099-1.533.284-2.253m18.149-2.25A11.971 11.971 0 0012 4.5c-2.998 0-5.74 1.1-7.843 2.918" />
                  </svg>
                  Data Sources
                </h3>
                {hasAiSources && (
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-sky-200 mb-1">Cited by AI:</h4>
                    <ul className="space-y-1 list-disc list-inside ml-1">
                      {aiProvidedSources!.map((source, index) => (
                        <li key={`ai-src-${index}`} className="text-sm text-sky-100 break-words">
                          {isValidUrl(source) ? (
                            <a 
                              href={source} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sky-300 hover:text-sky-100 hover:underline transition-colors"
                            >
                              {source}
                            </a>
                          ) : (
                            source
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {hasGroundingSources && (
                  <div>
                    <h4 className="text-md font-semibold text-sky-200 mb-1">Web References Consulted:</h4>
                    <ul className="space-y-2 list-disc list-inside ml-1">
                      {groundingSources!.map((source, index) => (
                        <li key={`ground-src-${index}`} className="text-sm">
                          <a
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-300 hover:text-sky-100 hover:underline transition-colors break-all"
                            title={source.title || 'Visit source'}
                          >
                            {source.title || source.uri}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {!hasAiSources && !hasGroundingSources && weatherDetails && (
               <div className="mt-6 pt-4 border-t border-white/20">
                  <p className="text-sm text-sky-200 italic">No specific data sources were cited for this information.</p>
               </div>
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <div role="tabpanel" id="tab-panel-json" aria-labelledby="tab-json">
            <h2 className="text-2xl font-semibold mb-3 text-sky-100">Raw JSON Data</h2>
            <p className="text-sm text-sky-200 mb-4">
              This is the raw text response received from the AI, which should be the JSON data.
            </p>
            <pre className="bg-slate-800/70 p-4 rounded-md text-sky-50 text-xs overflow-x-auto max-h-96 whitespace-pre-wrap break-all">
              <code>
                {fullTextDescription || "No JSON data available."}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDisplay;