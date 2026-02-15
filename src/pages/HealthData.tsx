import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmergencyContacts from "@/components/EmergencyContacts";
import MedicationReminders from "@/components/MedicationReminders";
import StudentHealthRecords from "@/components/StudentHealthRecords";
import { emergencyContacts, students as initialStudents, Student } from "@/Data/mockData";

const STORAGE_KEY = "mochi_student_health_data";

const HealthData = () => {
  const navigate = useNavigate();
  
  // Load from localStorage or use initial data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button 
          onClick={handleBack}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-card-foreground">Health Information</h1>
            <p className="text-xs text-muted-foreground">Student Health and Emergency Data</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl space-y-4 p-4">
        <EmergencyContacts contacts={emergencyContacts} />
        <MedicationReminders />
        <StudentHealthRecords 
        students={students} 
        onUpdateStudent={handleUpdateStudent} 
        onAddStudent={handleAddStudent}
        onDeleteStudent={handleDeleteStudent}
        />
      </main>
    </div>
  );
};

export default HealthData;
