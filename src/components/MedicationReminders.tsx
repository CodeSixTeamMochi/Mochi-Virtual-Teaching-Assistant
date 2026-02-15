import { useState, useEffect } from "react";
import { Bell, Plus, Pencil, Trash2, X, Eye, CheckCircle, Clock } from "lucide-react";
import { MedicationReminder, Student } from "@/Data/mockData";
import AddMedicationModal from "./AddMedicationModal";

interface Props {
  medications: MedicationReminder[];
  students: Student[];
  onAddMedication: (medication: MedicationReminder) => void;
  onUpdateMedication: (medication: MedicationReminder) => void;
  onDeleteMedication: (medicationId: string) => void;
  onUpdateStatus: (medicationId: string, status: "pending" | "seen" | "completed") => void;
}

const MedicationReminders = ({ 
  medications, 
  students, 
  onAddMedication, 
  onUpdateMedication, 
  onDeleteMedication,
  onUpdateStatus 
}: Props) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<MedicationReminder | null>(null);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

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

  const handleMarkAsSeen = (medicationId: string) => {
    onUpdateStatus(medicationId, "seen");
  };

  const handleMarkAsCompleted = (medicationId: string) => {
    onUpdateStatus(medicationId, "completed");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-notification/10 text-notification";
      case "seen":
        return "bg-primary/10 text-primary";
      case "completed":
        return "bg-success/10 text-success";
      default:
        return "bg-secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "seen":
        return <Eye className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return null;
    }
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
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold text-card-foreground">{med.studentName}</h3>
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(med.status)}`}>
                          {getStatusIcon(med.status)}
                          {med.time}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(med.status)}`}>
                          {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-card-foreground">
                        <span className="font-medium">{med.medicationName}</span> - {med.dosage}
                      </p>
                      {med.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">{med.notes}</p>
                      )}
                      {med.seenAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Seen: {new Date(med.seenAt).toLocaleString()}
                        </p>
                      )}
                      {med.completedAt && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Completed: {new Date(med.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        {med.status === "pending" && (
                          <button
                            onClick={() => handleMarkAsSeen(med.id)}
                            className="flex h-8 items-center gap-1 rounded-full bg-primary/10 px-3 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                            title="Mark as Seen"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Seen
                          </button>
                        )}
                        {med.status === "seen" && (
                          <button
                            onClick={() => handleMarkAsCompleted(med.id)}
                            className="flex h-8 items-center gap-1 rounded-full bg-success/10 px-3 text-xs font-medium text-success transition-colors hover:bg-success/20"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Done
                          </button>
                        )}
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