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
      <div className="w-full max-w-2xl mx-auto mt-12 py-16 px-4 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-slate-100 shadow-sm animate-pulse">
        <BookOpen className="w-12 h-12 mb-4 text-sky-400 animate-bounce" />
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-700">Opening your Scrapbook...</h2>
      </div>
    );
  }

  // If the database returns an empty array
  if (assets.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-8 py-20 px-6 flex flex-col items-center justify-center text-center bg-white border-4 border-dashed border-slate-200 rounded-[3rem] hover:border-sky-300 transition-colors duration-500">
        <div className="bg-sky-50 p-6 rounded-full mb-6 shadow-inner">
          <ImageIcon className="w-16 h-16 text-sky-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-3 tracking-tight">Your Scrapbook is empty!</h2>
        <p className="text-slate-500 max-w-md text-lg font-medium">
          Go back to the Search tab, ask Mochi to find something magical, and click the heart to save it here.
        </p>
      </div>
    );
  }

  return (
    /* Outer container matches the "Small" 1000px width with no side padding */
    <div className="w-full max-w-[1200px] mx-auto py-4 px-0 animate-fade-in font-nunito">
      
      {/* HEADER */}
      <div className="px-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-sky-400 to-sky-500 p-3 rounded-2xl shadow-md shadow-sky-200/50 text-white transform -rotate-3 hover:rotate-0 transition-all duration-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none mb-1">
                My Mochi Scrapbook
              </h2>
              <p className="text-sm font-bold text-slate-400">
                Your saved collection of learning materials
              </p>
            </div>
          </div>
          
          {/* Fun little pill badge for the total count */}
          <div className="inline-flex items-center justify-center px-4 py-2 bg-sky-50 border-2 border-sky-100 rounded-full">
            <span className="text-sm font-black text-sky-600 uppercase tracking-wider">
              {assets.length} {assets.length === 1 ? 'Treasure' : 'Treasures'} Saved
            </span>
          </div>
        </div>
      </div>

      {/* GRID: 3-per-row on large screens, matching your search layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-12">
        {assets.map((asset) => (
          <div 
            key={asset.id} 
            className="group relative bg-white rounded-[2rem] p-2.5 shadow-sm border-2 border-slate-100 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-200/50 hover:-translate-y-1.5 transition-all duration-400 ease-out flex flex-col"
          >
            {/* The Image */}
            <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-slate-50 shadow-inner mb-3">
              <img 
                src={asset.url} 
                alt={asset.query}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* Soft overlay on hover */}
              <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors duration-300" />
            </div>

            {/* Info and Delete Button */}
            <div className="px-3 flex items-center justify-between pb-2 flex-1">
              <div className="overflow-hidden pr-3">
                <p className="text-[11px] font-black text-slate-500 group-hover:text-sky-600 uppercase tracking-wider truncate transition-colors duration-300">
                  {asset.query || "Saved Image"}
                </p>
              </div>
              
             <button 
                className="shrink-0 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-300 hover:scale-110 active:scale-90"
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