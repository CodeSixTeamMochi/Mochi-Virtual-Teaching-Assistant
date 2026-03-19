import { useState } from 'react';
import { Play, Image, Film, ExternalLink, Heart } from 'lucide-react';
import type { VisualResult } from '@/services/visualSearchService';

interface VisualResultCardProps {
  result: VisualResult;
  onClick?: (result: VisualResult) => void;
  searchQuery?: string;
}

/**
 * VisualResultCard Component - Universal Edition
 */
const VisualResultCard = ({ result, onClick, searchQuery = "Mochi Discovery" }: VisualResultCardProps) => {
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

  // 4. Added state for the save button
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const displayImage = imageUrl || thumbnail;

    /**
   * 5. The Database Save Function
   */
  const handleSaveClick = async (e: React.MouseEvent) => {
    // CRITICAL: This stops the main card from opening the full-screen modal when the heart is clicked
    e.stopPropagation(); 
    
    if (isSaved || isSaving) return;

    setIsSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/library/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: displayImage || link,
          query: searchQuery,
          student_id: 1 // Link this to actual user auth later
        }),
      });

      if (response.ok) {
        setIsSaved(true); // Turns the heart red!
      }
    } catch (err) {
      console.error("Failed to save image to database:", err);
    } finally {
      setIsSaving(false);
    }
  };

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

        {/* 6. NEW FLOATING SAVE BUTTON (Top Right) */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all duration-200 z-10 active:scale-95 border border-slate-100"
          title="Save to Scrapbook"
        >
          <Heart 
            className={`w-4 h-4 transition-colors duration-300 ${
              isSaved 
                ? 'fill-red-500 text-red-500 drop-shadow-sm' 
                : 'text-slate-400 hover:text-red-400'
            } ${isSaving ? 'animate-pulse' : ''}`} 
          />
        </button>
      </div>
      <div className="p-4 pt-1 flex-1 flex flex-col">
        <div className="mt-2 flex items-center gap-2">
          <div className="shrink-0 p-1.5 bg-slate-50 rounded-full group-hover:bg-primary/10 transition-colors">
            <ExternalLink className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>

          {/* Title follows the icon */}
          <h3 className="text-[14px] font-extrabold text-foreground line-clamp-1 group-hover:text-primary transition-colors leading-tight tracking-tight first-letter:uppercase lowercase">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default VisualResultCard;
