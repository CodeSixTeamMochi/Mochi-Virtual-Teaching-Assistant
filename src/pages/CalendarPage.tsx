import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "lesson" | "activity" | "meeting" | "holiday";
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('mochi_events');
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Hesandu's Birthday", date: "2026-02-16", time: "All Day", type: "holiday" },
      { id: "2", title: "Cultural Day", date: "2026-02-18", time: "9:00 AM", type: "activity" },
    ];
  });

  useEffect(() => {
    localStorage.setItem('mochi_events', JSON.stringify(events));
  }, [events]);

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

  const handleOpenAdd = () => {
    setEventTitle("");
    setIsEditing(false);
    setEditingEventId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: CalendarEvent) => {
    setEventTitle(event.title);
    setIsEditing(true);
    setEditingEventId(event.id);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return;

    if (isEditing && editingEventId) {
      setEvents(prev => prev.map(e =>
        e.id === editingEventId ? { ...e, title: eventTitle } : e
      ));
    } else {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title: eventTitle,
        date: dateStr,
        time: "All Day",
        type: eventTitle.toLowerCase().includes("birthday") ? "holiday" : "lesson",
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setEventTitle("");
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingEventId(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="min-h-screen bg-background font-nunito p-6 md:p-10 relative">
      <header className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Calendar & Events</h1>
          <p className="text-muted-foreground font-medium">Create and manage your lessons using Mochi AI</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Card className="lg:col-span-7 p-8 rounded-[2.5rem] shadow-sm border-none bg-card">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold text-muted-foreground">
              {currentDate.toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-sm font-bold text-muted-foreground py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((date, index) => {
              const hasEvent = date && dateHasEvent(date);
              const isSelected = date && isSameDay(date, selectedDate);
              return (
                <button
                  key={index}
                  onClick={() => date && setSelectedDate(date)}
                  className={cn(
                    "aspect-square rounded-2xl text-lg font-bold flex items-center justify-center transition-all duration-200",
                    !date && "invisible",
                    date && !hasEvent && "text-foreground bg-secondary hover:bg-muted",
                    hasEvent && "bg-destructive/15 text-destructive",
                    isSelected && "ring-4 ring-primary/20 scale-105"
                  )}
                >
                  {date?.getDate()}
                </button>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xl font-bold text-muted-foreground px-2">Upcoming Events</h3>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-card p-5 rounded-3xl shadow-sm border border-border/50 flex items-center justify-between group">
                <div>
                  <h4 className="text-lg font-bold text-foreground">{event.title}</h4>
                  <p className="text-muted-foreground font-medium">
                    {new Date(event.date + 'T00:00:00').toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleOpenEdit(event)}>
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="h-20 border-2 border-dashed border-border rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={handleOpenAdd}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-2xl bg-primary hover:bg-primary/80 shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
      </Button>

      {/* Add/Edit Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4 animate-fade-in">
          <Card className="w-full max-w-md p-6 rounded-[2rem] shadow-2xl animate-scale-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{isEditing ? "Edit Event" : "Add Event"}</h2>
              <Button variant="ghost" size="icon" onClick={() => { setIsModalOpen(false); setIsEditing(false); setEditingEventId(null); }}>
                <X />
              </Button>
            </div>
            <input
              autoFocus
              className="w-full p-4 bg-secondary/30 rounded-2xl mb-4 outline-none focus:ring-2 ring-primary text-foreground"
              placeholder="Event Title (e.g. Sara's Birthday)"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEvent()}
            />
            {!isEditing && (
              <p className="text-sm text-muted-foreground mb-4 px-1">
                Date: {selectedDate.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            )}
            <Button className="w-full rounded-2xl py-6 bg-primary font-bold" onClick={handleSaveEvent}>
              {isEditing ? "Save Changes" : "Save Event"}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
