import { useState, useEffect } from "react";
import { Heart, Search, Plus } from "lucide-react";
import { Student } from "@/Data/mockData.ts";
import StudentCard from "./StudentCard";
import StudentHealthModal from "./StudentHealthModal";
import { studentsAPI, classroomsAPI } from "@/services/api";

interface Props {
  students: Student[];
  onAddStudent: (newStudent: Student) => void;
}

const StudentHealthRecords = ({ students, onAddStudent }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Database students - FETCHING FROM DATABASE
  const [databaseStudents, setDatabaseStudents] = useState<Array<{
    id: string;
    name: string;
    parentPhone: string;
    classGroup: string;
  }>>([]);
  
  // Classrooms - FETCHING FROM DATABASE
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students and classrooms from database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch students
        const studentsData = await studentsAPI.getAll();
        setDatabaseStudents(studentsData);
        
        // Fetch classrooms
        const classroomsData = await classroomsAPI.getAll();
        const classNames = classroomsData.map((c: any) => c.name);
        setClassOptions(classNames);
        
        // Set default selected class to first classroom
        if (classNames.length > 0) {
          setSelectedClass(classNames[0]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data from database");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Filter out students already in health records
  const availableStudents = databaseStudents.filter(
    (dbStudent) => !students.find((s) => s.id === dbStudent.id)
  );
  
  // Filter students for display
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
              disabled={loading || error !== null}
            >
              {classOptions.length === 0 ? (
                <option value="">
                  {loading ? "Loading..." : error ? "Error loading" : "No classes"}
                </option>
              ) : (
                classOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={loading || error !== null}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
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
          ) : error ? (
            <div className="flex h-24 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border">
              <p className="text-sm text-destructive">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Retry
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                {students.length === 0 
                  ? "No students in health records yet. Click 'Add' to get started!" 
                  : "No students found in this class"}
              </p>
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
        classOptions={classOptions}
      />
    </>
  );
};

export default StudentHealthRecords;