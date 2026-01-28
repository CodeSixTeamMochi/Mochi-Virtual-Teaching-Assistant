import { Play, Image, Film } from 'lucide-react';
import type { VisualResult } from '@/services/visualSearchService';

interface VisualResultCardProps {
  result: VisualResult;
  onClick?: (result: VisualResult) => void;
}

/**
 * VisualResultCard Component
 * Displays individual search result with thumbnail, title, and content type badge
 * Supports images, videos, and animations
 */
const VisualResultCard = ({ result, onClick }: VisualResultCardProps) => {
  const { title, thumbnail, type } = result;

  const getBadgeConfig = () => {
    switch (type) {
      case 'video':
        return {
          icon: Play,
          label: 'Video',
          className: 'mochi-badge-video',
        };
      case 'animation':
        return {
          icon: Film,
          label: 'Animation',
          className: 'mochi-badge-animation',
        };
      default:
        return {
          icon: Image,
          label: 'Image',
          className: 'mochi-badge-image',
        };
    }
  };

  const badge = getBadgeConfig();
  const BadgeIcon = badge.icon;

  return (
    <div
      className="mochi-result-card group"
      onClick={() => onClick?.(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.(result)}
    >
      {/* Thumbnail with overlay */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 
                   group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play overlay for videos */}
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center 
                        bg-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
          {title}
        </h3>
        
        {/* Type badge */}
        <span className={`mochi-badge ${badge.className}`}>
          <BadgeIcon className="w-3 h-3 mr-1" />
          {badge.label}
        </span>
      </div>
    </div>
  );
};

export default VisualResultCard;
