import { useState, useEffect } from 'react';
import { BookOpen, Trash2, Image as ImageIcon } from 'lucide-react';

interface SavedAsset {
  id: number;
  url: string;
  query: string;
}

const ImageLibrary = () => {
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch saved images when the Library tab is opened
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        // Adjust this URL if your backend runs on a different port
        const response = await fetch('http://localhost:5000/api/library'); 
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error loading scrapbook:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  const handleDelete = async (urlToDelete: string) => {
    // Optimistically remove it from the UI immediately so it feels snappy
    setAssets((prevAssets) => prevAssets.filter((asset) => asset.url !== urlToDelete));

    try {
      const response = await fetch('http://localhost:5000/api/library/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToDelete }),
      });

      if (!response.ok) {
        console.error("Failed to delete from database");
        // If it fails, you could technically refresh the list here to bring it back
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1000px] mx-auto py-8 px-4 flex flex-col items-center justify-center text-sky-500 animate-pulse">
        <BookOpen className="w-10 h-10 mb-4 opacity-50" />
        <h2 className="text-xl font-black tracking-tight">Opening your Scrapbook...</h2>
      </div>
    );
  }

  // If the database returns an empty array
  if (assets.length === 0) {
    return (
      <div className="w-full max-w-[1000px] mx-auto py-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="bg-sky-100 p-6 rounded-full mb-6">
          <ImageIcon className="w-12 h-12 text-sky-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Your Scrapbook is empty!</h2>
        <p className="text-slate-500 max-w-sm">
          Go back to the Search tab, ask Mochi to find something, and click an image to save it here.
        </p>
      </div>
    );
  }

  return (
    /* Outer container matches the "Small" 1000px width with no side padding */
    <div className="w-full max-w-[1000px] mx-auto py-4 px-0">
      
      {/* HEADER */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-3 border-b border-sky-100 pb-4">
          <div className="bg-sky-500/10 p-2.5 rounded-xl">
            <BookOpen className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">
              My Mochi Scrapbook
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              {assets.length} Treasures Saved
            </p>
          </div>
        </div>
      </div>

      {/* GRID: 3-per-row on large screens, matching your search layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-10">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="group relative bg-white rounded-[1.5rem] p-2 shadow-sm border-[3px] border-slate-50 hover:border-sky-100 transition-all duration-300"
          >
            {/* The Image */}
            <div className="aspect-[4/3] rounded-[1rem] overflow-hidden bg-slate-100">
              <img 
                src={asset.url} 
                alt={asset.query}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Info and Delete Button */}
            <div className="mt-3 px-2 flex items-center justify-between pb-1">
              <div className="overflow-hidden">
                <p className="text-[11px] font-black text-sky-600 uppercase tracking-tight truncate">
                  {asset.query || "Saved Image"}
                </p>
              </div>
              
             <button 
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove from Scrapbook"
                onClick={() => handleDelete(asset.url)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageLibrary;