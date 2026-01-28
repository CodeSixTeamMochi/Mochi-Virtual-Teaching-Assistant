import type { VisualResult } from '@/services/visualSearchService';
import VisualResultCard from './VisualResultCard';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

interface SearchResultsPanelProps {
  results: VisualResult[];
  isLoading: boolean;
  hasSearched: boolean;
  onResultClick?: (result: VisualResult) => void;
}

/**
 * SearchResultsPanel Component
 * Displays grid of search results with loading and empty states
 * Responsive layout optimized for classroom display
 */
const SearchResultsPanel = ({
  results,
  isLoading,
  hasSearched,
  onResultClick
}: SearchResultsPanelProps) => {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Results</h2>
        <LoadingSkeleton count={6} />
      </div>
    );
  }

  // Empty state - no search performed yet
  if (!hasSearched) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          type="search"
          title="Ready to explore!"
          description="Type a command like 'Show me an apple' or 'Play a video about animals' to find learning content."
        />
      </div>
    );
  }

  // Empty state - search performed but no results
  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <EmptyState
          type="search"
          title="No results found"
          description="Try a different search term or use Mochi to generate new content."
        />
      </div>
    );
  }

  // Results grid
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Results ({results.length})
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
        {results.map((result) => (
          <VisualResultCard
            key={result.id}
            result={result}
            onClick={onResultClick}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPanel;
