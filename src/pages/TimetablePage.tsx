import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Plus, Download, BookOpen, Clock, Star, X, 
  Trash2, Loader2, Pencil, Palette, Gamepad2, Coffee, AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimeSlot {
  id: number;
  day: string;
  time_from: string;
  time_to: string;
  subject: string;
  type: "Lesson" | "Activity" | "Break" | "Play";
}

interface WeeklyNote {
  id: number;
  content: string;
}

const TimetablePage = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [notes, setNotes] = useState<WeeklyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const todayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Custom Delete Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{show: boolean, type: 'slot' | 'note', id: number | null}>({
    show: false, type: 'slot', id: null
  });

  const [currentSlot, setCurrentSlot] = useState<Partial<TimeSlot>>({
    day: "Monday", type: "Lesson", time_from: "08:00", time_to: "09:00", subject: ""
  });

  const [noteInput, setNoteInput] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  // ICON MAPPING FOR TYPES
  const typeConfigs = {
    Lesson: { color: "bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]", icon: <BookOpen size={14} /> },
    Activity: { color: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]", icon: <Palette size={14} /> },
    Break: { color: "bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]", icon: <Coffee size={14} /> },
    Play: { color: "bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]", icon: <Gamepad2 size={14} /> },
  };

  const fetchData = async () => {
    try {
      const [slotsRes, notesRes] = await Promise.all([
        fetch('http://localhost:5000/api/timetable'),
        fetch('http://localhost:5000/api/timetable/notes')
      ]);
      if (slotsRes.ok) setSlots(await slotsRes.json());
      if (notesRes.ok) setNotes(await notesRes.json());
    } catch (err) { console.error("Fetch error:", err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- DELETE LOGIC ---
  const executeDelete = async () => {
    if (!deleteConfirm.id) return;
    setIsSaving(true);
    const url = deleteConfirm.type === 'slot' 
      ? `http://localhost:5000/api/timetable/${deleteConfirm.id}`
      : `http://localhost:5000/api/timetable/notes/${deleteConfirm.id}`;
    
    const res = await fetch(url, { method: 'DELETE' });
    if (res.ok) {
      await fetchData();
      setDeleteConfirm({ show: false, type: 'slot', id: null });
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const handleSaveSlot = async () => {
    if (!currentSlot.subject) return;
    setIsSaving(true);
    const url = isEditing ? `http://localhost:5000/api/timetable/${currentSlot.id}` : 'http://localhost:5000/api/timetable';
    const res = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentSlot)
    });
    if (res.ok) { await fetchData(); setIsModalOpen(false); }
    setIsSaving(false);
  };

  const handleSaveNote = async () => {
    if (!noteInput.trim()) return;
    const url = editingNoteId ? `http://localhost:5000/api/timetable/notes/${editingNoteId}` : 'http://localhost:5000/api/timetable/notes';
    const res = await fetch(url, {
      method: editingNoteId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: noteInput })
    });
    if (res.ok) { setNoteInput(""); setEditingNoteId(null); await fetchData(); }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-nunito p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-xl"><ArrowLeft className="mr-2" /> Back</Button>
          <h1 className="text-2xl font-black text-[#1e293b]">Weekly Timetable</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* TIMETABLE GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-5">
        {days.map((day) => (
          <div key={day} className="flex flex-col gap-4">
            <div className={cn("p-4 rounded-[1.2rem] text-center shadow-md", day === todayName ? "bg-[#F59E0B]" : "bg-[#0D9488]")}>
              <h3 className="text-white font-black text-xs uppercase flex items-center justify-center gap-2">
                {day} {day === todayName && <Star size={14} fill="white" />}
              </h3>
            </div>
            <div className={cn("bg-white rounded-[1.5rem] p-3 border min-h-[500px] flex flex-col gap-3", day === todayName ? "border-amber-200 bg-amber-50/20" : "border-slate-100")}>
              {slots.filter(s => s.day === day).sort((a,b) => a.time_from.localeCompare(b.time_from)).map(slot => (
                <div 
                  key={slot.id} 
                  onClick={() => { setCurrentSlot(slot); setIsEditing(true); setIsModalOpen(true); }}
                  className={cn("p-3.5 rounded-2xl border-l-[6px] transition-all hover:translate-x-1 cursor-pointer shadow-sm relative overflow-hidden", typeConfigs[slot.type].color)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] font-black opacity-70 uppercase flex items-center gap-1">
                      <Clock size={10} /> {slot.time_from} – {slot.time_to}
                    </div>
                    <div className="opacity-40">{typeConfigs[slot.type].icon}</div>
                  </div>
                  <div className="text-[13px] font-black">{slot.subject}</div>
                </div>
              ))}
              <button onClick={() => { setCurrentSlot({day, type: 'Lesson', time_from: '08:00', time_to: '09:00', subject: ''}); setIsEditing(false); setIsModalOpen(true); }} className="mt-auto py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-300 hover:text-[#0891b2] transition-all text-[10px] font-black uppercase"><Plus size={14} className="inline mr-1" /> Add slot</button>
            </div>
          </div>
        ))}
      </div>

      {/* WEEKLY NOTES */}
      <div className="max-w-7xl mx-auto mt-10">
        <Card className="p-8 rounded-[2.5rem] border-none shadow-sm bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Star className="text-amber-600 fill-amber-600" /></div>
            <h3 className="text-xl font-black text-[#1e293b]">Weekly Teacher Notes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="group flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                  <div className="flex items-start gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0891b2] mt-1.5 shrink-0" />
                    <p className="text-sm font-bold text-slate-500 italic">"{note.content}"</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingNoteId(note.id); setNoteInput(note.content); }} className="p-1.5 text-slate-400 hover:text-[#0891b2]"><Pencil size={14}/></button>
                    <button onClick={() => setDeleteConfirm({show: true, type: 'note', id: note.id})} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-3xl p-6 border-2 border-dashed border-slate-200 flex flex-col gap-4">
              <textarea className="w-full bg-transparent outline-none text-sm font-bold text-slate-600 h-24" placeholder="Type something important..." value={noteInput} onChange={(e) => setNoteInput(e.target.value)} />
              <Button onClick={handleSaveNote} className="rounded-xl bg-[#0891b2] text-white font-black h-12 shadow-md">
                {editingNoteId ? "Update Note" : "Save Note"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* CUSTOM DELETE MODAL */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1e293b]/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border-none text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-[#1e293b] mb-2">Delete this {deleteConfirm.type}?</h2>
            <p className="text-sm font-bold text-slate-400 mb-8 px-4">This action cannot be undone. Mochi will remove this permanently.</p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl py-6 font-black" onClick={() => setDeleteConfirm({show: false, type: 'slot', id: null})}>Cancel</Button>
              <Button className="flex-1 rounded-xl py-6 font-black bg-red-500 hover:bg-red-600 text-white" onClick={executeDelete} disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" /> : "Confirm Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* SLOT ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e293b]/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border-none">
            <div className="flex justify-between items-center mb-6 text-[#1e293b]">
              <h2 className="text-xl font-black">{isEditing ? "Edit" : "New"} Session</h2>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="rounded-full"><X /></Button>
            </div>
            <div className="space-y-4">
              <input className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none border-2 border-transparent focus:border-[#0891b2]" placeholder="Subject" value={currentSlot.subject} onChange={(e) => setCurrentSlot({...currentSlot, subject: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold" value={currentSlot.time_from} onChange={(e) => setCurrentSlot({...currentSlot, time_from: e.target.value})} />
                <input type="time" className="p-4 bg-slate-50 rounded-2xl text-sm font-bold" value={currentSlot.time_to} onChange={(e) => setCurrentSlot({...currentSlot, time_to: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(typeConfigs).map(t => (
                  <button key={t} onClick={() => setCurrentSlot({...currentSlot, type: t as any})} className={cn("py-3 rounded-xl text-[10px] font-black border-2 transition-all uppercase", currentSlot.type === t ? "border-[#0891b2] bg-cyan-50 text-[#0891b2]" : "border-slate-50 bg-white text-slate-300")}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              {isEditing && <Button variant="ghost" className="flex-1 text-red-400 font-black" onClick={() => setDeleteConfirm({show: true, type: 'slot', id: currentSlot.id!})}>Delete</Button>}
              <Button className="flex-[2] rounded-2xl py-6 bg-[#0891b2] text-white font-black" onClick={handleSaveSlot} disabled={isSaving}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TimetablePage;