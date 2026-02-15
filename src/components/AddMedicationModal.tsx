import { useState } from "react";
import { X } from "lucide-react";
import { MedicationReminder, Student } from "@/Data/mockData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (medication: MedicationReminder) => void;
  students: Student[];
}

const AddMedicationModal = ({ isOpen, onClose, onAdd, students }: Props) => {
  const [studentName, setStudentName] = useState(students[0]?.name || "");
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentName && medicationName.trim() && dosage.trim() && time) {
      const newMedication: MedicationReminder = {
        id: `med-${Date.now()}`,
        studentName,
        medicationName: medicationName.trim(),
        dosage: dosage.trim(),
        time,
        notes: notes.trim() || undefined,
        status: "pending",
      };
      
      onAdd(newMedication);
      handleClose();
    }
  };

  const handleClose = () => {
    setStudentName(students[0]?.name || "");
    setMedicationName("");
    setDosage("");
    setTime("09:00");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">Add Medication Reminder</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Student
            </label>
            <select
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            >
              {students.map((student) => (
                <option key={student.id} value={student.name}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Medication Name
            </label>
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              placeholder="e.g., Cetirizine"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Dosage
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="e.g., 5mg or 2 puffs"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Take with food"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full py-2.5 font-semibold transition-opacity hover:opacity-90"
              style={{ 
                backgroundColor: 'hsl(var(--notification))',
                color: 'hsl(var(--notification-foreground))'
              }}
            >
              Add Reminder
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-full bg-secondary py-2.5 font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicationModal;