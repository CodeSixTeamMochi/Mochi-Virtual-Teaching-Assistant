import { useState, useEffect } from "react";
import { Heart, Search, Plus } from "lucide-react";
import { Student } from "@/Data/mockData";
import StudentCard from "./StudentCard";
import StudentHealthModal from "./StudentHealthModal";
import { classroomsAPI } from "@/services/api";

interface Props {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
}

const StudentHealthRecords = ({ students, onAddStudent }: Props) => {
  const [search, setSearch] = useState("");
  // FIXED: Default to "All Classes" so the invisible filter is removed!
  const [selectedClass, setSelectedClass] = useState("All Classes"); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch classrooms from database on mount
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        const classroomsData = await classroomsAPI.getAll();
        // Handle different possible DB column names (name vs room_number)
        const classNames = classroomsData.map((c: any) => c.name || c.room_number || c.classGroup);
        setClassOptions(classNames.filter(Boolean));
      } catch (err) {
        console.error("Error fetching classrooms:", err);
        setClassOptions(["Class A", "Class B"]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassrooms();
  }, []);

  // FIXED: We now show students if "All Classes" is selected OR if it matches
  const filtered = students.filter(
    (s) =>
      (selectedClass === "All Classes" || s.classGroup === selectedClass) &&
      s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Find students who don't have health data yet for the Add Modal
  const availableStudents = students.filter(
    (s) => (!s.allergies || s.allergies.length === 0) && (!s.medicines || s.medicines.length === 0)
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
              <p className="text-sm text-muted-foreground">
                Manage health information for {students.length} students
              </p>
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
              {/* FIXED: Added the All Classes option */}
              <option value="All Classes">All Classes</option>
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
          {loading ? (
            <div className="flex h-24 items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filtered.length === 0 ? (
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