import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import EmergencyContacts from "@/components/EmergencyContacts";
import MedicationReminders from "@/components/MedicationReminders";
import StudentHealthRecords from "@/components/StudentHealthRecords";
import { emergencyContacts, students as initialStudents, Student } from "@/Data/mockData";

const Index = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary">
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
        <StudentHealthRecords students={students} onUpdateStudent={handleUpdateStudent} />
      </main>
    </div>
  );
};

export default Index;
