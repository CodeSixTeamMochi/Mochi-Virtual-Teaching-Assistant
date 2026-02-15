import { useState } from "react";
import { Heart, Search, Plus } from "lucide-react";
import { Student } from "@/Data/mockData.ts";
import StudentCard from "./StudentCard";
import AddStudentModal from "./AddStudentModal";

interface Props {
  students: Student[];
  onUpdateStudent: (updated: Student) => void;
  onAddStudent: (newStudent: Student) => void;
  onDeleteStudent: (studentId: string) => void;
}

const classOptions = ["Class A", "Class B"];

const StudentHealthRecords = ({ students, onUpdateStudent, onAddStudent, onDeleteStudent }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filtered = students.filter(
    (s) =>
      s.classGroup === selectedClass &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-health/10">
            <Heart className="h-5 w-5 text-health" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-card-foreground">Student Health Records</h2>
            <p className="text-sm text-muted-foreground">Manage health information for {students.length} students</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-9 rounded-lg border border-input bg-secondary/50 pl-9 pr-3 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 rounded-lg border border-input bg-secondary/50 px-3 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
        </div>
      </div>

      {/* Student list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border">
            <p className="text-sm text-muted-foreground">No students found</p>
          </div>
        ) : (
          filtered.map((student) => (
            <StudentCard 
            key={student.id} 
            student={student} 
            onUpdate={onUpdateStudent} 
            onDelete={onDeleteStudent}
            />
          ))
        )}
      </div>
    </section>

    <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddStudent}
        selectedClass={selectedClass}
      />
    </>
  );
};

export default StudentHealthRecords;
