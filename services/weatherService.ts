
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { WeatherInfo, GroundingSource, Candidate as CustomCandidate, GroundingMetadata as CustomGroundingMetadata, GroundingChunk as CustomGroundingChunk, WeatherDetails } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set or empty. Gemini API calls will likely fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const fetchWeatherFromGemini = async (latitude: string, longitude: string): Promise<WeatherInfo> => {
  if (!API_KEY) {
    throw new Error("Gemini API Key is not configured. Please set the API_KEY environment variable.");
  }
  
  const prompt = `Using Google Search to find the most current and reliable information, provide real-time weather for latitude ${latitude}, longitude ${longitude}.
Prioritize official weather stations or very recent (e.g., within the last hour) weather reports for this specific location.

Your response MUST be a JSON object containing the following fields:
- "locationName": string (name of the location or nearest city. If not identifiable, use "Unknown Location" or similar)
- "condition": string (e.g., "Sunny", "Cloudy", "Rainy", "Partly Cloudy with Showers")
- "temperature": string (e.g., "22°C / 72°F")
- "humidity": string (e.g., "55%")
- "wind": string (e.g., "10 km/h NW", "5 mph from South")
- "source": array of strings (e.g., ["National Weather Service", "OpenWeatherMap API"])

Example JSON response:
{
  "locationName": "Mountain View, CA, USA",
  "condition": "Partly Cloudy",
  "temperature": "18°C / 64°F",
  "humidity": "60%",
  "wind": "5 km/h West",
  "source": ["www.example.com", "weather station of bandara soekarno hatta"]
}

Ensure your response is ONLY the JSON object, with no other text, comments, or markdown formatting (like \`\`\`json ... \`\`\`) around it.
If web sources are consulted via the search tool, ensure they are cited through the API's grounding mechanism.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
          tools: [{googleSearch: {}}],
          // REMOVED: responseMimeType: "application/json", as it's not supported with tools.
        },
    });

    const rawTextResponse = response.text;
    let parsedJsonData: any;

    // Clean and parse JSON
    try {
      if (!rawTextResponse) {
        throw new Error("Received empty or undefined response text from the weather service.");
      }
      let jsonStr = rawTextResponse.trim();
      // Regex to strip potential markdown fences if the model still adds them
      const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
      const match = jsonStr.match(fenceRegex);
      if (match && match[1]) {
        jsonStr = match[1].trim();
      }
      parsedJsonData = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw response text:", rawTextResponse);
      throw new Error(`Received an invalid JSON response from the weather service. The AI might not have returned valid JSON. Raw response snippet: ${rawTextResponse ? rawTextResponse.substring(0,200) : 'undefined'}`);
    }
    
    const weatherDetails: WeatherDetails = {
      locationName: parsedJsonData.locationName || "N/A",
      condition: parsedJsonData.condition,
      temperature: parsedJsonData.temperature,
      humidity: parsedJsonData.humidity,
      wind: parsedJsonData.wind,
      source: Array.isArray(parsedJsonData.source) ? parsedJsonData.source : (parsedJsonData.source ? [parsedJsonData.source] : []), // Ensure 'source' is an array of strings
    };
    
    let groundingApiSources: GroundingSource[] = [];
    const firstCandidate = response.candidates?.[0] as CustomCandidate | undefined;
    const groundingMetadata = firstCandidate?.groundingMetadata as CustomGroundingMetadata | undefined;

    if (groundingMetadata?.groundingChunks) {
      groundingApiSources = groundingMetadata.groundingChunks
        .filter((chunk: CustomGroundingChunk) => chunk.web && chunk.web.uri && chunk.web.uri.trim() !== "")
        .map((chunk: CustomGroundingChunk) => ({
          uri: chunk.web!.uri,
          title: chunk.web!.title || "Source Document",
        }));
    }

    return {
      weatherDetails: weatherDetails,
      fullTextDescription: rawTextResponse, // Store the original text for reference or debugging
      sources: groundingApiSources, // These are the grounding sources from the API
    };

  } catch (error: any) {
    console.error("Error fetching weather data from Gemini:", error);
    if (error.message && (error.message.toLowerCase().includes("api key") || error.message.toLowerCase().includes("permission denied") || error.message.toLowerCase().includes("authentication"))) {
        throw new Error("Invalid or missing Gemini API Key. Please check your configuration and ensure the key has correct permissions and is valid.");
    }
    if (error.message && error.message.toLowerCase().includes("quota")) {
        throw new Error("API quota exceeded. Please check your Gemini API usage and limits.");
    }
    // If it's a parsing error from above, re-throw or wrap
    if(error.message.startsWith("Received an invalid JSON response")) {
        throw error;
    }
    // Catch specific Gemini API errors if possible, otherwise generic
     if (error.message && error.message.includes("INVALID_ARGUMENT")) {
      throw new Error(`The request to the weather service was invalid. This might be a configuration issue. Details: ${error.message}`);
    }
    throw new Error(`Failed to fetch weather data. ${error.message || 'Please try again later.'}`);
  }
};