import React from 'react';
import { ArrowLeft as ArrowIcon } from 'lucide-react';

export default function ArrowLeft() {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/'; // Fallback to home
    }
};

return (
    <button 
      onClick={handleBack}
      className="absolute top-6 left-6 z-50 p-3 rounded-full bg-white/80 backdrop-blur-md border border-white/20 text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm transition-all duration-300 hover:scale-110"
      aria-label="Go back"
    >
      <ArrowIcon className="w-6 h-6" />
    </button>
  );
}