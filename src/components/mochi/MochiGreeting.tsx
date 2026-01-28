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
  return (
    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
      <div className="relative">
        {/* Mochi mascot with gentle bounce animation */}
        <img
          src={mochiMascot}
          alt="Mochi - Your Virtual Teaching Assistant"
          className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-lg"
          style={{ animation: 'bounce-gentle 2s ease-in-out infinite' }}
          onError={(e) => {
            // Fallback to public folder image
            e.currentTarget.src = 'src\assets\mochi-avatar.jpeg';
          }}
        />
      </div>
      
      {/* Greeting text */}
      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground text-center">
        {greeting}
      </h1>
    </div>
  );
};

export default MochiGreeting;
