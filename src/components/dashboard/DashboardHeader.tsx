import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import mochiAvatar from "@/assets/mochi-mascot.jpeg";
import { useState } from "react";
import { useEffect } from "react";

interface DashboardHeaderProps {
  teacherName?: string;
  onLogout?: () => void;
}

export const DashboardHeader = ({ 
  teacherName = "Teacher", 
  onLogout 
}: DashboardHeaderProps) => {
  /**
 * MochiGreeting Component
 * Displays the Mochi mascot with a friendly greeting
 * Used in the header section of the main interface
 */

  // We use setDynamicGreeting because that is the state we are updating
  const [dynamicGreeting, setDynamicGreeting] = useState("");
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
      setDynamicGreeting("Good Evening! ✨");
      setTextColor("text-purple-700"); // Cozy night color
    }
  }, []);

  return (
    // Added sticky top, backdrop-blur, and border-b for depth
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-card/80 backdrop-blur-lg border border-border/40 rounded-3xl shadow-soft animate-slide-up">
      <div className="flex items-center gap-4">
        {/* Added a subtle glow behind avatar */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-background shadow-md">
            <img src={mochiAvatar} alt="Mochi" className="w-full h-full object-cover" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">Mochi Dashboard</h1>
          <p className={`text-sm font-semibold ${textColor}`}>{dynamicGreeting}, {teacherName}!</p>
        </div>
      </div>
      <Button 
        variant="ghost" // Changed to ghost for a cleaner look
        size="sm" 
        className="rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Log Out
      </Button>
    </header>
  );
};
