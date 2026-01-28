/**
 * Visual Search Service
 * Mock service file for simulating backend API calls
 * 
 * FUTURE INTEGRATION POINTS:
 * - Replace mockSearchResults() with actual Gemini API call
 * - Replace mockGenerateContent() with Gemini Vision/Image generation API
 * - Add WebSocket connection for real-time streaming responses
 */

export interface VisualResult {
  id: string;
  title: string;
  thumbnail: string;
  type: 'image' | 'video' | 'animation';
  description?: string;
}

export interface GeneratedContent {
  id: string;
  title: string;
  imageUrl: string;
  type: 'image' | 'video' | 'animation';
  generatedAt: Date;
}

// Mock image URLs for demonstration
const mockImages = {
  apple: [
    'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=300&h=200&fit=crop',
  ],
  animals: [
    'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=300&h=200&fit=crop',
  ],
  car: [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop',
  ],
  default: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1588072432836-e10032774350?w=300&h=200&fit=crop',
  ],
};

const contentTypes: Array<'image' | 'video' | 'animation'> = ['image', 'video', 'animation'];

/**
 * Simulates searching for visual content
 * 
 * FUTURE: Replace with actual API call
 * Example:
 * const response = await fetch('/api/search', {
 *   method: 'POST',
 *   body: JSON.stringify({ query }),
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * return response.json();
 */
export async function mockSearchResults(query: string): Promise<VisualResult[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

  const lowerQuery = query.toLowerCase();
  let images = mockImages.default;

  if (lowerQuery.includes('apple')) {
    images = mockImages.apple;
  } else if (lowerQuery.includes('animal') || lowerQuery.includes('animals')) {
    images = mockImages.animals;
  } else if (lowerQuery.includes('car')) {
    images = mockImages.car;
  }

  return images.map((url, index) => ({
    id: `result-${Date.now()}-${index}`,
    title: `${query} - Result ${index + 1}`,
    thumbnail: url,
    type: contentTypes[index % contentTypes.length],
    description: `Educational content about ${query}`,
  }));
}

/**
 * Simulates AI content generation
 * 
 * FUTURE: Replace with Gemini API integration
 * Example:
 * const response = await fetch('/api/generate', {
 *   method: 'POST',
 *   body: JSON.stringify({ prompt: query }),
 *   headers: { 'Content-Type': 'application/json' }
 * });
 * return response.json();
 * 
 * For real-time streaming:
 * const ws = new WebSocket('wss://api/generate/stream');
 * ws.send(JSON.stringify({ prompt: query }));
 */
export async function mockGenerateContent(query: string): Promise<GeneratedContent> {
  // Simulate longer delay for "AI generation"
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  const lowerQuery = query.toLowerCase();
  let imageUrl = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop';

  if (lowerQuery.includes('apple')) {
    imageUrl = 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=400&h=300&fit=crop';
  } else if (lowerQuery.includes('animal')) {
    imageUrl = 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=300&fit=crop';
  } else if (lowerQuery.includes('car')) {
    imageUrl = 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop';
  }

  return {
    id: `generated-${Date.now()}`,
    title: `Generated: ${query}`,
    imageUrl,
    type: 'image',
    generatedAt: new Date(),
  };
}

/**
 * FUTURE: Speech-to-text integration point
 * 
 * Example implementation:
 * export async function startSpeechRecognition(
 *   onResult: (text: string) => void,
 *   onError: (error: Error) => void
 * ): Promise<void> {
 *   const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
 *   recognition.continuous = false;
 *   recognition.interimResults = false;
 *   recognition.lang = 'en-US';
 *   
 *   recognition.onresult = (event) => {
 *     const transcript = event.results[0][0].transcript;
 *     onResult(transcript);
 *   };
 *   
 *   recognition.onerror = (event) => {
 *     onError(new Error(event.error));
 *   };
 *   
 *   recognition.start();
 * }
 */
