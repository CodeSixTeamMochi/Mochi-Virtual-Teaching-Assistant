import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Loader2, CheckCircle2, LayoutGrid } from 'lucide-react'; // Added Loader2
import { 
  getLessons, 
  deleteLesson, 
  getCompletedLessonIds, 
  resetSingleLessonProgress 
} from '@/services/storageService';
import { Lesson } from '@/types/lesson';
import LessonCard from '@/components/lesson/LessonCard';
import CreateLessonModal from '@/components/lesson/CreateLessonModal';
import AILessonModal from '@/components/lesson/AILessonModal';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true); // NEW: Added loading state

  // CHANGE: Created a helper to refresh all data from the Database/API
  const refreshData = async () => {
    try {
      const [fetchedLessons, fetchedCompleted] = await Promise.all([
        getLessons(),
        getCompletedLessonIds()
      ]);
      setLessons(fetchedLessons);
      setCompletedIds(fetchedCompleted);
    } catch (error) {
      toast({
        title: "Database Error",
        description: "Could not fetch lessons from the cloud.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // CHANGE: useEffect is now calling the async refresh function
  useEffect(() => {
    refreshData();
  }, []);

  const handlePlayLesson = (lessonId: string) => {
    navigate(`/PlayLesson/${lessonId}`);
  };

  const handleEditLesson = (lessonId: string) => {
    navigate(`/EditLesson/${lessonId}`);
  };

  // CHANGE: Converted to async to wait for Database deletion
  const handleDeleteLesson = async (lessonId: string) => {
    const success = await deleteLesson(lessonId);
    if (success) {
      await refreshData(); // Refresh list from DB
      toast({
        title: 'Lesson deleted',
        description: 'The lesson has been removed from the database.',
      });
    }
  };

  const handleCreateLesson = () => {
    navigate('/CreateLesson');
  };

  // CHANGE: Converted to async to wait for Database update
  const handleResetSingle = async (lessonId: string) => {
    await resetSingleLessonProgress(lessonId);
    await refreshData(); // Refresh list from DB
    toast({
      title: "Lesson Reset",
      description: "This lesson is now back in your Active list.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <Button variant="ghost" size="icon" className="text-foreground" onClick={() => navigate('/Home')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Activity Library</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {isLoading ? (
          // NEW: Loading state while waiting for Neon DB
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Connecting to cloud database...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-6xl">📚</div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              No lessons yet
            </h2>
            <p className="mb-6 text-muted-foreground">
              Create your first lesson to get started!
            </p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Lesson
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* 1. ACTIVE LESSONS SECTION */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <LayoutGrid className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Active Lessons</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {lessons
                  .filter(lesson => !completedIds.includes(lesson.id))
                  .map(lesson => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      onClick={() => handlePlayLesson(lesson.id)}
                      onEdit={() => handleEditLesson(lesson.id)}
                      onDelete={() => handleDeleteLesson(lesson.id)}
                    />
                  ))}
              </div>
            </section>

            {/* 2. COMPLETED LESSONS SECTION */}
            {lessons.some(lesson => completedIds.includes(lesson.id)) && (
              <section className="pt-6 border-t border-border">
                <div className="flex items-center gap-2 mb-6 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                  <h2 className="text-2xl font-bold">Completed Lessons</h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 opacity-80">
                  {lessons
                    .filter(lesson => completedIds.includes(lesson.id))
                    .map(lesson => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={true}
                        onReset={() => handleResetSingle(lesson.id)}
                        onClick={() => handlePlayLesson(lesson.id)}
                        onEdit={() => handleEditLesson(lesson.id)}
                        onDelete={() => handleDeleteLesson(lesson.id)}
                      />
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Create Lesson Modal */}
      <CreateLessonModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSelectTemplate={handleCreateLesson}
        onSelectAI={() => setIsAIModalOpen(true)}
      />

      {/* AI Lesson Modal */}
      <AILessonModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
        onLessonCreated={refreshData} // Updated to refresh from DB
      />
    </div>
  );
};

export default Index;