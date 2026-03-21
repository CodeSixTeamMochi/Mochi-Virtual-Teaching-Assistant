import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2, Loader2, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Format: YYYY-MM-DD
  time: string;
  type: "lesson" | "activity" | "meeting" | "holiday";
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // New: Delete Confirmation States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const dateHasEvent = (date: Date) => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.some(e => e.date === dateStr);
  };

  const handleSaveEvent = async () => {
    if (!eventTitle.trim()) return;
    setIsSaving(true);
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const eventPayload = { title: eventTitle, date: dateStr, time: "All Day", type: "activity" };

    try {
      const url = isEditing ? `http://localhost:5000/api/events/${editingEventId}` : 'http://localhost:5000/api/events';
      const res = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      if (res.ok) {
        await fetchEvents();
        setIsModalOpen(false);
        setEventTitle("");
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Open the custom delete confirmation
  const triggerDelete = (id: string) => {
    setEventToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete) return;
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventToDelete}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchEvents();
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-nunito p-4 md:p-8 relative">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="hover:bg-white/50 rounded-xl">
          <ArrowLeft className="w-6 h-6 text-[#1e293b]" />
        </Button>
        <div>
          <h1 className="text-2xl font-black text-[#1e293b]">Calendar & Events</h1>
          <p className="text-sm font-bold text-[#0891b2]">Manage your schedule with Mochi AI</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SMALL CALENDAR */}
        <Card className="lg:col-span-6 p-6 rounded-[2rem] shadow-sm border-none bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-[#1e293b]">
              {currentDate.toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => <div key={day} className="text-center text-[11px] font-black text-slate-400 py-1">{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((date, index) => {
              const hasEvent = date && dateHasEvent(date);
              const isSelected = date && isSameDay(date, selectedDate);
              return (
                <button
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  className={cn(
                    "aspect-square rounded-xl text-sm font-black flex items-center justify-center transition-all",
                    !date && "invisible",
                    date && !hasEvent && "text-[#1e293b] bg-slate-50 hover:bg-[#cffafe]",
                    hasEvent && "bg-[#ecfeff] text-[#0891b2] border border-[#a5f3fc]",
                    isSelected && "bg-[#0891b2] text-white ring-2 ring-[#0891b2]/20"
                  )}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>
        </Card>

        {/* SCROLLABLE EVENTS LIST */}
        <div className="lg:col-span-5 flex flex-col max-h-[500px]">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4 px-2">Upcoming</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {isLoading ? (
              <Loader2 className="animate-spin mx-auto text-[#0891b2]" />
            ) : events.map((event) => (
              <div key={event.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ecfeff] flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-[#0891b2] uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString("en-US", { month: 'short' })}</span>
                    <span className="text-sm font-black text-[#0891b2]">{new Date(event.date + 'T00:00:00').getDate()}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#1e293b]">{event.title}</h4>
                    <p className="text-[11px] font-bold text-slate-400">All Day</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
                    setEventTitle(event.title);
                    setEditingEventId(event.id);
                    setIsEditing(true);
                    setIsModalOpen(true);
                  }}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => triggerDelete(event.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#1e293b]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl border-none text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-[#1e293b] mb-2">Delete Event?</h2>
            <p className="text-sm font-bold text-slate-400 mb-8 px-4">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 rounded-xl py-6 font-black" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button className="flex-1 rounded-xl py-6 font-black bg-red-500 hover:bg-red-600 text-white" onClick={confirmDelete} disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" /> : "Delete"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1e293b]/40 backdrop-blur-sm p-4">
          <Card className="w-full max-w-sm p-6 rounded-[2rem] shadow-2xl animate-in zoom-in-95 border-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#1e293b]">{isEditing ? "Edit" : "New"} Event</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}><X /></Button>
            </div>
            <input
              autoFocus
              className="w-full p-4 bg-slate-50 rounded-xl mb-6 outline-none text-sm font-bold"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />
            <Button className="w-full rounded-xl py-6 text-sm font-black bg-[#0891b2] text-white" onClick={handleSaveEvent} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" /> : "Save Event"}
            </Button>
          </Card>
        </div>
      )}

      <Button
        onClick={() => { setIsEditing(false); setEventTitle(""); setIsModalOpen(true); }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-[#0891b2] text-white shadow-lg transition-all z-20"
      >
        <Plus className="w-6 h-6" strokeWidth={4} />
      </Button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default CalendarPage;