import { useState } from "react";
import { Phone, TriangleAlert, Pill, Plus, X, User, Trash2, Pencil } from "lucide-react";
import { Student } from "@/Data/mockData.ts";

interface Props {
  student: Student;
  onUpdate: (updated: Student) => void;
  onDelete: (studentId: string) => void;
}

const StudentCard = ({ student, onUpdate, onDelete }: Props) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedicine, setNewMedicine] = useState("");
  const [addingAllergy, setAddingAllergy] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editPhone, setEditPhone] = useState(student.parentPhone);

  const handleCall = () => {
    // Format phone number - remove spaces and special characters
    const formattedPhone = student.parentPhone.replace(/\s+/g, '').replace(/-/g, '');
    
    // If the phone number doesn't start with +, add Sri Lanka country code (+94)
    const phoneWithCountryCode = formattedPhone.startsWith('+') 
      ? formattedPhone 
      : `+94${formattedPhone.replace(/^0/, '')}`; // Remove leading 0 and add +94
    
    // Open dialer with the phone number
    window.location.href = `tel:${phoneWithCountryCode}`;
  };

  const handleSaveEdit = () => {
    if (editName.trim() && editPhone.trim()) {
      onUpdate({
        ...student,
        name: editName.trim(),
        parentPhone: editPhone.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(student.name);
    setEditPhone(student.parentPhone);
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      onUpdate({ ...student, allergies: [...student.allergies, newAllergy.trim()] });
      setNewAllergy("");
      // Keep the input open for adding more
      // setAddingAllergy(false);
    }
  };

  const finishAddingAllergy = () => {
    if (newAllergy.trim()) {
      addAllergy();
    }
    setAddingAllergy(false);
    setNewAllergy("");
  };

  const addMedicine = () => {
    if (newMedicine.trim()) {
      onUpdate({ ...student, medicines: [...student.medicines, newMedicine.trim()] });
      setNewMedicine("");
      // Keep the input open for adding more
      //setAddingMedicine(false);
    }
  };

  const finishAddingMedicine = () => {
    if (newMedicine.trim()) {
      addMedicine();
    }
    setAddingMedicine(false);
    setNewMedicine("");
  };

  const removeAllergy = (index: number) => {
    onUpdate({ ...student, allergies: student.allergies.filter((_, i) => i !== index) });
  };

  const removeMedicine = (index: number) => {
    onUpdate({ ...student, medicines: student.medicines.filter((_, i) => i !== index) });
  };

  const handleDelete = () => {
    onDelete(student.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          {isEditing ? (
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Student name"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm font-semibold text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="tel"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                placeholder="Parent phone"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="rounded-md bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-card-foreground">{student.name}</h3>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                {student.parentPhone}
              </p>
            </div>
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
            >
              <Pencil className="h-4 w-4 text-primary" />
            </button>
            <button
              onClick={handleCall}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-call/10 transition-colors hover:bg-call/20"
            >
              <Phone className="h-4 w-4 text-call" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 transition-colors hover:bg-destructive/20"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
          <p className="mb-2 text-sm text-card-foreground">
            Are you sure you want to delete {student.name}'s health record?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="rounded-md bg-destructive px-3 py-1.5 text-sm font-semibold text-destructive-foreground hover:opacity-90"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-md bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAllergy();
                    } else if (e.key === "Escape") {
                      finishAddingAllergy();
                    }
                  }}
                  onBlur={finishAddingAllergy}
                  placeholder="Type and press Enter..."
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addMedicine();
                    } else if (e.key === "Escape") {
                      finishAddingMedicine();
                    }
                  }}
                  onBlur={finishAddingMedicine}
                  placeholder="Type and press Enter..."
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
