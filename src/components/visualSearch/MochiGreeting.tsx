import { useState, useEffect } from "react"; 
import mochiMascot from '@/assets/mochi_waving.gif';

interface MochiGreetingProps {
  greeting?: string;
}

/**
 * MochiGreeting Component
 * Displays the Mochi mascot with a friendly greeting
 * Used in the header section of the main interface
 */
const MochiGreeting = ({ greeting = "Hello! Good Morning" }: MochiGreetingProps) => {
  // We use setDynamicGreeting because that is the state we are updating
  const [dynamicGreeting, setDynamicGreeting] = useState("Hello! Good Morning");
  const [textColor, setTextColor] = useState("text-foreground"); 

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setDynamicGreeting("Good Morning, Friend! ☀️");
      setTextColor("text-orange-500"); // Warm sun color

    } else if (hour >= 12 && hour < 17) {
      setDynamicGreeting("Happy Afternoon! ☁️");
      setTextColor("text-sky-500");    // Bright sky blue

    } else if (hour >= 17 && hour < 21) {
      setDynamicGreeting("Good Evening, Explorer! 🌙");
      setTextColor("text-indigo-600"); // Calm twilight purple

    } else {
      setDynamicGreeting("Sweet Dreams! ✨");
      setTextColor("text-purple-700"); // Cozy night color
    }
  }, []);

return (
    <div className="flex flex-col items-center justify-center pt-8 pb-4 animate-fade-in font-nunito">
      <div className="relative group cursor-pointer inline-block">
        
        {/* Dynamic, breathing magical glow that matches the time of day! */}
        <div 
          className={`absolute inset-0 blur-3xl opacity-30 rounded-full transition-all duration-1000 ease-in-out animate-pulse scale-110 group-hover:scale-125 group-hover:opacity-50 group-hover:blur-2xl ${textColor.replace('text', 'bg')}`} 
        />

        {/* Mochi mascot with a playful hover bounce and tilt */}
        <img
          src={mochiMascot}
          alt="Mochi"
          className="relative w-72 h-72 md:w-96 md:h-96 object-contain drop-shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
        />
        
      </div>
      
      {/* Clean, bubbly text area */}
      <div className="mt-6 px-4 text-center max-w-2xl mx-auto relative flex flex-col items-center">
        
        {/* The greeting text now uses your textColor state and a subtle drop shadow */}
        <h1 className={`text-4xl md:text-5xl font-extrabold transition-colors duration-1000 tracking-tight drop-shadow-sm ${textColor}`}>
          {dynamicGreeting}
        </h1>
        
        {/* Cute pill-shaped bubble for the subtitle */}
        <p className="text-slate-600 mt-4 text-lg font-bold bg-white/80 backdrop-blur-sm inline-block px-6 py-2.5 rounded-full shadow-sm border-2 border-slate-100 hover:border-sky-200 transition-colors">
          "I'm Mochi, your learning buddy!"
        </p>
      </div>
    </div>
  );
}

export default MochiGreeting;
