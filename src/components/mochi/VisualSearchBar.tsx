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
  onGenerateWithAI?: (query: string) => void; 
  isLoading?: boolean;
  placeholder?: string;
  showButtons?: boolean; 
  initialValue?: string; 
}

const VisualSearchBar = ({
  onSearch,
  onGenerateWithAI,
  isLoading = false,
  placeholder = "Search for an image...",
  showButtons = false,
  initialValue = ""
}: VisualSearchBarProps) => {
  const [query, setQuery] = useState(initialValue);
  const [isListening, setIsListening] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  /**
   * INITIALIZATION EFFECT
   * Sets up the "Ear" (Voice Recognition) and "Mochi" Wake Word logic.
   */
  useEffect(() => {
    // Supports both Chrome (webkit) and standard Speech APIs
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false; 
      recognitionRef.current.interimResults = true; 

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setQuery(transcript);

        // --- NEW MOCHI WAKE WORD LOGIC ---
        const lowerTranscript = transcript.toLowerCase();
        if (lowerTranscript.includes("mochi search for")) {
          const autoQuery = lowerTranscript.split("mochi search for")[1]?.trim();
          if (autoQuery) {
            onSearch(autoQuery); // Automatically triggers the search
            recognitionRef.current?.stop();
          }
        }
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [onSearch]); // Dependency ensures voice uses the latest search function

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
  }

  /**
   * FORM SUBMISSION
   * Now connected to the new API search logic via onSearch prop.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    if (query.trim() && !isLoading) {
      onSearch(query.trim()); // Calls the hook's search function
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mt-2 animate-fade-in">
      <div className="bg-card border-2 border-primary/10 p-2 rounded-2xl flex items-center gap-2 shadow-xl focus-within:border-primary/30 transition-all">
        
        {/* INPUT AREA */}
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3.5 bg-muted/50 rounded-full text-foreground focus:outline-none transition-all shadow-inner"
          />
          
          {/* MIC BUTTON */}
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-3 p-2 rounded-full transition-all ${
              isListening ? "bg-red-100 text-red-600 animate-pulse" : "text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="bg-orange-400 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-orange-500 shadow-md active:scale-95 disabled:opacity-50 transition-all text-sm whitespace-nowrap"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </button>

          {showButtons && onGenerateWithAI && (
            <button
              type="button"
              onClick={() => onGenerateWithAI(query)} 
              className="bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-600 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
export default VisualSearchBar;