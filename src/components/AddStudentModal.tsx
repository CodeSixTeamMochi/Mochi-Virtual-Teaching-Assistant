import { useState } from "react";
import { X } from "lucide-react";
import { Student } from "@/Data/mockData";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: Student) => void;
  selectedClass: string;
}

const AddStudentModal = ({ isOpen, onClose, onAdd, selectedClass }: Props) => {
  const [name, setName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [classGroup, setClassGroup] = useState(selectedClass);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && parentPhone.trim()) {
      const newStudent: Student = {
        id: `student-${Date.now()}`,
        name: name.trim(),
        parentPhone: parentPhone.trim(),
        classGroup: classGroup,
        allergies: [],
        medicines: [],
      };
      
      onAdd(newStudent);
      setName("");
      setParentPhone("");
      setClassGroup(selectedClass);
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    setParentPhone("");
    setClassGroup(selectedClass);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">Add New Student</h2>
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
              Student Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter student name"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Parent Phone Number
            </label>
            <input
              type="tel"
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              placeholder="e.g., 077 123 4567"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Class
            </label>
            <select
              value={classGroup}
              onChange={(e) => setClassGroup(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Class A">Class A</option>
              <option value="Class B">Class B</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add Student
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

export default AddStudentModal;