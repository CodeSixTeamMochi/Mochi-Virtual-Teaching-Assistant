import mochiMascot from "@/assets/mochi-avatar.jpeg";

interface MochiWelcomeCardProps {
  message?: string;
  subMessage?: string;
}

export const MochiWelcomeCard = ({ 
  message = "I'm Mochi, your AI teaching assistant!",
  subMessage = "I'm here to help you"
}: MochiWelcomeCardProps) => {
  return (
    <div className="relative bg-mochi rounded-2xl p-6 overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex flex-col items-center text-center">
        <div className="w-80 h-80 mb-4 animate-float">
          <img 
            src={mochiMascot} 
            alt="Mochi Assistant" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        <h2 className="text-xl font-bold text-info-foreground mb-1">{message}</h2>
        <p className="text-info-foreground/80">{subMessage}</p>
      </div>
    </div>
  );
};
