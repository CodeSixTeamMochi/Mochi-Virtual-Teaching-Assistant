import { useState, useCallback } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import MochiGreeting from '@/components/visualSearch/MochiGreeting';
import VisualSearchBar from '@/components/visualSearch/VisualSearchBar';
import SearchResultsPanel from '@/components/visualSearch/SearchResultsPanel';
import GenerateWithMochiPanel from '@/components/visualSearch/GenerateWithMochiPanel';
import ImageLibrary from '@/components/visualSearch/ImageLibrary'; 
import {
  getSearchResults,      
  generateAIContent,
  type VisualResult,      
  type GeneratedContent   
} from '@/services/visualSearchService';

/**
 * Mochi Virtual Teaching Assistant - Main Interface
 */
const VisualSearch = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<VisualResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedResult, setSelectedResult] = useState<VisualResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);

  /**
   * Handle search action (Connects to Google Search API)
   */
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setSearchQuery(query);
    setIsSearching(true);
    setHasSearched(true);
    setShowResults(true);

    try {
      // Replaced mock with real service function
      const results = await getSearchResults(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }

  }, []);

  /**
   * Handle AI generation action (Integrated with Gemini 3 Native Generation)
   */
  const handleGenerateWithAI = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setGeneratedContent(null); 
    setSearchQuery(query); 
    setIsGenerating(true);
    setShowResults(true);

    try {
      const result = await generateAIContent(query); 
      
      if (result) {
        setGeneratedContent(result);
      }
    } catch (error) {
      console.error('Gemini Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Sidebar Trigger
  */
  const handlePanelGenerate = useCallback(async (queryFromPanel: string) => {
    const activeQuery = queryFromPanel || searchQuery;
    if (activeQuery.trim()) {
      await handleGenerateWithAI(activeQuery);
    }
  }, [searchQuery, handleGenerateWithAI]);

  /**
   * Handle result card click
   */
  const handleResultClick = useCallback((result: VisualResult) => {
    setSelectedResult(result);

  }, []);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    setShowResults(false);
    setHasSearched(false);
    setSearchResults([]);
    setSearchQuery('');
    setGeneratedContent(null);
  }, []);

// --- LIBRARY VIEW ---
  if (showLibrary) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col relative">
        <div className="p-4 border-b border-border/50 bg-white flex items-center justify-between shadow-sm z-10">
          <button
            onClick={() => setShowLibrary(false)}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h2 className="font-bold text-slate-800 text-lg">My Mochi Scrapbook</h2>
          <div className="w-9" /> {/* Spacer to keep title centered */}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <ImageLibrary />
        </div>
      </div>
    );
  }

  /// Home view with greeting
  if (!showResults) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col relative">
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => window.history.back()} 
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        {/* NEW LIBRARY BUTTON */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={() => setShowLibrary(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-white text-sky-600 font-bold rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all"
          >
            <BookOpen className="w-5 h-5" /> Library
          </button>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <MochiGreeting/>
          
          <div className="mt-6 w-full max-w-3xl">
            <VisualSearchBar
              onSearch={handleSearch}
              onGenerateWithAI={handleGenerateWithAI}
              isLoading={isSearching || isGenerating}
              placeholder="What should Mochi find for you today?"
            />
          </div>
        </div>
      </div>
    );
  }

 // Results view with two-column layout
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col relative">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* NEW LIBRARY BUTTON */}
        <button 
          onClick={() => setShowLibrary(true)} 
          className="flex items-center gap-2 px-4 py-1.5 bg-sky-100 text-sky-600 font-bold rounded-full hover:bg-sky-200 transition-all text-sm shadow-sm"
        >
          <BookOpen className="w-4 h-4" /> View Library
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left column - Search and Results */}
        <div className="flex-1 flex flex-col p-4 lg:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-3">Results</h2>

            <div className="max-w-3xl">
              <VisualSearchBar
                onSearch={handleSearch}
                onGenerateWithAI={handleGenerateWithAI}
                showButtons={true}
                initialValue={searchQuery}
                isLoading={isSearching || isGenerating}
                placeholder="Show me an apple..."
              />
            </div>
          </div>
          {/* Results panel */}
          <SearchResultsPanel
            results={searchResults}
            isLoading={isSearching}
            hasSearched={hasSearched}
            onResultClick={handleResultClick}
          />
        </div>

        {/* Right column - Generate with Mochi */}
        <div className="lg:border-l border-border/50 p-4 lg:p-6">
          <GenerateWithMochiPanel
            generatedContent={generatedContent}
            isGenerating={isGenerating}
            currentQuery={searchQuery}
            onGenerate={handlePanelGenerate}
          />
        </div>
      </div>
    </div>
  );
};

export default VisualSearch;
