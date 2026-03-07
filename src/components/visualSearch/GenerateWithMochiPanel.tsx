import { useState, useEffect } from "react";
import { Sparkles, Loader2, Camera, Star, Wand2, X, Maximize2 } from 'lucide-react'; // Added X and Maximize2
import { Button } from "@/components/ui/button"; 
import { Card } from "@/components/ui/card";
import mochiMascot from '@/assets/mochi-avatar.jpeg';
import type { GeneratedContent } from '@/services/visualSearchService';

interface GenerateWithMochiPanelProps {
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  currentQuery: string;
  onGenerate: (query: string) => Promise<void>; 
}

/**
 * GenerateWithMochiPanel Component
 * Right-side panel for AI content generation
 * Shows Mochi avatar, preview container, and generate button
 * 
 * FUTURE: Will integrate with Gemini API for actual content generation
 */
const GenerateWithMochiPanel = ({
  generatedContent,
  isGenerating,
  currentQuery,
  onGenerate
}: GenerateWithMochiPanelProps) => {
  
  const [error, setError] = useState<string | null>(null);
  
  /**
   * STATE: track whether the image popup is open.
   * This is used to trigger the full-screen modal view.
   */
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Clear errors whenever the user types a new search query
  useEffect(() => {
    setError(null);
  }, [currentQuery]);

  const handleGenerate = async () => {
    if (!currentQuery || !currentQuery.trim() || isGenerating) return;
    setError(null);
    try {
      await onGenerate(currentQuery.trim());
    } catch (err: any) {
      setError(err.message || "Mochi had trouble creating that. Let's try again!");
    }
  };

  return (
    <>
      <Card className="w-full lg:w-[450px] p-8 bg-white border-[4px] border-sky-100 rounded-[3rem] flex flex-col animate-fade-in shadow-2xl shadow-sky-100/50 relative overflow-hidden">
        
        {/* Playful Background Decor */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-100 rounded-full blur-2xl opacity-50" />
        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-50" />

        {/* BRANDING HEADER */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-slate-50 relative z-10">
          <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-sky-400 to-indigo-500 p-1 shadow-lg rotate-3">
            <div className="w-full h-full rounded-[1.2rem] bg-white flex items-center justify-center overflow-hidden">
              <img 
                src={mochiMascot} 
                alt="Mochi Mascot" 
                className="w-14 h-14 object-contain"
              />
            </div>
          </div>
          <div>
            <h2 className="font-nunito text-2xl font-black text-slate-700 tracking-tight leading-none">
              Mochi's Magic Studio
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Wand2 className="w-3 h-3 text-sky-500" />
              <p className="text-[10px] text-sky-600 font-black uppercase tracking-widest">AI Creative Studio</p>
            </div>
          </div>
        </div>

        {/* VIEWPORT AREA: Where the magic happens */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[320px]   relative z-10">
          {isGenerating ? (
            <div className="w-full aspect-[4/3] rounded-[2.5rem] bg-slate-50 border-4 border-dashed border-sky-200 flex flex-col items-center justify-center gap-6 animate-pulse">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-sky-500 animate-spin" />
              </div>
              <p className="text-lg text-slate-600 font-black text-center px-8 leading-tight">
                Mochi is drawing...
              </p>
            </div>
          ) : generatedContent ? (
            <div className="w-3xl animate-in fade-in zoom-in duration-500">
              {/* IMAGE CONTAINER: Added cursor-pointer and onClick to trigger the popup.
                  The "group" class allows the overlay to show on hover.
              */}
              <div 
                className="aspect-[4/3] rounded-[2.5rem] p-3 bg-white shadow-xl border-2 border-slate-100 mb-6 group cursor-pointer relative overflow-hidden active:scale-95 transition-all"
                onClick={() => setIsPopupOpen(true)}
              >
                <div className="w-full h-full rounded-[1.8rem] overflow-hidden relative">
                  <img
                    src={generatedContent.imageUrl}
                    alt={generatedContent.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    key={generatedContent.imageUrl} 
                  />
                  
                  {/* HOVER OVERLAY: Gives a visual cue that the image can be clicked */}
                  <div className="absolute inset-0 bg-sky-500/0 group-hover:bg-sky-500/10 flex items-center justify-center transition-all duration-300">
                    <Maximize2 className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 drop-shadow-md" />
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-slate-800 text-center px-2">
                {generatedContent.title}
              </h3>
            </div>
          ) : (
            <div className="w-full aspect-[4/3] rounded-[2.5rem] bg-slate-50 border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 hover:border-sky-200 transition-colors group">
              <div className="w-24 h-24 rounded-[2rem] bg-white shadow-sm flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <Camera className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-xl font-black text-slate-400">Ready to Paint!</p>
              <p className="text-sm text-slate-400 mt-3 text-center max-w-[240px] font-medium leading-relaxed">
                {currentQuery 
                  ? `Push the big blue button to see Mochi draw!` 
                  : "Search for a topic, and Mochi will help you draw it!"}
              </p>
            </div>
          )}
        </div>

        {/* ERROR FEEDBACK */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-red-50 border-2 border-red-100 animate-in slide-in-from-top-2">
            <p className="text-red-600 text-sm font-black text-center">
                Oops! {error}
            </p>
          </div>
        )}

        {/* PRIMARY ACTION BUTTON */}
        <Button
          onClick={handleGenerate}
          disabled={!currentQuery?.trim() || isGenerating}
          className="mt-8 w-full h-16 rounded-[1.5rem] font-black text-xl shadow-[0_8px_0_rgb(12,148,227)] hover:shadow-[0_4px_0_rgb(12,148,227)] transition-all hover:translate-y-[4px] active:translate-y-[8px] active:shadow-none bg-sky-500 hover:bg-sky-400 text-white flex gap-3"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-7 h-7 animate-spin" />
              Magic in progress...
            </>
          ) : (
            <>
              {currentQuery ? "Make Magic!" : "Waiting for Topic"}
            </>
          )}
        </Button>

        {!currentQuery?.trim() && !isGenerating && (
          <p className="text-[11px] text-slate-400 text-center mt-5 font-bold uppercase tracking-widest animate-pulse">
            Waiting for your next search...
          </p>
        )}
      </Card>

      {/* FULL SCREEN POPUP: Renders outside the card but inside the component tree.
          We use "fixed inset-0" to cover the whole screen.
      */}
      {isPopupOpen && generatedContent && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setIsPopupOpen(false)} // Close when clicking background
        >
          {/* POPUP CONTENT CONTAINER */}
          <div 
            className="relative max-w-3xl w-full h-full flex flex-col items-center justify-center animate-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
          >
            {/* CLOSE BUTTON */}
            <button 
              className="absolute -top-7 right-0 md:-right-12 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsPopupOpen(false)}
            >
              <X className="w-7 h-7 stroke-[2px]" />
            </button>

            {/* THE ENLARGED IMAGE */}
            <div className="w-full h-full flex flex-col">
              <div className="flex-1 bg-white rounded-[3rem] p-4 shadow-2xl overflow-hidden">
                <img 
                  src={generatedContent.imageUrl} 
                  alt={generatedContent.title}
                  className="w-full h-full object-contain rounded-[2rem]"
                />
              </div>
              
              {/* POPUP TITLE AND MASCOT BADGE */}
              <div className="mt-6 flex items-center justify-between px-6">
                <div>
                  <h3 className="text-white text-3xl font-black">{generatedContent.title}</h3>
                  <p className="text-sky-300 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Painted by Mochi
                  </p>
                </div>
                <div className="hidden md:block w-14 h-14 bg-white rounded-2xl p-1 rotate-6">
                   <img src={mochiMascot} className="w-full h-full object-contain rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GenerateWithMochiPanel;
