import mochiGif from "@/assets/mochi-avatar-gif.gif";

interface MochiWelcomeCardProps {
  message?: string;
  subMessage?: string;
}

export const MochiWelcomeCard = ({ 
  message = "I'm Mochi, your AI teaching assistant!",
  subMessage = "I'm here to help you"
}: MochiWelcomeCardProps) => {
  return (
    <div className="relative bg-mochi rounded-[2rem] p-8 overflow-hidden shadow-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
      {/* Decorative background circle */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-info-foreground mb-3 leading-tight max-w-md">
            {message}
          </h2>
          <p className="text-lg text-info-foreground/80 font-medium">{subMessage}</p>
        </div>

        <div className="w-60 h-60 md:w-72 md:h-72 animate-float">
          <img 
            src={mochiGif} 
            alt="Mochi Assistant" 
            className="w-full h-full object-contain drop-shadow-2xl filter brightness-110" 
          />
        </div>
      </div>
    </div>
  );
};
