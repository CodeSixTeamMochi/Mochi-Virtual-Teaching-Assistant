/**
 * Mochi Virtual Teaching Assistant - Frontend Service
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const SAFETY_BLOCKLIST = [
  'gun', 'weapon', 'knife', 'sword', 'blood', 'gore', 'violence', 
  'kill', 'death', 'war', 'bomb', 'scary', 'fight', 'monster', '18+'
];

/**
 * HELPER: The "Magic Formatter"
 */
const formatImageSource = (raw: any): string => {
  if (!raw) return "";
  
  let str = String(raw).trim()
    .replace(/^b['"]/, '') // Removes Python's b' prefix
    .replace(/['"]$/, '')  // Removes trailing quote
    .replace(/\s/g, '');   // Removes all spaces (Fixes net::ERR_INVALID_URL)

  if (str.startsWith('data:image')) return str;

  // Handle raw Base64 strings by adding the necessary prefix
  if (str.length > 50 && !str.startsWith('http')) {
    const cleanBase64 = str.replace(/[^A-Za-z0-9+/=]/g, "");
    return `data:image/png;base64,${cleanBase64}`;
  }

  if (str.startsWith('http')) return str;

  // Fallback to a placeholder service if the data is just a string/prompt
  return;
};

export interface VisualResult {
  id: string; 
  title: string; 
  imageUrl: string; 
  type: 'image' | 'video' | 'animation';
  description?: string; 
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
 * AI GENERATION: Calls /api/generate-content
 */
export async function generateAIContent(query: string): Promise<GeneratedContent> {
  const normalizedQuery = query.toLowerCase().trim();
  const isRestricted = SAFETY_BLOCKLIST.some(word => normalizedQuery.includes(word));

  try {
    const response = await fetch(`${BACKEND_URL}/generate-content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }) 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Mochi's station is busy!");
    }

    const data = await response.json();
    
    // Support both direct object return and nested .content return
    const content = data.content || data;
    const rawImage = content.imageUrl || content.image_base64 || "";

    return {
      id: content.id || `ai-${Date.now()}`,
      title: content.title || (isRestricted ? "Friendly Puppy Friend!" : `Mochi's Drawing`),
      imageUrl: formatImageSource(rawImage),
      type: 'image',
      generatedAt: new Date(),
      description: content.description || (isRestricted ? "Friendly Puppy Friend!" : "")
    };

  } catch (error) {
    console.error("Mochi Service Connection Error:", error);
    // Graceful fallback to prevent UI crash
    return {
      id: `err-${Date.now()}`,
      title: "Friendly Puppy Friend!",
      imageUrl: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
      type: 'image',
      generatedAt: new Date(),
      description: "Mochi is resting right now. Here is a puppy instead!"
    };
  }
}

/**
 * VISUAL SEARCH: Calls /api/visual-search
 */
export async function getSearchResults(query: string): Promise<VisualResult[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/visual-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const items = Array.isArray(data.results) ? data.results : (data.items || []);
    
    return items.map((item: any) => ({
      id: item.id || item.link || Math.random().toString(),
      title: item.title || "Image",
      imageUrl: formatImageSource(item.imageUrl || item.link || item.thumbnail),
      type: 'image',
      description: item.description || item.snippet || ""
    }));
    
  } catch (error) {
    console.error("Search Service Error:", error);
    return [];
  }
}

