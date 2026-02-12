import { useState, useCallback } from "react";
// UPDATED: Import the specific Unsplash function from your service
import { getUnsplashResults, type VisualResult } from "@/services/visualSearchService";

/**
 * MOCHI UNSPLASH SEARCH HOOK
 * -------------------------
 * Connects your UI specifically to high-quality Unsplash photos.
 */
export const useUnsplashSearch = () => {
  const [results, setResults] = useState<VisualResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      /**
       * CALL UNSPLASH SERVICE.
       */
      const data = await getUnsplashResults(trimmedQuery);

      /**
       *UPDATE UI STATE
       */
      if (data && data.length > 0) {
        setResults(data);
        setError(null);
      } else {
        setResults([]);
        setError("Mochi couldn't find any photos for that. Try another word!");
      }
    } catch (err: any) {
      // ERROR HANDLING
      console.error("Unsplash Hook Search Error:", err);
      setError("Mochi's photo book is stuck. Let's try again!");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Return the state and the search function for your components to use
  return { results, isLoading, error, search };
};