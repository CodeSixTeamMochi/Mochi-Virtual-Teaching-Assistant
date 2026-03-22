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
      <div className="min-h-screen bg-slate-50 flex flex-col relative font-nunito">
        <div className="p-4 bg-white/80 backdrop-blur-md border-b-2 border-slate-100 flex items-center justify-between shadow-sm sticky top-0 z-20">
          <button
            onClick={() => setShowLibrary(false)}
            className="p-2.5 bg-slate-50 rounded-full text-slate-500 hover:text-sky-600 hover:bg-sky-100 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-extrabold text-slate-800 text-xl tracking-tight">My Mochi Scrapbook</h2>
          <div className="w-10" /> {/* Spacer to keep title centered properly */}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <ImageLibrary />
        </div>
      </div>
    );
  }

  /// Home view with greeting
  if (!showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50 flex flex-col relative font-nunito overflow-hidden">
        
        {/* Floating Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={() => window.history.back()} 
            className="p-3 bg-white/80 backdrop-blur-sm border-2 border-slate-100 rounded-full text-slate-400 hover:text-sky-500 hover:border-sky-200 hover:bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* NEW LIBRARY BUTTON */}
        <div className="absolute top-6 right-6 z-20">
          <button 
            onClick={() => setShowLibrary(true)} 
            className="flex items-center gap-2 px-6 py-3 bg-white text-sky-500 font-extrabold rounded-full shadow-sm border-2 border-slate-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-200/50 hover:-translate-y-1 transition-all duration-300 active:scale-95"
          >
            <BookOpen className="w-5 h-5" /> Library
          </button>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20 mt-10">
          <MochiGreeting/>
          
          <div className="mt-8 w-full max-w-4xl">
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
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-nunito">
      
      {/* Sticky Top Navigation */}
      <div className="p-4 bg-white/90 backdrop-blur-md border-b-2 border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button
          onClick={handleBack}
          className="p-2.5 bg-slate-50 rounded-full text-slate-500 hover:text-sky-600 hover:bg-sky-100 transition-all shadow-sm active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* NEW LIBRARY BUTTON */}
        <button 
          onClick={() => setShowLibrary(true)} 
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-400 to-sky-500 text-white font-extrabold rounded-full hover:from-sky-500 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 text-sm"
        >
          <BookOpen className="w-4 h-4" /> View Library
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row max-w-[1800px] w-full mx-auto">
        
        {/* Left column - Search and Results */}
        <div className="flex-1 flex flex-col p-4 lg:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-slate-800 mb-4 pl-2 tracking-tight">Search Results</h2>

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
          <div className="flex-1 bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-slate-100">
            <SearchResultsPanel
              results={searchResults}
              isLoading={isSearching}
              hasSearched={hasSearched}
              onResultClick={handleResultClick}
            />
          </div>
        </div>

        {/* Right column - Generate with Mochi */}
        <div className="lg:w-[450px] xl:w-[500px] lg:border-l-2 border-slate-100 bg-slate-50/50 p-4 lg:p-8">
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
