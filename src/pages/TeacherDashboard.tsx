import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Play, 
  Gamepad2, 
  FileText, 
  Heart, 
  Bell, 
  Calendar 
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MochiWelcomeCard } from "@/components/dashboard/MochiWelcomeCard";
import { BirthdayNotification } from "@/components/dashboard/BirthdayNotification";
import { FeatureCard } from "@/components/dashboard/FeatureCard";
import { ScheduleCard } from "@/components/dashboard/ScheduleCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { toast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [teacherName] = useState("Teacher");

  const scheduleEvents = [
    { id: "1", title: "Morning Activity", time: "9:00 AM", status: "completed" as const },
    { id: "2", title: "Color Learning", time: "9:00 AM", status: "ongoing" as const },
    { id: "3", title: "Story Time", time: "10:00 AM", status: "upcoming" as const },
    { id: "4", title: "Play Time", time: "11:00 AM", status: "upcoming" as const },
  ];

  const features = [
    { 
      icon: Gamepad2, 
      title: "Revison Games", 
      description: "Do some activities with kids",
      onClick: () => navigate("/activities")
    },
    { 
      icon: Play, 
      title: "Start Lesson", 
      description: "Create and manage lessons",
      onClick: () => navigate("/lessons")
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
    // 1. Clear the session
    localStorage.removeItem('isAuthenticated');

    // 2. Show the notification
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });

    // 3. Redirect to login
    // { replace: true } prevents the user from clicking 'Back' to return to the dashboard
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 lg:p-10"> {/* Increased padding for breathability */}
      <div className="max-w-7xl mx-auto space-y-8"> {/* Added container for better wide-screen look */}
        
        <DashboardHeader teacherName={teacherName} onLogout={handleLogout} />

        <MochiWelcomeCard />

        <BirthdayNotification studentName="Mochi" />

        {/* Improved Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Feature Grid (Spans 8 columns) */}
          <div className="lg:col-span-8">
            <h3 className="text-lg font-bold mb-4 px-1">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                  variant={index < 2 ? "primary" : "default"}
                  style={{ animationDelay: `${0.2 + index * 0.05}s` }}
                />
              ))}
            </div>
          </div>

          {/* Right: Schedule & Stats (Spans 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold mb-4 px-1">Overview</h3>
            <ScheduleCard events={scheduleEvents} />
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
