import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmergencyContacts from "@/components/EmergencyContacts";
import MedicationReminders from "@/components/MedicationReminders";
import StudentHealthRecords from "@/components/StudentHealthRecords";
import { emergencyContacts, students as initialStudents, medicationReminders as initialReminders, Student, MedicationReminder } from "@/Data/mockData";

const STORAGE_KEY_STUDENTS = "mochi_student_health_data";
const STORAGE_KEY_MEDICATIONS = "mochi_medication_reminders";

const HealthData = () => {
  const navigate = useNavigate();
  
  // Load from localStorage or use initial data
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Load medication reminders from localStorage or use initial data
  const [medications, setMedications] = useState<MedicationReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEDICATIONS);
    return saved ? JSON.parse(saved) : initialReminders;
  });

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  // Save medications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MEDICATIONS, JSON.stringify(medications));
  }, [medications]);

  // Check for medication reminders and send notifications
  useEffect(() => {
    const checkMedications = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      medications.forEach((med) => {
        if (med.time === currentTime && med.status === "pending") {
          // Request notification permission if not granted
          if (Notification.permission === "granted") {
            new Notification("Medication Reminder", {
              body: `${med.studentName} - ${med.medicationName} (${med.dosage})${med.notes ? '\n' + med.notes : ''}`,
              icon: "/favicon.ico",
              tag: med.id,
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                new Notification("Medication Reminder", {
                  body: `${med.studentName} - ${med.medicationName} (${med.dosage})${med.notes ? '\n' + med.notes : ''}`,
                  icon: "/favicon.ico",
                  tag: med.id,
                });
              }
            });
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkMedications, 60000);
    // Check immediately on mount
    checkMedications();

    return () => clearInterval(interval);
  }, [medications]);


  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleAddMedication = (newMedication: MedicationReminder) => {
    setMedications((prev) => [...prev, newMedication]);
  };

  const handleUpdateMedication = (updated: MedicationReminder) => {
    setMedications((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
  };

  const handleDeleteMedication = (medicationId: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== medicationId));
  };

  const handleUpdateMedicationStatus = (medicationId: string, status: "pending" | "seen" | "completed") => {
    setMedications((prev) => 
      prev.map((m) => {
        if (m.id === medicationId) {
          const updated = { ...m, status };
          if (status === "seen" && !m.seenAt) {
            updated.seenAt = new Date().toISOString();
          }
          if (status === "completed" && !m.completedAt) {
            updated.completedAt = new Date().toISOString();
          }
          return updated;
        }
        return m;
      })
    );
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
        <MedicationReminders 
        medications={medications}
        students={students}
        onAddMedication={handleAddMedication}
        onUpdateMedication={handleUpdateMedication}
        onDeleteMedication={handleDeleteMedication}
        onUpdateStatus={handleUpdateMedicationStatus}
        />
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
