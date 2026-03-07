interface LoadingSkeletonProps {
  count?: number;
}

/**
 * LoadingSkeleton Component
 * Displays animated placeholder cards during content loading
 * Provides visual feedback to users during async operations
 */
const LoadingSkeleton = ({ count = 6 }: LoadingSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="mochi-card overflow-hidden animate-pulse"
        >
          {/* Thumbnail skeleton */}
          <div className="aspect-video bg-muted" />
          
          {/* Content skeleton */}
          <div className="p-3 space-y-2">
            {/* Title skeleton */}
            <div className="h-4 bg-muted rounded-full w-3/4" />
            
            {/* Badge skeleton */}
            <div className="h-5 bg-muted rounded-full w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
