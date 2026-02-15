import { useState } from "react";
import { Bell, Plus, Pencil, Trash2, X } from "lucide-react";
import { MedicationReminder, Student } from "@/Data/mockData";
import AddMedicationModal from "./AddMedicationModal";

interface Props {
  medications: MedicationReminder[];
  students: Student[];
  onAddMedication: (medication: MedicationReminder) => void;
  onUpdateMedication: (medication: MedicationReminder) => void;
  onDeleteMedication: (medicationId: string) => void;
}

const MedicationReminders = ({ 
  medications, 
  students, 
  onAddMedication, 
  onUpdateMedication, 
  onDeleteMedication 
}: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MedicationReminder | null>(null);

  const handleEdit = (medication: MedicationReminder) => {
    setEditingId(medication.id);
    setEditForm({ ...medication });
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdateMedication(editForm);
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <>
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notification/15">
              <Bell className="h-5 w-5" style={{ color: 'hsl(var(--notification))' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Medication Reminders</h2>
              <p className="text-sm text-muted-foreground">
                {medications.length} active reminder{medications.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-notification px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ color: 'hsl(var(--notification-foreground))' }}
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="space-y-3">
          {medications.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40">
              <p className="text-sm text-muted-foreground">No medication reminders set</p>
            </div>
          ) : (
            medications.map((med) => (
              <div
                key={med.id}
                className="rounded-xl border border-border bg-background p-4"
              >
                {editingId === med.id && editForm ? (
                  // Edit Mode
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">
                          Student
                        </label>
                        <select
                          value={editForm.studentName}
                          onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                          className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                        >
                          {students.map((student) => (
                            <option key={student.id} value={student.name}>
                              {student.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">
                          Medication
                        </label>
                        <input
                          type="text"
                          value={editForm.medicationName}
                          onChange={(e) => setEditForm({ ...editForm, medicationName: e.target.value })}
                          className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">
                          Dosage
                        </label>
                        <input
                          type="text"
                          value={editForm.dosage}
                          onChange={(e) => setEditForm({ ...editForm, dosage: e.target.value })}
                          className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-card-foreground">
                          Time
                        </label>
                        <input
                          type="time"
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-card-foreground">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={editForm.notes || ""}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        placeholder="Optional notes..."
                        className="w-full rounded-md border border-input bg-card px-3 py-1.5 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="rounded-md bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="rounded-md bg-secondary px-4 py-1.5 text-sm font-semibold text-secondary-foreground hover:opacity-90"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">{med.studentName}</h3>
                        <span className="rounded-full bg-notification/10 px-2 py-0.5 text-xs font-medium" style={{ color: 'hsl(var(--notification))' }}>
                          {med.time}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground">
                        <span className="font-medium">{med.medicationName}</span> - {med.dosage}
                      </p>
                      {med.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">{med.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(med)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20"
                      >
                        <Pencil className="h-3.5 w-3.5 text-primary" />
                      </button>
                      <button
                        onClick={() => onDeleteMedication(med.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/10 transition-colors hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <AddMedicationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddMedication}
        students={students}
      />
    </>
  );
};

export default MedicationReminders;