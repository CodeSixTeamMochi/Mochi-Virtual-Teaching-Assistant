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

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  variant = "default",
  className,
  style
}: FeatureCardProps) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={cn(
        "flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-200",
        "hover:scale-[1.02] hover:shadow-soft-lg active:scale-[0.98]",
        "bg-card border border-border shadow-card",
        "animate-slide-up",
        className
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
        variant === "primary" ? "bg-primary text-primary-foreground" : "bg-info text-info-foreground"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground truncate">{title}</h3>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
    </button>
  );
};
