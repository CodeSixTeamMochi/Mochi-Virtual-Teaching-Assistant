import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Gamepad2, Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}

const ActivitiesPage = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([
    { id: "1", title: "Color Matching", description: "Match colors with objects", duration: "15 mins", participants: 8, difficulty: "easy", completed: true },
    { id: "2", title: "Animal Sounds Quiz", description: "Identify animals by their sounds", duration: "20 mins", participants: 12, difficulty: "easy", completed: true },
    { id: "3", title: "Shape Sorting", description: "Sort shapes into categories", duration: "15 mins", participants: 10, difficulty: "medium", completed: false },
    { id: "4", title: "Number Hunt", description: "Find numbers around the room", duration: "25 mins", participants: 15, difficulty: "medium", completed: false },
    { id: "5", title: "Story Building", description: "Create stories together", duration: "30 mins", participants: 8, difficulty: "hard", completed: false },
  ]);

  const startActivity = (id: string) => {
    const activity = activities.find(a => a.id === id);
    toast({ 
      title: "Activity Started!", 
      description: `Starting "${activity?.title}" with kids` 
    });
  };

  const markComplete = (id: string) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, completed: true } : a
    ));
    toast({ title: "Activity completed!" });
  };

  const difficultyColors = {
    easy: "bg-success/20 text-success",
    medium: "bg-stats-yellow text-foreground",
    hard: "bg-warning/20 text-warning",
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activities</h1>
            <p className="text-sm text-muted-foreground">Fun learning activities for kids</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-stats-green">
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-bold text-foreground">
              {activities.filter(a => a.completed).length}
            </p>
          </Card>
          <Card className="p-4 bg-info">
            <p className="text-sm text-info-foreground">Remaining</p>
            <p className="text-2xl font-bold text-info-foreground">
              {activities.filter(a => !a.completed).length}
            </p>
          </Card>
        </div>

        {/* Activities List */}
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <Card 
              key={activity.id} 
              className={`p-4 animate-slide-up ${activity.completed ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1">
                  <div className="w-10 h-10 bg-mochi rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {activity.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {activity.participants} kids
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${difficultyColors[activity.difficulty]}`}>
                        {activity.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {activity.completed ? (
                    <div className="flex items-center gap-1 text-success">
                      <Star className="w-4 h-4 fill-success" />
                      <span className="text-xs font-medium">Done</span>
                    </div>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => startActivity(activity.id)}>
                        Start
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => markComplete(activity.id)}>
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivitiesPage;
