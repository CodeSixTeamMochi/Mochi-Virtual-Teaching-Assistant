import { useState, useCallback } from "react";
import { getSearchResults, type VisualResult } from "@/services/visualSearchService";

/**
 * MOCHI SEARCH HOOK
 */
export const useGoogleSearch = () => {
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
       *CALL CONSOLIDATED SERVICE
       */
      const data = await getSearchResults(trimmedQuery);

      /**
       * 2. UPDATE UI STATE
       */
      if (data && data.length > 0) {
        setResults(data);
        setError(null);
      } else {
        setResults([]);
        setError("Mochi couldn't find any photos for that. Try another word!");
      }
    } catch (err: any) {
      // 3. ERROR HANDLING
      console.error("Hook Search Error:", err);
      setError("Mochi's search lens is a bit foggy. Check your connection!");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Return the state and the search function for your components to use
  return { results, isLoading, error, search };
};