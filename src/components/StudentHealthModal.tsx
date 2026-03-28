import { useState } from "react";
import { X, Search } from "lucide-react";
import { Student } from "@/Data/mockData";

interface StudentHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  availableStudents?: Array<{
    id: string;
    name: string;
    parentPhone?: string;
    classGroup?: string;
  }>;
  classOptions?: string[];  
}

const StudentHealthModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  availableStudents = [],
  classOptions = ["Class A", "Class B", "Class C"]  
}: StudentHealthModalProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<Student>({
    id: "",
    name: "",
    parentPhone: "",
    classGroup: classOptions[0] || "Class A",  
    allergies: [],
    medicines: [],
  });
  
  const [searchQuery, setSearchQuery] = useState("");

  // Filter students for selection
  const filteredStudents = availableStudents.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a student from database
  const handleSelectStudent = (student: any) => {
    const newStudent: Student = {
      id: student.id,
      name: student.name,
      parentPhone: student.parentPhone || "",
      classGroup: student.classGroup || classOptions[0] || "Class A", 
      allergies: [],
      medicines: [],
    };
    setSelectedStudent(newStudent);
    setFormData(newStudent);
  };

  // Handle save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  // Handle close and reset
  const handleClose = () => {
    setSelectedStudent(null);
    setFormData({
      id: "",
      name: "",
      parentPhone: "",
      classGroup: classOptions[0] || "Class A",  
      allergies: [],
      medicines: [],
    });
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  // Select Student from Database
  if (!selectedStudent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-card-foreground">Select Student</h2>
            <button onClick={handleClose} className="rounded-full p-1 hover:bg-secondary">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Student List */}
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {filteredStudents.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {searchQuery ? "No students found matching your search" : "No students available"}
              </div>
            ) : (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  onClick={() => handleSelectStudent(student)}
                  className="w-full rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-accent"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Parent Phone: {student.parentPhone || "Not Available"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Class: {student.classGroup || "Not Assigned"}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">
                      Select
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClose}
              className="rounded-lg bg-secondary px-6 py-2 text-sm font-semibold text-secondary-foreground hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add Health Information
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-2xl bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">
            Add Student Health Record
          </h2>
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-secondary">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Name (Read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Student Name
            </label>
            <input
              type="text"
              value={formData.name}
              disabled
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-muted-foreground"
            />
          </div>

          {/* Parent Phone (Read-only) */}
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Parent Phone Number
            </label>
            <input
              type="text"
              value={formData.parentPhone}
              disabled
              className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-muted-foreground"
            />
          </div>

          
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Class
            </label>
            <select
              value={formData.classGroup}
              onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {classOptions.length === 0 ? (
                <option value="">Loading classes...</option>
              ) : (
                classOptions.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground hover:opacity-90"
            >
              Add Student
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-lg bg-secondary px-6 py-2 font-semibold text-secondary-foreground hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentHealthModal;