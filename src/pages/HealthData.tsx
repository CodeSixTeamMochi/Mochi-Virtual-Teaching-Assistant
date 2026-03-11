import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmergencyContacts from "@/components/EmergencyContacts";
import MedicationReminders from "@/components/MedicationReminders";
import StudentHealthRecords from "@/components/StudentHealthRecords";
import { 
  students as initialStudents, 
  medicationReminders as initialReminders, 
  Student, 
  MedicationReminder,
  EmergencyContact,
} from "@/Data/mockData";
import { emergencyContactsAPI } from "@/services/api";

const STORAGE_KEY_STUDENTS = "mochi_student_health_data";
const STORAGE_KEY_MEDICATIONS = "mochi_medication_reminders";

const HealthData = () => {
  const navigate = useNavigate();
  
  // Students - still using localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STUDENTS);
    return saved ? JSON.parse(saved) : initialStudents;
  });

  // Medications - still using localStorage
  const [medications, setMedications] = useState<MedicationReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MEDICATIONS);
    return saved ? JSON.parse(saved) : initialReminders;
  });

  // Emergency contacts - NOW USING DATABASE
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch emergency contacts from database on mount
  useEffect(() => {
    const fetchEmergencyContacts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await emergencyContactsAPI.getAll();
        setEmergencyContacts(data);
      } catch (err) {
        console.error("Error fetching emergency contacts:", err);
        setError("Failed to load emergency contacts");
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmergencyContacts();
  }, []);

  // Save students to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
  }, [students]);

  // Save medications to localStorage
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

    const interval = setInterval(checkMedications, 60000);
    checkMedications();
    return () => clearInterval(interval);
  }, [medications]);

  // Student handlers (localStorage)
  const handleUpdateStudent = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  // Medication handlers (localStorage)
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

  // Emergency contact handlers (DATABASE)
  const handleUpdateEmergencyContact = async (updated: EmergencyContact) => {
    try {
      await emergencyContactsAPI.update(updated.id, {
        name: updated.name,
        phone: updated.phone,
        type: updated.type,
        icon: updated.icon,
      });
      setEmergencyContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (err) {
      console.error("Error updating contact:", err);
      alert("Failed to update contact. Please try again.");
    }
  };

  const handleAddEmergencyContact = async (newContact: Omit<EmergencyContact, 'id'>) => {
    try {
      const added = await emergencyContactsAPI.add(newContact);
      setEmergencyContacts((prev) => [...prev, added]);
    } catch (err) {
      console.error("Error adding contact:", err);
      alert("Failed to add contact. Please try again.");
    }
  };

  const handleDeleteEmergencyContact = async (contactId: string) => {
    try {
      await emergencyContactsAPI.delete(contactId);
      setEmergencyContacts((prev) => prev.filter((c) => c.id !== contactId));
    } catch (err) {
      console.error("Error deleting contact:", err);
      alert("Failed to delete contact. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading emergency contacts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-destructive">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-8 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-card-foreground">Health Information</h1>
            <p className="text-sm text-muted-foreground">Student Health and Emergency Data</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="space-y-6 px-8 py-6">
        <EmergencyContacts 
          contacts={emergencyContacts}
          onUpdateContact={handleUpdateEmergencyContact}
          onAddContact={handleAddEmergencyContact}
          onDeleteContact={handleDeleteEmergencyContact}
        />
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