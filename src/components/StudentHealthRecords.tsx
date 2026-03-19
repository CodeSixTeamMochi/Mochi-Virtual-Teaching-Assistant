import { useState } from "react";
import { Heart, Search, Plus } from "lucide-react";
import { Student } from "@/Data/mockData.ts";
import StudentCard from "./StudentCard";
import StudentHealthModal from "./StudentHealthModal";

interface Props {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
}

const classOptions = ["Class A", "Class B"];

const StudentHealthRecords = ({ students, onAddStudent }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("Class A");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockDatabaseStudents = [
    { id: "db-1", name: "Amaya Silva", parentPhone: "+94 77 111 2222", classGroup: "Class A" },
    { id: "db-2", name: "Dineth Fernando", parentPhone: "+94 77 222 3333", classGroup: "Class A" },
    { id: "db-3", name: "Lithmi Perera", parentPhone: "+94 77 333 4444", classGroup: "Class B" },
    { id: "db-4", name: "Ravindu Jayasinghe", parentPhone: "+94 77 444 5555", classGroup: "Class B" },
    { id: "db-5", name: "Tharusha Wickramasinghe", parentPhone: "+94 77 555 6666", classGroup: "Class A" },
    { id: "db-6", name: "Savindi Rajapaksa", parentPhone: "+94 77 666 7777", classGroup: "Class B" },
  ];

  const availableStudents = mockDatabaseStudents.filter(
    (dbStudent) => !students.find((s) => s.id === dbStudent.id)
  );
  
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
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="h-9 w-64 rounded-lg border border-input bg-secondary/50 pl-10 pr-3 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="h-9 w-40 rounded-lg border border-input bg-secondary/50 px-3 text-sm text-card-foreground outline-none focus:ring-1 focus:ring-ring"
          >
            {classOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
            />
          ))
        )}
      </div>
    </section>

    <StudentHealthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddStudent} 
        availableStudents={availableStudents}
      />
    </>
  );
};

export default StudentHealthRecords;
