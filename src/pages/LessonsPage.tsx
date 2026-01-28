import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "draft" | "active" | "completed";
}

const LessonsPage = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: "1", title: "Colors and Shapes", duration: "30 mins", status: "completed" },
    { id: "2", title: "Animal Sounds", duration: "25 mins", status: "active" },
    { id: "3", title: "Numbers 1-10", duration: "20 mins", status: "draft" },
  ]);
  const [newLessonTitle, setNewLessonTitle] = useState("");

  const addLesson = () => {
    if (!newLessonTitle.trim()) {
      toast({ title: "Please enter a lesson title", variant: "destructive" });
      return;
    }
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: newLessonTitle,
      duration: "15 mins",
      status: "draft",
    };
    setLessons([...lessons, newLesson]);
    setNewLessonTitle("");
    toast({ title: "Lesson created", description: `"${newLessonTitle}" has been added` });
  };

  const deleteLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
    toast({ title: "Lesson deleted" });
  };

  const toggleLessonStatus = (id: string) => {
    setLessons(lessons.map(l => {
      if (l.id === id) {
        return { ...l, status: l.status === "active" ? "draft" : "active" };
      }
      return l;
    }));
  };

  const statusColors = {
    draft: "bg-muted text-muted-foreground",
    active: "bg-success text-success-foreground",
    completed: "bg-info text-info-foreground",
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Lessons</h1>
        </div>

        {/* Add New Lesson */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter lesson title..."
              value={newLessonTitle}
              onChange={(e) => setNewLessonTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLesson()}
            />
            <Button onClick={addLesson}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </Card>

        {/* Lessons List */}
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id} className="p-4 animate-slide-up">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                  <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lesson.status]}`}>
                    {lesson.status}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => toggleLessonStatus(lesson.id)}
                  >
                    {lesson.status === "active" ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteLesson(lesson.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsPage;
