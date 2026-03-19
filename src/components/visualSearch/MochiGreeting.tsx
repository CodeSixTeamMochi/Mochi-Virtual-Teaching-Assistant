import { useState, useEffect } from "react"; // Added these new on 28jan
import mochiMascot from '@/assets/mochi-avatar.jpeg';

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
      setTextColor("text-orange-500"); // Warm sun colo 

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
  }, []);// Added these new on 28jan

  return (
    <div className="flex flex-col items-center justify-center pt-8 pb-0 animate-fade-in font-nunito">
      <div className="relative">
        {/* Mochi mascot with gentle bounce animation */}
        <img
          src={mochiMascot}
          alt="Mochi - Your Virtual Teaching Assistant"
          className="w-56 h-56 md:w-64 md:h-64 object-contain drop-shadow-lg"
          style={{ animation: 'bounce-gentle 2s ease-in-out infinite' }}
          onError={(e) => {
            // Fallback to public folder image
            e.currentTarget.src = '/src/assets/mochi-avatar.jpeg';
          }}
        />
      </div>
      
      {/* Greeting text */}
      <h1 className={`mt-5 text-4xl md:text-5xl font-extrabold font-nunito ${textColor} text-center transition-colors duration-1000 tracking-tight drop-shadow-sm`}>
        {dynamicGreeting}
      </h1> {/* Added these new on 28jan*/}

      {/* Sub-text for child-friendly feel */}
      <p className="text-muted-foreground mt-2 text-lg md:text-xl font-medium font-nunito">
      I'm Mochi, your learning buddy!
      </p>{/* Added these new on 28jan*/}
    </div>
  );
};

export default MochiGreeting;
