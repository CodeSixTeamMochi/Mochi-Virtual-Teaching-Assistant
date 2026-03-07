import { Play, Image, Film, ExternalLink, Heart } from 'lucide-react';
import type { VisualResult } from '@/services/visualSearchService';

interface VisualResultCardProps {
  result: VisualResult;
  onClick?: (result: VisualResult) => void;
}

/**
 * VisualResultCard Component - Universal Edition
 */
const VisualResultCard = ({ result, onClick }: VisualResultCardProps) => {
  const { 
    title, 
    type, 
    link, 
    imageUrl, 
    thumbnail, 
    description, 
    snippet,
    photographerName,
    photographerUrl 
  } = result as any;

  const displayImage = imageUrl || thumbnail;

  /**
   * BADGE CONFIGURATION
   */
  const badge = { 
    icon: Image, 
    label: 'Photo', 
    className: 'bg-cyan-400 text-cyan-950 border-cyan-200' 
  };
  
  const BadgeIcon = badge.icon;
  const utmParams = `?utm_source=mochi_kids&utm_medium=referral`;

  return (
    <div
      className="bg-card border-2 border-slate-100 hover:border-primary/30 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group cursor-zoom-in w-full flex flex-col relative"
      onClick={() => onClick?.(result)}
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-[4/3] m-1.2 bg-muted overflow-hidden rounded-[1.6rem]">
        <img
          src={displayImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { 
            e.currentTarget.src = "https://images.unsplash.com/photo-1591160674255-fc8b858ecf3b?w=500&auto=format&fit=crop"; 
          }} 
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* OVERLAY BADGE */}
        <div className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center shadow-md border ${badge.className}`}>
          <BadgeIcon className="w-3 h-3 mr-1.5 fill-current" />
          {badge.label}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-4 pt-1 flex-1 flex flex-col">
        <h3 className="text-[14px] font-extrabold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight tracking-tight">
          {title}
        </h3>
        
        {/* FOOTER - Updated with attribution logic */}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-slate-50">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {photographerName ? (
              /* UPDATED: Unsplash Attribution UI */
              <>
                
                <a 
                  href={`${photographerUrl}${utmParams}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-muted-foreground truncate font-bold hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()} 
                >
                  
                </a>
              </>
            ) : (
              /* ORIGINAL: Google/Fallback Source UI */
              <span className="text-[10px] text-muted-foreground truncate max-w-[120px] font-bold lowercase">
                {link?.replace('https://', '').replace('www.', '').split('/')[0]}
              </span>
            )}
          </div>
          <div className="p-1.5 bg-slate-50 rounded-full group-hover:bg-primary/10 transition-colors">
            <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualResultCard;
