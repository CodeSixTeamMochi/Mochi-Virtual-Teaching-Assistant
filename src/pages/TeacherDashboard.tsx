import { useState, useEffect } from 'react';

export default function TeacherDashboard() {
  const [time, setTime] = useState('--:-- --');
  const [greeting, setGreeting] = useState('Good afternoon');

  // Live Clock & Greeting Logic (translated from your JS)
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

  return (
    <div className="min-h-screen bg-[#edf2f7] text-[#334155] font-sans pb-10">
      
      {/* ================= TOPBAR ================= */}
      <div className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between py-3 px-6 max-w-[1200px] mx-auto">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-[42px] h-[42px] rounded-full bg-[#cffafe] flex items-center justify-center border-2 border-[#a5f3fc] text-[22px] shrink-0">
              🐣
            </div>
            <div>
              <div className="text-[17px] font-black text-[#1e293b] font-nunito">Mochi Dashboard</div>
              <div className="text-[12px] font-bold text-[#0891b2] flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>{greeting}</span> ☀️, Teacher!
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex gap-1">
            <button className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold bg-[#cffafe] text-[#0e7490] transition-colors">Dashboard</button>
            <button className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition-colors">Timetable</button>
            <button className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition-colors">Students</button>
            <button className="px-3.5 py-1.5 rounded-[9px] text-[13px] font-bold text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b] transition-colors">Health Data</button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#64748b] bg-[#f1f5f9] px-3 py-1.5 rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>{time}</span>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[9px] text-[13px] font-bold text-[#475569] bg-[#f1f5f9] border-[1.5px] border-[#e2e8f0] hover:bg-[#e2e8f0] hover:text-[#1e293b] transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="p-6 max-w-[1200px] mx-auto animate-[fadeUp_0.3s_ease_both]">
        
        {/* HERO BANNER */}
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
                Kindergarten A · 20 Students
              </div>
              <div className="flex items-center gap-1.5 bg-white/60 border border-white/80 rounded-full px-3 py-1 text-[11px] font-bold text-[#0e7490] backdrop-blur-sm">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Ages 4–5 · Week 12
              </div>
            </div>
          </div>

          <div className="w-[155px] shrink-0 flex items-end justify-center relative z-10">
            <div className="text-[96px] leading-none animate-[float_3.2s_ease-in-out_infinite] drop-shadow-[0_8px_16px_rgba(14,116,144,0.2)]">🐱</div>
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
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">20</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">18 present today</div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#dcfce7] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Activities Done</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">13</div>
              <div className="text-[11px] text-[#94a3b8] mt-[1px]">5 remaining today</div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.05)] border border-[#e2e8f0] flex items-center gap-3.5 hover:-translate-y-0.5 hover:shadow-md transition-all">
            <div className="w-11 h-11 rounded-[11px] bg-[#ffedd5] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wide">Pending Reminders</div>
              <div className="text-[26px] font-black text-[#1e293b] leading-[1.1] font-nunito">3</div>
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

        {/* BODY GRID */}
        <div className="grid grid-cols-[1fr_320px] gap-5">
          
          {/* LEFT COLUMN */}
          <div>
            {/* Quick Actions Header */}
            <div className="flex items-center justify-between mb-3.5">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Quick Actions</div>
              <button className="text-[12px] font-bold text-[#0891b2] hover:text-[#0f766e] flex items-center gap-[3px]">
                View all <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5.5">
              
              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#9333ea] to-[#a78bfa] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#c084fc] to-[#9333ea] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Revision Games</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Do some activities with kids</div>
                </div>
                <span className="bg-[#ef4444] text-white text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">5</span>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#22d3ee] to-[#0d9488] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Start Lesson</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Create and manage lessons</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#f97316] to-[#fb923c] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#fb923c] to-[#ea580c] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Speech Reports</div>
                  <div className="text-[12px] font-bold text-[#64748b]">View speech analysis reports</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#60a5fa] to-[#2563eb] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Calendar</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Manage your schedule</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ef4444] to-[#fb7185] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#fb7185] to-[#ef4444] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Health Data</div>
                  <div className="text-[12px] font-bold text-[#64748b]">View students health data</div>
                </div>
              </div>

              <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[17px_19px] flex items-center gap-3.5 relative overflow-hidden group hover:-translate-y-[3px] hover:shadow-lg transition-all cursor-pointer">
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-12 h-12 rounded-[13px] bg-gradient-to-br from-[#22d3ee] to-[#0d9488] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-extrabold text-[#1e293b] mb-[2px] font-nunito">Parent Reminders</div>
                  <div className="text-[12px] font-bold text-[#64748b]">Send notifications to parents</div>
                </div>
                <span className="bg-[#ef4444] text-white text-[10px] font-bold rounded-full px-2 py-0.5 shrink-0">3</span>
              </div>
            </div>

            {/* Today's Schedule Header */}
            <div className="flex items-center justify-between mt-5 mb-3.5">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Today's Schedule</div>
              <button className="text-[12px] font-bold text-[#0891b2] hover:text-[#0f766e] flex items-center gap-[3px]">
                Full timetable <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Today's Schedule List */}
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm p-[18px]">
              <div className="flex flex-col gap-[5px]">
                <div className="flex items-center gap-2.5 p-[8px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] hover:border-[#a5f3fc] transition-colors">
                  <div className="text-[11px] font-bold text-[#94a3b8] w-[84px] shrink-0">08:00 – 09:00</div>
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4] shrink-0"></div>
                  <div className="text-[13px] font-bold text-[#1e293b] flex-1">Morning Circle</div>
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-[#cffafe] text-[#0e7490]">Activity</span>
                </div>
                <div className="flex items-center gap-2.5 p-[8px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] hover:border-[#a5f3fc] transition-colors">
                  <div className="text-[11px] font-bold text-[#94a3b8] w-[84px] shrink-0">09:00 – 10:00</div>
                  <div className="w-2 h-2 rounded-full bg-[#9333ea] shrink-0"></div>
                  <div className="text-[13px] font-bold text-[#1e293b] flex-1">Creative Writing</div>
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-[#f3e8ff] text-[#7e22ce]">Lesson</span>
                </div>
                <div className="flex items-center gap-2.5 p-[8px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] hover:border-[#a5f3fc] transition-colors">
                  <div className="text-[11px] font-bold text-[#94a3b8] w-[84px] shrink-0">10:00 – 10:30</div>
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] shrink-0"></div>
                  <div className="text-[13px] font-bold text-[#1e293b] flex-1">Snack Time</div>
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-[#dcfce7] text-[#15803d]">Break</span>
                </div>
                <div className="flex items-center gap-2.5 p-[8px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] hover:border-[#a5f3fc] transition-colors">
                  <div className="text-[11px] font-bold text-[#94a3b8] w-[84px] shrink-0">10:30 – 11:30</div>
                  <div className="w-2 h-2 rounded-full bg-[#06b6d4] shrink-0"></div>
                  <div className="text-[13px] font-bold text-[#1e293b] flex-1">PE & Movement</div>
                  <span className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-[#cffafe] text-[#0e7490]">Activity</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-3.5">
            
            {/* Overview Today Box */}
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm mb-[-1px] overflow-hidden">
              <div className="p-[14px_18px] border-b border-[#f1f5f9] flex items-center justify-between">
                <div className="text-[14px] font-extrabold text-[#1e293b] flex items-center gap-[7px] font-nunito">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Today's Schedule
                </div>
                <span className="text-[11px] font-bold text-[#0891b2] cursor-pointer bg-[#ecfeff] border border-[#cffafe] px-[9px] py-[3px] rounded-full">✎ Edit Schedule</span>
              </div>
              <div className="hidden text-center p-[24px_16px] text-[#94a3b8] text-[13px] font-bold">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-25 block mx-auto mb-2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                No activities for today.
              </div>
            </div>

            {/* Total Students (Green Box) */}
            <div className="rounded-[14px] p-[17px_19px] mb-[-2px] bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] border border-[#bbf7d0]">
              <div className="text-[12px] font-bold text-[#64748b] mb-1">Total Students</div>
              <div className="text-[30px] font-black text-[#1e293b] font-nunito leading-none">20</div>
              <div className="text-[11px] text-[#15803d] mt-[3px] font-bold">18 present · 2 absent today</div>
            </div>

            {/* Activities Done (Yellow Box) */}
            <div className="rounded-[14px] p-[17px_19px] bg-gradient-to-br from-[#fefce8] to-[#fef9c3] border border-[#fde68a]">
              <div className="text-[12px] font-bold text-[#64748b] mb-1">Activities Done</div>
              <div className="text-[30px] font-black text-[#1e293b] font-nunito leading-none">13</div>
              <div className="text-[11px] text-[#92400e] mt-[3px] font-bold">5 remaining for today</div>
            </div>

            {/* Parent Communication */}
            <div className="flex items-center justify-between mb-[-4px] mt-1">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Parent Communication</div>
            </div>
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="p-[18px] flex flex-col gap-3.5">
                <div>
                  <label className="text-[12px] font-bold text-[#334155] block mb-[5px]">📢 Quick Reminder</label>
                  <div className="flex gap-[7px]">
                    <input type="text" placeholder="Type a reminder…" className="flex-1 p-[9px_12px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#1e293b] focus:border-[#06b6d4] focus:bg-white transition-colors outline-none" />
                    <button className="flex items-center justify-center gap-[6px] px-[15px] py-[8px] rounded-[9px] text-[13px] font-bold bg-gradient-to-br from-[#06b6d4] to-[#0d9488] text-white hover:brightness-110 hover:-translate-y-[1px] transition-all">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send
                    </button>
                  </div>
                </div>
                <div className="h-[1px] bg-[#e2e8f0] my-1"></div>
                <div>
                  <label className="text-[12px] font-bold text-[#334155] block mb-[5px]">📣 Class Announcement</label>
                  <textarea placeholder="Write an announcement for all parents…" className="w-full h-[70px] resize-none p-[9px_12px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] text-[13px] text-[#1e293b] focus:border-[#06b6d4] focus:bg-white transition-colors outline-none leading-[1.5]"></textarea>
                  <button className="w-full mt-2 flex items-center justify-center gap-[6px] px-[15px] py-[8px] rounded-[9px] text-[13px] font-bold bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white hover:brightness-110 hover:-translate-y-[1px] transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 11l19-9-9 19-2-8-8-2z"/></svg> Publish Announcement
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="flex items-center justify-between mb-[-4px] mt-1">
              <div className="text-[15px] font-extrabold text-[#1e293b] font-nunito">Recent Announcements</div>
            </div>
            <div className="bg-white rounded-[14px] border border-[#e2e8f0] shadow-sm overflow-hidden">
              <div className="p-[18px]">
                <div className="flex flex-col gap-[6px]">
                  <div className="flex gap-[10px] p-[10px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] transition-colors">
                    <div className="w-[9px] h-[9px] rounded-full bg-[#06b6d4] mt-[4px] shrink-0"></div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1e293b]">Field trip permission slips due</div>
                      <div className="text-[11px] text-[#94a3b8] mt-[2px]">Today · 9:15 AM</div>
                    </div>
                  </div>
                  <div className="flex gap-[10px] p-[10px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] transition-colors">
                    <div className="w-[9px] h-[9px] rounded-full bg-[#ea580c] mt-[4px] shrink-0"></div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1e293b]">Friday Show & Tell reminder</div>
                      <div className="text-[11px] text-[#94a3b8] mt-[2px]">Yesterday · 3:00 PM</div>
                    </div>
                  </div>
                  <div className="flex gap-[10px] p-[10px_12px] rounded-[9px] bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#ecfeff] transition-colors">
                    <div className="w-[9px] h-[9px] rounded-full bg-[#22c55e] mt-[4px] shrink-0"></div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1e293b]">PE footwear reminder sent</div>
                      <div className="text-[11px] text-[#94a3b8] mt-[2px]">Monday · 8:30 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}