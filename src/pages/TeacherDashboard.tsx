import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';

// --- TYPES FOR BACKEND DATA ---
interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  activitiesDone: number;
  pendingMsgs: number;
}

interface ScheduleItem {
  id: number;
  time: string;
  title: string;
  type: string;
  typeColor: string;
  typeBg: string;
  dotColor: string;
}

interface Announcement {
  id: number;
  title: string;
  time: string;
  dotColor: string;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [time, setTime] = useState('--:-- --');
  const [greeting, setGreeting] = useState('Good afternoon');
  const [announcementText, setAnnouncementText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DYNAMIC STATE VARIABLES ---
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  // Live Clock & Greeting Logic
  useEffect(() => {
    const tick = () => {
      const n = new Date();
      const h = n.getHours();
      const m = n.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hh = h % 12 || 12;
      setTime(`${hh}:${String(m).padStart(2, '0')} ${ampm}`);
      setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // --- FETCH DATA FROM FLASK BACKEND ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, scheduleRes, announcementsRes] = await Promise.all([
          fetch('http://localhost:5000/api/dashboard/stats'),
          fetch('http://localhost:5000/api/dashboard/today-schedule'),
          fetch('http://localhost:5000/api/dashboard/announcements')
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (scheduleRes.ok) setSchedule(await scheduleRes.json());
        if (announcementsRes.ok) setAnnouncements(await announcementsRes.json());
      } catch (error) {
        console.error("Error connecting to Flask backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- HANDLERS (Moved outside of useEffect) ---
  const handlePublishAnnouncement = async () => {
    if (!announcementText.trim()) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://127.0.0.1:5000/api/dashboard/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: announcementText })
      });
      
      if (res.ok) {
        const newAnn = await res.json();
        setAnnouncements(prev => [{
          id: newAnn.id, 
          title: newAnn.title, 
          time: newAnn.time, 
          dotColor: "bg-[#06b6d4]" 
        }, ...prev]);
        setAnnouncementText(''); 
      }
    } catch (error) {
      console.error("Failed to publish announcement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/dashboard/announcements/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAnnouncements(prev => prev.filter(ann => ann.id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEdit = (ann: Announcement) => {
  setEditingId(ann.id);
  setEditText(ann.title);
};

const handleCancelEdit = () => {
  setEditingId(null);
  setEditText('');
};

const handleSaveEdit = async (id: number) => {
  if (!editText.trim()) return;
  try {
    const res = await fetch(`http://localhost:5000/api/dashboard/announcements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: editText }),
    });
    if (res.ok) {
      setAnnouncements(prev => prev.map(item => 
        item.id === id ? { ...item, title: editText } : item
      ));
      setEditingId(null);
    }
  } catch (err) {
    console.error("Update failed:", err);
  }
};

  const handleLogout = () => navigate('/login');
  const scrollToComms = () => document.getElementById('parent-comms')?.scrollIntoView({ behavior: 'smooth' });

  if (isLoading) {
    return <div className="min-h-screen bg-[#edf2f7] flex items-center justify-center text-[#0891b2] font-bold">Mochi Dashboard Waking Up...</div>;
  }

  return (
    <div className="min-h-screen bg-[#edf2f7] text-[#334155] font-sans pb-10">
      
      {/* ================= TOPBAR ================= */}
      <div className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between py-3 px-6 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#cffafe] flex items-center justify-center border-2 border-[#a5f3fc] text-[22px] shrink-0">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden border-2 border-[#a5f3fc] shrink-0">
                <img src="src\assets\mochi-mascot.jpeg" alt="Mochi Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div className="text-[17px] font-black text-[#1e293b] font-nunito">Mochi Dashboard</div>
              <div className="text-[12px] font-bold text-[#0891b2] flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{greeting}</span> ☀️, Teacher!
              </div>
            </div>
          </div>

          <div className="flex gap-1">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold bg-[#cffafe] text-[#0e7490] transition-colors">Dashboard</button>
            <button onClick={() => navigate('/timetable')} className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition-colors">Timetable</button>
            <button onClick={() => navigate('/students')} className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition-colors">Students</button>
            
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748b] bg-[#f1f5f9] px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{time}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[9px] text-[13px] font-bold text-[#475569] bg-[#f1f5f9] border-[1.5px] border-[#e2e8f0] hover:bg-[#e2e8f0] hover:text-[#1e293b] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto animate-[fadeUp_0.3s_ease_both]">
        <div className="bg-gradient-to-r from-[#bde8f5] via-[#cff0f8] to-[#d8f5f2] rounded-[20px] pt-7 px-9 pb-0 flex items-end justify-between mb-6 overflow-hidden relative shadow-[0_2px_16px_rgba(14,116,144,0.12)] min-h-[190px]">
          <div className="absolute top-[-20px] left-[-20px] w-[220px] h-[220px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18)_0%,transparent_65%)] pointer-events-none"></div>
          <div className="pb-7 relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/60 border border-white/90 rounded-full px-3 py-1 text-[11px] font-bold text-[#0e7490] mb-2.5 backdrop-blur-sm">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              AI Teaching Assistant
            </div>
            <div className="text-[28px] font-black text-[#0e7490] leading-[1.18] mb-1.5 font-nunito">I'm Mochi, your AI<br/>teaching assistant!</div>
            <div className="text-[13px] font-bold text-[#0891b2]">I'm here to help you 🌟</div>
            <div className="flex gap-2 mt-3.5 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 rounded-full px-3 py-1 text-[11px] font-bold text-[#0e7490] backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                Kindergarten A · {stats?.totalStudents || 0} Students
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 rounded-full px-3 py-1 text-[11px] font-bold text-[#0e7490] backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Ages 4–5 · Week 12
              </div>
            </div>
          </div>
          <div className="w-[155px] shrink-0 flex items-end justify-center relative z-10">
            <div className="text-[96px] leading-none animate-[float_3.2s_ease-in-out_infinite] drop-shadow-[0_8px_16px_rgba(14,116,144,0.2)]">
              <div className="w-[180px] shrink-0 flex items-end justify-center relative z-10 pb-2"> {/* Added pb-2 for animation clearance */}
                <img 
                  src="src\assets\mochi-avatar-gif.gif" 
                  alt="Mochi Mascot" 
                  className="w-full h-auto animate-[float_3.2s_ease-in-out_infinite] drop-shadow-[0_8px_16px_rgba(14,116,144,0.2)]" 
                />  
            </div>
            </div>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-4 gap-3.5 mb-6">
          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#ccfbf1] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Total Students</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">{stats?.totalStudents || 0}</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">{stats?.presentToday || 0} present today</div>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#dcfce7] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Activities Done</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">{stats?.activitiesDone || 0}</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">Daily goal updated</div>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#ffedd5] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Pending Reminders</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">{stats?.pendingMsgs || 0}</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">Parent messages</div>
            </div>
          </div>
          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#fef9c3] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Revision Games</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">5</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">Ready to play</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-5 items-start">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3.5 h-[24px] shrink-0">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Quick Actions</div>
              
            </div>

            <div className="grid grid-cols-2 gap-3 h-[270px] shrink-0">
              <div onClick={() => navigate('/activities')} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9333ea] to-[#a78bfa] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#c084fc] to-[#9333ea] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Revision Games</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Do some activities with kids</div>
                </div>
              </div>
              <div onClick={() => navigate('/LessonPlaneHome')} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#22d3ee] to-[#0d9488] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Start Lesson</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Create and manage lessons</div>
                </div>
              </div>
              <div onClick={() => navigate('/speech-reports')} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f97316] to-[#fb923c] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#fb923c] to-[#ea580c] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Speech Reports</div>
                  <div className="text-[12px] font-bold text-[#64748b]">View speech analysis reports</div>
                </div>
              </div>
              <div onClick={() => navigate('/calendar')} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#60a5fa] to-[#2563eb] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Calendar</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Manage your schedule</div>
                </div>
              </div>
              <div onClick={() => navigate('/health')} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#fb7185] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#fb7185] to-[#ef4444] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Health Data</div>
                  <div className="text-[12px] font-bold text-[#64748b]">View students health data</div>
                </div>
              </div>
              <div onClick={scrollToComms} className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#22d3ee] to-[#0d9488] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Parent Reminders</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Send notifications to parents</div>
                </div>
                {stats?.pendingMsgs ? <span className="bg-[#ef4444] text-white text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">{stats.pendingMsgs}</span> : null}
              </div>
            </div>

{/* --- RECENT ANNOUNCEMENTS --- */}
            <div className="flex items-center justify-between mt-6 mb-3.5 h-[24px] shrink-0">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Recent Announcements</div>
            </div>

            {/* Container Box */}
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm h-[270px] flex flex-col overflow-hidden shrink-0">
              <div className="p-[18px] overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1] [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="flex flex-col gap-[6px] pr-1">
                  {announcements.length === 0 ? (
                    <div className="text-center text-[#94a3b8] text-[13px] mt-4 font-bold">No recent announcements.</div>
                  ) : (
                    announcements.map((ann) => (
                      <div key={ann.id} className="group p-[10px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] transition-all">
                        {editingId === ann.id ? (
                          /* EDIT MODE UI */
                          <div className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 rounded-md border border-[#06b6d4] text-[13px] outline-none"
                              autoFocus
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={handleCancelEdit} className="text-[11px] font-bold text-slate-400">Cancel</button>
                              <button onClick={() => handleSaveEdit(ann.id)} className="text-[11px] font-bold text-[#06b6d4]">Save Changes</button>
                            </div>
                          </div>
                        ) : (
                          /* NORMAL VIEW UI */
                          <div className="flex items-center justify-between">
                            <div className="flex gap-[10px]">
                              <div className={`w-[9px] h-[9px] rounded-full ${ann.dotColor || 'bg-[#06b6d4]'} mt-[4px] shrink-0`}></div>
                              <div>
                                <div className="text-[13px] font-bold text-[#1e293b]">{ann.title}</div>
                                <div className="text-[11px] text-[#94a3b8] mt-[2px]">{ann.time}</div>
                              </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(ann)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-[#06b6d4] transition-colors">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => handleDelete(ann.id)} className="p-1 hover:bg-white rounded text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div> 
          </div> {/* This closes the left column (Quick Actions + Announcements) */}

          <div className="flex flex-col">
            <div className="h-[24px] mb-3.5 shrink-0"></div>
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm h-[270px] flex flex-col shrink-0 overflow-hidden">
              <div className="p-[14px_18px] border-b border-[#f1f5f9] flex items-center justify-between shrink-0">
                <div className="text-[14px] font-extrabold text-[#1e293b] flex items-center gap-[7px] font-nunito">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Today's Schedule
                </div>
                <span onClick={() => navigate('/calendar')} className="text-[11px] font-bold text-[#0891b2] cursor-pointer bg-[#ecfeff] border border-[#cffafe] px-[9px] py-[3px] rounded-full hover:bg-[#cffafe] transition-colors">
                  ✎ Edit Schedule
                </span>
              </div>
              <div className="p-[14px_18px] overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#cbd5e1] [&::-webkit-scrollbar-thumb]:rounded-full">
                <div className="flex flex-col gap-[5px] pr-1">
                  {schedule.length === 0 ? (
                    <div className="text-center p-[24px_16px] text-[#94a3b8] text-[13px] font-bold">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-25 block mx-auto mb-2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      Nothing scheduled for today! 🌟
                    </div>
                  ) : (
                  schedule.map((item) => (
                    <div key={item.id} className="flex items-center gap-2.5 p-[8px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] hover:border-[#a5f3fc] transition-colors group">
                      {/* Dynamic Time from Calendar */}
                      <div className="text-[11px] font-bold text-[#94a3b8] w-[84px] shrink-0">{item.time}</div>
                      
                      {/* Status Dot using Backend Color */}
                      <div className={`w-2 h-2 rounded-full ${item.dotColor || 'bg-[#06b6d4]'} shrink-0 shadow-sm`} />
                      
                      <div className="text-[13px] font-bold text-[#1e293b] flex-1 truncate">{item.title}</div>
                      
                      {/* Category Tag */}
                      <span className={`text-[10px] font-black uppercase tracking-tight rounded-full px-2 py-0.5 ${item.typeBg || 'bg-[#cffafe]'} ${item.typeColor || 'text-[#0e7490]'}`}>
                        {item.type}
                      </span>
                    </div>
                  ))
                )}
                </div>
              </div>
            </div>

            <div id="parent-comms" className="flex items-center justify-between mt-6 mb-3.5 h-[24px] shrink-0">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Parent Communication</div>
            </div>

            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm h-[270px] flex flex-col shrink-0 overflow-hidden">
              <div className="p-[18px] flex flex-col h-full">
                <div>
                  <label className="text-[12px] font-bold text-[#334155] block mb-[5px]">📢 Things to bring tomorrow</label>
                  <div className="flex gap-[7px]">
                    <input type="text" placeholder="Type a reminder…" className="flex-1 p-[9px_12px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#1e293b] focus:border-[#06b6d4] focus:bg-white transition-colors outline-none" />
                    <button className="flex items-center justify-center gap-[6px] px-[15px] py-[8px] rounded-[9px] text-[13px] font-bold bg-gradient-to-br from-[#06b6d4] to-[#0d9488] text-white hover:brightness-110 hover:-translate-y-[1px] transition-all shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send
                    </button>
                  </div>
                </div>
                <div className="h-[1px] bg-[#e2e8f0] my-3.5 shrink-0"></div>
                <div className="flex flex-col flex-1 min-h-0">
                  <label className="text-[12px] font-bold text-[#334155] block mb-[5px]">📣 Class Announcement</label>
                  <textarea 
                    value={announcementText} 
                    onChange={(e) => setAnnouncementText(e.target.value)} 
                    placeholder="Write an announcement for all parents…" 
                    className="flex-1 w-full resize-none p-[9px_12px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#1e293b] focus:border-[#06b6d4] focus:bg-white transition-colors outline-none leading-[1.5]"
                  ></textarea>
                  <button 
                    onClick={handlePublishAnnouncement} 
                    disabled={isSubmitting || !announcementText.trim()}
                    className="w-full mt-[10px] shrink-0 flex items-center justify-center gap-[6px] px-[15px] py-[8px] rounded-[9px] text-[13px] font-bold bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> 
                    {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}