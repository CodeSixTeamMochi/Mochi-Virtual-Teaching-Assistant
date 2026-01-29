import { useState, useRef, useEffect } from "react";
import { Search, Mic, MicOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/** * WEB SPEECH API INTERFACES
 * These tell TypeScript how the browser's built-in voice recognition works.
 * This is crucial for "Codebase B" logic to function without red error lines.
 */
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean; 
  interimResults: boolean; 
  lang: string;
  start: () => void; 
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null; 
  onerror: (() => void) | null;
}

// Extends the global 'window' object to recognize the Speech API
declare global { 
  interface Window { 
    SpeechRecognition?: new () => SpeechRecognitionInstance; 
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance; 
  } 
}


interface VisualSearchBarProps {
  onSearch: (query: string) => void;
  onGenerateWithAI: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const VisualSearchBar = ({
  onSearch,
  onGenerateWithAI,
  isLoading = false,
  placeholder = "Search for an image, or ask Mochi to generate..."
}: VisualSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  /** * useRef is used here because the SpeechRecognition instance 
   * needs to persist for the lifetime of the component without 
   * causing unnecessary re-renders.
   */
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  /**
   * INITIALIZATION EFFECT
   * This runs once when the component mounts to set up the "Ear" 
   * (Speech Recognition) of the app.
   */
  useEffect(() => {
    // Supports both Chrome (webkit) and standard Speech APIs
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false; // Stops listening after the user pauses
      recognitionRef.current.interimResults = true; // Provides text while the user is still speaking

      recognitionRef.current.onresult = (event) => {
        // Converts the speech results array into a single readable string
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setQuery(transcript);
      };

      // Reset UI state when the microphone naturally stops
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, []);

  /**
   * VOICE TOGGLE LOGIC
   * Handles the start/stop state. Notice the 'setIsListening' 
   * provides the visual feedback used in the CSS below.
   */
  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition is not supported in this browser.");
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the page from refreshing on 'Enter' key
    if (query.trim() && !isLoading) onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto animate-fade-in" >
      {/* GLASS-MORPHISM DESIGN: 
          Using bg-card and primary/10 border creates a high-end AI feel.
      */}
      <div className="bg-card border-2 border-primary/10 p-2 rounded-2xl flex items-center gap-2 shadow-xl 
                      focus-within:border-primary/30 transition-all">
        
        {/* INPUT CONTAINER */}
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-9 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 bg-muted/50 rounded-full text-foreground focus:outline-none focus:ring-2 
                      focus:ring-primary/20 transition-all shadow-inner"/>
          
          {/* DYNAMIC MIC BUTTON:
              If 'isListening' is true, the button turns red and pulses. 
              This is vital "Affordance" in UI design—it tells the user the mic is active.
          */}
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-3 p-2 rounded-full transition-all ${
              isListening 
                ? "bg-red-100 text-red-600 animate-pulse" 
                : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* PRIMARY ACTION: SEARCH Standard search for finding existing results.*/}
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="bg-orange-400 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-500 shadow-md active:scale-95 disabled:opacity-50 transition-all"
        >
          Search
        </button>

        {/* PRIMARY ACTION: GENERATE
            The 'Sparkles' icon and hover:scale-105 differentiate this 
            from standard search, signaling "Magic" or AI generation.
        
        <button
          type="button"
          onClick={() => onGenerateWithAI(query)}
          disabled={!query.trim() || isLoading}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          Generate
        </button>
        */}
      </div>
    </form>
  );
};

export default VisualSearchBar;