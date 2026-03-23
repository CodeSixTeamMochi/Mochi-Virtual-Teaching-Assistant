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
    className: 'bg-cyan-100 text-cyan-800 border-cyan-200' // Made badge colors slightly softer/cleaner
  };
  
  const BadgeIcon = badge.icon;
  const utmParams = `?utm_source=mochi_kids&utm_medium=referral`;

  return (
    <div
      className="bg-white border-2 border-slate-100 hover:border-sky-300 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all duration-400 ease-out group cursor-zoom-in w-full flex flex-col relative"
      onClick={() => onClick?.(result)}
    >
      {/* THUMBNAIL CONTAINER */}
      <div className="relative aspect-[4/3] m-2 bg-slate-50 overflow-hidden rounded-[2rem] shadow-inner">
        <img
          src={displayImage}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          onError={(e) => { 
            e.currentTarget.src = "https://images.unsplash.com/photo-1591160674255-fc8b858ecf3b?w=500&auto=format&fit=crop"; 
          }} 
        />
        
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* OVERLAY BADGE */}
        <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-[11px] font-black uppercase flex items-center shadow-sm border backdrop-blur-sm ${badge.className}`}>
          <BadgeIcon className="w-3.5 h-3.5 mr-1.5 fill-current" />
          {badge.label}
        </div>

        {/* 6. NEW FLOATING SAVE BUTTON (Top Right) */}
        <button
          onClick={handleSaveClick}
          disabled={isSaving}
          className="absolute top-3 right-3 p-2.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-10 active:scale-90 border border-slate-100"
          title="Save to Scrapbook"
        >
          <Heart 
            className={`w-5 h-5 transition-all duration-500 ${
              isSaved 
                ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-sm' 
                : 'text-slate-400 hover:text-rose-400'
            } ${isSaving ? 'animate-bounce' : ''}`} 
          />
        </button>
      </div>
      
      {/* Title Area */}
      <div className="px-5 pb-5 pt-2 flex-1 flex flex-col">
        <div className="mt-1 flex items-center gap-3">
          <div className="shrink-0 p-2 bg-slate-50 rounded-full group-hover:bg-sky-100 transition-colors duration-300">
            <ExternalLink className="w-4 h-4 text-sky-500 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          </div>

          {/* Title follows the icon */}
          <h3 className="text-[15px] font-extrabold text-slate-700 line-clamp-1 group-hover:text-sky-600 transition-colors duration-300 leading-tight tracking-tight first-letter:uppercase lowercase">
            {title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default VisualResultCard;
