import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Gamepad2,
  FileText,
  Heart,
  Bell,
  Calendar,
  SquarePen
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MochiWelcomeCard } from "@/components/dashboard/MochiWelcomeCard";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName] = useState("Teacher");
  const [todayBirthday, setTodayBirthday] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mochi_events');
    if (saved) {
      const allEvents = JSON.parse(saved);
      const todayStr = new Date().toISOString().split('T')[0];
      const birthdayEvent = allEvents.find((e: any) =>
        e.date === todayStr && (e.type === "holiday" || e.title.toLowerCase().includes("birthday"))
      );
      if (birthdayEvent) {
        setTodayBirthday(birthdayEvent.title);
      }
    }
  }, []);

  const features = [
    {
      icon: Gamepad2,
      title: "Revision Games",
      description: "Do some activities with kids",
      onClick: () => navigate("/activities")
    },
    {
      icon: Play,
      title: "Start Lesson",
      description: "Create and manage lessons",
      onClick: () => navigate("/LessonPlaneHome")
    },
    {
      icon: FileText,
      title: "Speech Reports",
      description: "View speech analysis reports",
      onClick: () => navigate("/speech-reports")
    },
    {
      icon: Calendar,
      title: "Calendar",
      description: "Manage your schedule",
      onClick: () => navigate("/calendar")
    },
    {
      icon: Heart,
      title: "Health Data",
      description: "View students health data",
      onClick: () => navigate("/health-data")
    },
    {
      icon: Bell,
      title: "Parent Reminders",
      description: "Send notifications to parents",
      onClick: () => navigate("/reminders")
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-10 font-nunito">
      <div className="max-w-7xl mx-auto space-y-8">
        <DashboardHeader teacherName={teacherName} onLogout={handleLogout} />
        <MochiWelcomeCard />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Feature Grid */}
          <div className="lg:col-span-8 space-y-6">
            {/* Birthday Notification Banner */}
            {todayBirthday && (
              <div className="animate-slide-up">
                <div className="inline-flex items-center bg-card px-5 py-2 rounded-xl shadow-sm border border-border/40">
                  <p className="text-sm font-medium text-muted-foreground">
                    🎂 Today is <span className="font-bold text-foreground">{todayBirthday}</span>
                  </p>
                </div>
              </div>
            )}

            <h3 className="text-lg font-bold mb-4 px-1">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  variant="primary"
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                />
              ))}
            </div>
          </div>

          {/* Right: Schedule & Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-bold">Overview</h3>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 transition-all flex items-center gap-1.5"
                onClick={() => navigate("/schedule")}
              >
                <SquarePen className="w-4 h-4" />
                Edit Schedule
              </Button>
            </div>

            <ScheduleCard />

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <StatCard label="Total Students" value={20} variant="green" />
              <StatCard label="Activities Done" value={13} variant="yellow" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;