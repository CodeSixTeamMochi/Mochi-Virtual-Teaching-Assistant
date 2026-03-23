import { CSSProperties } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  variant?: "default" | "primary";
  className?: string;
  style?: CSSProperties;
}

export const FeatureCard = ({ icon: Icon, title, description, onClick, variant = "default", className, style }: FeatureCardProps) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "group flex flex-col gap-4 p-6 rounded-2xl text-left transition-all duration-300",
        "bg-card border border-border/50 shadow-sm",
        "hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 active:scale-[0.98]",
        "animate-slide-up",
        className
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3",
        variant === "primary" 
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
          : "bg-info text-info-foreground shadow-sm"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
};
