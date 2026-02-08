import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  MochiGreeting,
  VisualSearchBar,
  SearchResultsPanel,
  GenerateWithMochiPanel
} from '@/components/mochi';
import {
  getSearchResults,    
  generateAIContent,   
  type VisualResult,      
  type GeneratedContent   
} from '@/services/visualSearchService';

/**
 * Mochi Virtual Teaching Assistant - Main Interface
 * 
 * A production-ready React frontend for preschool classroom use.
 * Features real-time visual search and AI content generation.
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

  /**
   * Handle search action
   * Searches for visual content based on teacher's query
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
   * Handle AI generation action
   */
  const handleGenerateWithAI = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setGeneratedContent(null); 
    setSearchQuery(query); 
    setIsGenerating(true);
    setShowResults(true);

    try {
      // This calls the generateAIContent in visualSearchService.ts 
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
   * Handle generate button click in the panel
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
    setSelectedResult(null);
  }, []);

  // Home view with greeting
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

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
          <MochiGreeting greeting="Hello! Good Morning" />
          
          <div className="mt-8 w-full max-w-3xl">
            <VisualSearchBar
              onSearch={handleSearch}
              onGenerateWithAI={handleGenerateWithAI}
              isLoading={isSearching || isGenerating}
              placeholder="Search from google"
            />
          </div>
        </div>
      </div>
    );
  }

  // Results view with two-column layout
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with back button */}
      <div className="p-4 border-b border-border/50">
        <button
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
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
