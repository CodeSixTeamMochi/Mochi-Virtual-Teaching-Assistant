import { useState } from 'react';
import { X, ExternalLink, Maximize2, Sparkles } from 'lucide-react'; 
import type { VisualResult } from '@/services/visualSearchService';
import VisualResultCard from './VisualResultCard';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

// Keep originality: User's custom interface for internal data mapping
export interface SearchResultsPanel {
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string;
}

interface SearchResultsPanelProps {
  results: VisualResult[];
  isLoading: boolean;
  hasSearched: boolean;
  onResultClick?: (result: VisualResult) => void;
  searchQuery?: string;
}

const SearchResultsPanel = ({
  results,
  isLoading,
  hasSearched,
  onResultClick,
  searchQuery
}: SearchResultsPanelProps) => {
  const [selectedImage, setSelectedImage] = useState<VisualResult | null>(null);

  /**
   * STATE 1: LOADING
   * Kept original logic but updated text for a friendlier tone.
   */
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background/50">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
             <h2 className="text-2xl font-black tracking-tight text-primary animate-pulse">Looking for magic...</h2>
             <p className="text-sm text-muted-foreground italic">
               Mochi is exploring the world for "{searchQuery}"
             </p>
          </div>
        </div>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  /**
   * STATE 2: INITIAL STATE
   */
  if (!hasSearched) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          type="search"
          title="Ready to explore!"
          description="Type something like 'Photos of Jupiter' to see Google Search results here."
        />
      </div>
    );
  }

  /**
   * STATE 3: NO RESULTS (Google returned empty)
   */
  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          type="search"
          title="No images found"
          description="Google couldn't find exact matches. Try simplifying your search or use Mochi to generate new content."
        />
      </div>
    );
  }

  return (
    <div className="relative flex-1 overflow-y-auto p-6 scrollbar-hide bg-background/30 w-full max-w-[1400px]">
      
      {/* HEADER SECTION: Updated for Kids */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-6 border-primary/10 gap-4">
        <div className="flex items-center gap-4">
          {/* Playful Icon instead of a line */}
          <div className="bg-primary/10 p-2.5 rounded-2xl">
            <Sparkles className="w-6 h-6 text-primary fill-primary/20" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              Your Discovery Gallery
            </h2>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.2em] font-black">
              Safe & Verified Content
            </p>
          </div>
        </div>
        
        {/* SOURCE BADGE: More colorful for kids */}
        <div className="px-4 py-2 bg-green-50 backdrop-blur-sm rounded-2xl border-2 border-green-100 flex items-center gap-2.5 self-start md:self-center">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          <span className="text-[11px] font-black text-green-700 uppercase tracking-tight">Live Search</span>
        </div>
      </div>
      
      {/* GRID SYSTEM: Balanced 3-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-10">
        {results.map((result) => (
          <VisualResultCard
            key={result.id}
            result={result}
            onClick={(res) => {
              setSelectedImage(res);
              onResultClick?.(res);
            }}
          />
        ))}
      </div>

      {/* FULL IMAGE POPUP MODAL: Refined Kid-Friendly Design */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 md:p-8 animate-in fade-in zoom-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Large Close Button for easy clicking */}
          <button className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 p-3 rounded-full text-white transition-all active:scale-90 border border-white/20">
            <X className="w-6 h-6 stroke-[3px]" />
          </button>

          <div 
            className="relative max-w-4xl w-full flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* The "Discovery Frame" - Updated to use high-res link for clear viewing */}
            <div className="relative group w-full bg-white p-3 rounded-[2.5rem] shadow-2xl border-[6px] border-white/10">
              <img 
                src={(selectedImage as any).imageUrl || (selectedImage as any).link || (selectedImage as any).thumbnail}  
                alt={selectedImage.title}
                className="w-full h-auto max-h-[65vh] object-contain rounded-[1.8rem]"
              />
              <div className="absolute bottom-6 right-6 bg-primary/90 backdrop-blur-md p-3 rounded-2xl text-white shadow-xl">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>

            {/* Premium Kid-Friendly Info Box */}
            <div className="w-full max-w-2xl bg-white border-[3px] border-slate-100 shadow-2xl p-6 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="font-black text-xl text-slate-800 leading-tight">
                  {selectedImage.title}
                </h3>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold">
                    {(selectedImage as any).link 
                      ? (selectedImage as any).link.replace('https://', '').split('/')[0] 
                      : ''}
                  </span>
                </div>
              </div>
              
              <a 
                href={(selectedImage as any).link || (selectedImage as any).imageUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-black text-sm hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-primary/20 whitespace-nowrap"
              >
                Let's Go See! <ExternalLink className="w-5 h-5 stroke-[3px]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchResultsPanel;
