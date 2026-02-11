import { useState } from "react";
import { Phone, TriangleAlert, Pill, Plus, X, User } from "lucide-react";
import { Student } from "@/Data/mockData.ts";

interface Props {
  student: Student;
  onUpdate: (updated: Student) => void;
}

const StudentCard = ({ student, onUpdate }: Props) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [addingAllergy, setAddingAllergy] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);

  const handleCall = () => {
    alert(`📞 Calling ${student.name}'s parent at ${student.parentPhone}...`);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      onUpdate({ ...student, allergies: [...student.allergies, newAllergy.trim()] });
      setNewAllergy("");
      setAddingAllergy(false);
    }
  };

  const addMedicine = () => {
    if (newMedicine.trim()) {
      onUpdate({ ...student, medicines: [...student.medicines, newMedicine.trim()] });
      setNewMedicine("");
      setAddingMedicine(false);
    }
  };

  const removeAllergy = (index: number) => {
    onUpdate({ ...student, allergies: student.allergies.filter((_, i) => i !== index) });
  };

  const removeMedicine = (index: number) => {
    onUpdate({ ...student, medicines: student.medicines.filter((_, i) => i !== index) });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{student.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {student.parentPhone}
            </p>
          </div>
        </div>
        <button
          onClick={handleCall}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-call/10 transition-colors hover:bg-call/20"
        >
          <Phone className="h-4 w-4 text-call" />
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Allergies */}
        <div className="rounded-xl bg-secondary/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <TriangleAlert className="h-3.5 w-3.5 text-warning" />
            <span className="text-xs font-semibold text-card-foreground">Allergies</span>
          </div>
          <div className="space-y-1.5">
            {student.allergies.map((allergy, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-md bg-card px-2.5 py-1.5 text-xs text-card-foreground"
              >
                {allergy}
                <button
                  onClick={() => removeAllergy(i)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
            {addingAllergy ? (
              <div className="flex gap-1">
                <input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                  placeholder="Type allergy..."
                  className="w-full rounded-md border border-input bg-card px-2 py-1 text-xs text-card-foreground outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setAddingAllergy(true)}
                className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-1 text-xs text-muted-foreground hover:text-card-foreground"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </div>
        </div>

        {/* Medicines */}
        <div className="rounded-xl bg-secondary/50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <Pill className="h-3.5 w-3.5 text-health" />
            <span className="text-xs font-semibold text-card-foreground">Medicines</span>
          </div>
          <div className="space-y-1.5">
            {student.medicines.map((med, i) => (
              <div
                key={i}
                className="group flex items-center justify-between rounded-md bg-card px-2.5 py-1.5 text-xs text-card-foreground"
              >
                {med}
                <button
                  onClick={() => removeMedicine(i)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
            {addingMedicine ? (
              <div className="flex gap-1">
                <input
                  value={newMedicine}
                  onChange={(e) => setNewMedicine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMedicine()}
                  placeholder="Type medicine..."
                  className="w-full rounded-md border border-input bg-card px-2 py-1 text-xs text-card-foreground outline-none focus:ring-1 focus:ring-ring"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setAddingMedicine(true)}
                className="flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-1 text-xs text-muted-foreground hover:text-card-foreground"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            )}
          </div>
        </div>

        {/* Notes placeholder */}
        <div className="rounded-xl bg-secondary/30 p-3">
          <p className="text-xs text-muted-foreground">Additional notes...</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
