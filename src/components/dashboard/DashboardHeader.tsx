import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import mochiAvatar from "@/assets/mochi-mascot.jpeg";

interface DashboardHeaderProps {
  teacherName?: string;
  onLogout?: () => void;
}

export const DashboardHeader = ({ 
  teacherName = "Teacher", 
  onLogout 
}: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-card rounded-2xl shadow-soft animate-slide-up">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-mochi flex items-center justify-center">
          <img 
            src={mochiAvatar} 
            alt="Mochi" 
            className="w-12 h-12 object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Mochi Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">{getGreeting()}, {teacherName}!</p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full border-muted-foreground/30 hover:bg-secondary"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </header>
  );
};
