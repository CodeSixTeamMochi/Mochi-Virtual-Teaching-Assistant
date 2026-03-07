import { ImageIcon, Search } from 'lucide-react';

interface EmptyStateProps {
  type?: 'search' | 'generate';
  title?: string;
  description?: string;
}

/**
 * EmptyState Component
 * Displays helpful message when no content is available
 * Used in search results and generate panel
 */
const EmptyState = ({
  type = 'search',
  title,
  description
}: EmptyStateProps) => {
  const defaultTitle = type === 'search' 
    ? "No results yet" 
    : "No Content Generated Yet";
    
  const defaultDescription = type === 'search'
    ? "Use the search bar above to find images, videos, and animations for your classroom."
    : "Use the AI generator to create images or videos";

  const Icon = type === 'search' ? Search : ImageIcon;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-3xl bg-muted/50 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground/50" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || defaultTitle}
      </h3>
      
      <p className="text-sm text-muted-foreground max-w-xs">
        {description || defaultDescription}
      </p>
    </div>
  );
};

export default EmptyState;
