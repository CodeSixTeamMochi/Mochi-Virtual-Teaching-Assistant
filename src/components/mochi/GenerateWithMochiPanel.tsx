import { Sparkles, ImageIcon, Loader2 } from 'lucide-react';
import mochiMascot from '@/assets/mochi-avatar.jpeg';
import type { GeneratedContent } from '@/services/visualSearchService';
import EmptyState from './EmptyState';

interface GenerateWithMochiPanelProps {
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  currentQuery: string;
  onGenerate: () => void;
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
  return (
    <div className="w-full lg:w-96 mochi-card p-6 flex flex-col animate-fade-in">
      {/* Header with Mochi avatar */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-mochi-cream flex items-center justify-center overflow-hidden">
          <img 
            src={mochiMascot} 
            alt="Mochi" 
            className="w-10 h-10 object-contain"
          />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Generate with Mochi
        </h2>
      </div>

      {/* Preview container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {isGenerating ? (
          // Loading state
          <div className="w-full aspect-[4/3] rounded-2xl bg-muted/50 flex flex-col items-center justify-center gap-4 animate-pulse-soft">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              Mochi is creating your content...
            </p>
          </div>
        ) : generatedContent ? (
          // Generated content preview
          <div className="w-full animate-scale-in">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={generatedContent.imageUrl}
                alt={generatedContent.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-base font-medium text-foreground text-center">
              {generatedContent.title}
            </h3>
            <p className="text-xs text-muted-foreground text-center mt-1">
              Generated at {generatedContent.generatedAt.toLocaleTimeString()}
            </p>
          </div>
        ) : (
          // Empty state
          <div className="w-full aspect-[4/3] rounded-2xl bg-muted/30 border-2 border-dashed border-muted flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-3">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-base font-medium text-muted-foreground">
              No Content
            </p>
            <p className="text-base text-muted-foreground">
              Generated Yet
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Use the AI generator to create images or videos
            </p>
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={onGenerate}
        disabled={!currentQuery.trim() || isGenerating}
        className="mt-6 w-full mochi-button-primary flex items-center justify-center gap-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate
          </>
        )}
      </button>

      {!currentQuery.trim() && !isGenerating && (
        <p className="text-xs text-muted-foreground text-center mt-2">
          Enter a search query first to generate content
        </p>
      )}
    </div>
  );
};

export default GenerateWithMochiPanel;
