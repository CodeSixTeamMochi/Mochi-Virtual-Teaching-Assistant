import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// 1. SAFETY BLOCKLIST: Immediate check for restricted content
const SAFETY_BLOCKLIST = [
  'gun', 'weapon', 'knife', 'sword', 'blood', 'gore', 'violence', 
  'kill', 'death', 'war', 'bomb', 'scary', 'fight', 'monster','18+'
];

export interface VisualResult {
  id: string;
  title: string;
  thumbnail: string;
  type: 'image' | 'video' | 'animation';
  description?: string;
  link: string;
  snippet: string;
  photographerName?: string;
  photographerUrl?: string;
  downloadLocation?: string;
}

export interface GeneratedContent {
  id: string;
  title: string;
  imageUrl: string;
  type: 'image' | 'video' | 'animation';
  generatedAt: Date;
  description?: string;
}

/**
 * AI GENERATION FUNCTION (Original - Untouched)
 */
export async function generateAIContent(query: string): Promise<GeneratedContent> {
  const normalizedQuery = query.toLowerCase().trim();
  const isRestricted = SAFETY_BLOCKLIST.some(word => normalizedQuery.includes(word));
  const effectiveQuery = isRestricted 
    ? "a cute fluffy golden retriever puppy playing in a sunny garden" 
    : query;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-image",
      systemInstruction: `You are Mochi, a professional AI photography assistant for kids. 
      Your goal is to generate high-fidelity, photorealistic images.

      SAFETY RULES:
      1. STRICTLY PROHIBITED: Weapons, violence, blood, or gore.
      2. If a user asks for something unsafe, always identify as:
      3. Ensure all photos are bright, positive, and educational.
      4. Always provide a sophisticated 3-word super simple title for kids age 1-5.`,

      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE }
      ],
    });

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [{ 
          text: `A high-resolution photo of: ${effectiveQuery}. Sharp focus, natural lighting, highly detailed textures.` 
        }] 
      }],
      generationConfig: {
        // @ts-ignore
        responseModalities: ["text", "image"],
      }
    });

    const response = await result.response;

    //API Safety Check Fallback
    if (response.candidates?.[0]?.finishReason === "SAFETY") {
      return {
        id: `safe-api-${Date.now()}`,
        title: "Friendly Puppy Friend!",
        imageUrl: `https://pollinations.ai/p/cute%20smiling%20puppy?width=1024&height=768&nologo=true`,
        type: 'image',
        generatedAt: new Date(),
        description: "Friendly Puppy Friend!"
      };
    }

    let aiTitle = "";
    let base64Image = "";

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) aiTitle = part.text.trim();
        else if (part.inlineData) base64Image = part.inlineData.data;
      }
    }

    return {
      id: `ai-${Date.now()}`,
      title: isRestricted ? "How about Friendly Puppy Friend!" : (aiTitle || `Photo: ${query}`),
      imageUrl: base64Image ? `data:image/png;base64,${base64Image}` : "",
      type: 'image',
      generatedAt: new Date(),
      description: isRestricted ? "Friendly Puppy Friend!" : ``
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Friendly Puppy Friend!"); 
  }
}

/**
 * Unsplash Image Search
 */
export async function getUnsplashResults(query: string): Promise<VisualResult[]> {
  const isRestricted = SAFETY_BLOCKLIST.some(word => query.toLowerCase().includes(word));

  if (isRestricted) {
    return [getSafePuppyResult("unsplash")];
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=8&content_filter=high&orientation=landscape`
    );

    if (!response.ok) throw new Error("Unsplash API error");
    
    const data = await response.json();

    return data.results.map((item: any) => ({
      id: item.id,
      title: item.alt_description || `Real photo of ${query}`,
      thumbnail: item.urls.small, 
      type: 'image',
      description: `Photo by ${item.user.name} on Unsplash`,
      link: item.links.html,
      snippet: item.description || item.alt_description || "",
      // New fields for the VisualResultCard
      photographerName: item.user.name,
      photographerUrl: item.user.links.html,
      downloadLocation: item.links.download_location
    }));
  } catch (error) {
    console.error("Unsplash Search Error:", error);
    return [];
  }
}

/**
 * NEW: Unsplash Download Tracker
 */
export async function trackUnsplashDownload(downloadUrl: string) {
  try {
    await fetch(`${downloadUrl}&client_id=${UNSPLASH_ACCESS_KEY}`);
  } catch (error) {
    console.error("Unsplash Track Error:", error);
  }
}

function getSafePuppyResult(source: string): VisualResult {
  return {
    id: `safe-${source}-${Date.now()}`,
    title: "Friendly Puppy Friend!",
    thumbnail: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300',
    type: 'image',
    description: "Friendly Puppy Friend!",
    link: "#",
    snippet: "I only search for happy things!"
  };
}