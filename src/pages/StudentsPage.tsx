import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Student {
  id: number;
  name: string;
  status: string;
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate stats dynamically
  const presentCount = students.filter(s => s.status === 'Present').length;

  useEffect(() => {
    // Changed to localhost for consistency with Dashboard fix
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Error fetching students:", err));
  }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    
    // Optimistic UI update (Instant feedback)
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));

    try {
      const response = await fetch(`http://localhost:5000/api/students/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update");
    } catch (error) {
      console.error("Failed to update status", error);
      // Revert on failure so the UI stays synced with DB
      setStudents(prev => prev.map(s => s.id === id ? { ...s, status: currentStatus } : s));
    }
  };

  return (
    <div className="min-h-screen bg-[#edf2f7] text-[#334155] font-sans pb-10">
      
      {/* ================= TOPBAR ================= */}
      <div className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-50">
        <div className="p-4 px-6 flex justify-between items-center max-w-[1200px] mx-auto">
          <div className="text-[17px] font-black text-[#1e293b] font-nunito flex items-center gap-3">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="w-8 h-8 flex items-center justify-center hover:bg-[#f1f5f9] rounded-full transition-colors text-[#64748b]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            Student Roster
          </div>
          
          <div className="flex items-center gap-2 bg-[#dcfce7] text-[#15803d] px-3 py-1.5 rounded-full text-[12px] font-bold">
            <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
            {presentCount} / {students.length} Present Today
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto animate-[fadeUp_0.3s_ease_both]">
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#94a3b8]">
            <div className="w-10 h-10 border-4 border-[#0891b2] border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="font-bold">Loading Student Data...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div 
                key={student.id} 
                className="bg-white p-4 rounded-[16px] border border-[#e2e8f0] shadow-sm flex justify-between items-center hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[18px] group-hover:scale-110 transition-transform">
                    👤
                  </div>
                  <div className="font-bold text-[#1e293b] text-[15px]">{student.name}</div>
                </div>
                
                <button 
                  onClick={() => toggleStatus(student.id, student.status)}
                  className={`px-4 py-1.5 rounded-full text-[12px] font-bold transition-all active:scale-95 ${
                    student.status === 'Present' 
                      ? 'bg-[#dcfce7] text-[#16a34a] hover:bg-[#bbf7d0]' 
                      : 'bg-[#fee2e2] text-[#dc2626] hover:bg-[#fecaca]'
                  }`}
                >
                  {student.status}
                </button>
              </div>
            ))}
          </div>
        )}

        {!isLoading && students.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[20px] border border-dashed border-[#cbd5e1]">
             <div className="text-[40px] mb-2">🎓</div>
             <div className="text-[#64748b] font-bold">No students found in the database.</div>
          </div>
        )}
      </div>
    </div>
  );
}