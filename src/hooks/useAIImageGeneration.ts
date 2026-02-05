import { useState, useCallback } from 'react';

export interface GeneratedImage {
  id: string;
  title: string;
  imageUrl: string;
  type: 'image';
  generatedAt: Date;
}

/**
 * Hook for AI image generation using Google Gemini API (client-side).
 * Requires VITE_GEMINI_API_KEY environment variable.
 */
export function useAIImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = useCallback(async (prompt: string): Promise<GeneratedImage | null> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      setError('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY.');
      console.error('Missing VITE_GEMINI_API_KEY environment variable');
      return null;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Use Imagen 3 model for image generation
      const MODEL_ID = 'imagen-3.0-generate-002';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:predict?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{
            prompt: `A bright, colorful, friendly educational 3D illustration for a 5-year-old child showing: ${prompt}. Safe for children, cartoon style.`
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '1:1',
            safetyFilterLevel: 'block_some',
            personGeneration: 'dont_allow'
          }
        }),
      });

      if (!response.ok) {
        // Fallback to Gemini 2.0 Flash experimental for image generation
        return await generateWithGeminiFlash(apiKey, prompt);
      }

      const result = await response.json();
      
      // Extract image from Imagen response
      const imageData = result.predictions?.[0]?.bytesBase64Encoded;
      
      if (!imageData) {
        console.warn('Imagen failed, trying Gemini Flash fallback');
        return await generateWithGeminiFlash(apiKey, prompt);
      }

      const imageUrl = `data:image/png;base64,${imageData}`;

      return {
        id: `generated-${Date.now()}`,
        title: `Mochi's Drawing: ${prompt}`,
        imageUrl,
        type: 'image',
        generatedAt: new Date(),
      };

    } catch (err) {
      console.error('Image generation error:', err);
      
      // Try fallback
      try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        return await generateWithGeminiFlash(apiKey, prompt);
      } catch (fallbackErr) {
        setError('Failed to generate image. Please try again.');
        return getFallbackImage(prompt);
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generateImage, isGenerating, error };
}

/**
 * Fallback: Use Gemini 2.0 Flash experimental model
 */
async function generateWithGeminiFlash(apiKey: string, prompt: string): Promise<GeneratedImage | null> {
  const MODEL_ID = 'gemini-2.0-flash-exp';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: `Generate a high-quality, friendly educational 3D illustration for a 5-year-old child showing: ${prompt}. Make it bright, colorful, and safe for children.`
        }]
      }],
      generationConfig: {
        responseModalities: ['IMAGE']
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_LOW_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
      ]
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini Flash error:', errorText);
    return getFallbackImage(prompt);
  }

  const result = await response.json();
  
  // Find image part in response
  const candidates = result.candidates?.[0]?.content?.parts || [];
  const imagePart = candidates.find((p: { inlineData?: { mimeType: string; data: string } }) => p.inlineData);

  if (!imagePart?.inlineData) {
    console.error('No image in Gemini response:', result);
    return getFallbackImage(prompt);
  }

  const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

  return {
    id: `generated-${Date.now()}`,
    title: `Mochi's Drawing: ${prompt}`,
    imageUrl,
    type: 'image',
    generatedAt: new Date(),
  };
}

/**
 * Returns a placeholder image when AI generation fails
 */
function getFallbackImage(prompt: string): GeneratedImage {
  return {
    id: `fallback-${Date.now()}`,
    title: `(Fallback) ${prompt}`,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
    type: 'image',
    generatedAt: new Date(),
  };
}

export default useAIImageGeneration;
