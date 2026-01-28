import { Search, Mic, Sparkles } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface VisualSearchBarProps {
  onSearch: (query: string) => void;
  onGenerateWithAI: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * VisualSearchBar Component
 * Teacher-friendly search bar with text input and microphone icon
 * Supports search and AI generation actions
 * 
 * FUTURE: Microphone button will integrate with speech-to-text API
 */
const VisualSearchBar = ({
  onSearch,
  onGenerateWithAI,
  isLoading = false,
  placeholder = "Show me an apple, Play a video about animals..."
}: VisualSearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleSearch = () => {
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleGenerate = () => {
    if (query.trim() && !isLoading) {
      onGenerateWithAI(query.trim());
    }
  };

  /**
   * FUTURE: Speech-to-text integration
   * This function will be replaced with actual speech recognition
   * 
   * Example:
   * const handleMicClick = async () => {
   *   await startSpeechRecognition(
   *     (transcript) => setQuery(transcript),
   *     (error) => console.error('Speech error:', error)
   *   );
   * };
   */
  const handleMicClick = () => {
    // Placeholder for future speech-to-text integration
    console.log('Microphone clicked - Speech recognition will be integrated here');
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="mochi-card p-2 flex items-center gap-2">
        {/* Search input with icons */}
        <div className="flex-1 relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-3 bg-muted/50 rounded-full text-foreground 
                     placeholder:text-muted-foreground focus:outline-none focus:ring-2 
                     focus:ring-primary/30 transition-all disabled:opacity-50"
          />
          
          {/* Microphone button - UI only for now */}
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className="absolute right-3 p-2 rounded-full text-muted-foreground 
                     hover:text-primary hover:bg-primary/10 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Voice input (coming soon)"
            title="Voice input - Coming soon"
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="mochi-button-accent px-5 py-2.5 text-sm whitespace-nowrap
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>

        <button
          onClick={handleGenerate}
          disabled={!query.trim() || isLoading}
          className="mochi-button-primary px-5 py-2.5 text-sm whitespace-nowrap
                   flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>
    </div>
  );
};

export default VisualSearchBar;
