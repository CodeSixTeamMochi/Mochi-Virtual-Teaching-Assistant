import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  variant?: "green" | "yellow";
  className?: string;
}

export const StatCard = ({ 
  label, 
  value, 
  variant = "green",
  className 
}: StatCardProps) => {
  return (
    <div className={cn(
      "rounded-xl p-4 text-center shadow-card animate-slide-up",
      variant === "green" ? "bg-stats-green" : "bg-stats-yellow",
      className
    )} style={{ animationDelay: "0.5s" }}>
      <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};
