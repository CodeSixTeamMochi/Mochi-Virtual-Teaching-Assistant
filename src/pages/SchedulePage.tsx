import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleEvent {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  description?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const SchedulePage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStartTime, setEventStartTime] = useState("09:00");
  const [eventEndTime, setEventEndTime] = useState("10:00");
  const [eventDescription, setEventDescription] = useState("");

  const [events, setEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('mochi_schedule_events');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync schedule events to mochi_events for dashboard
  useEffect(() => {
    localStorage.setItem('mochi_schedule_events', JSON.stringify(events));
    
    // Also merge into mochi_events for the dashboard ScheduleCard
    const calendarRaw = localStorage.getItem('mochi_events');
    const calendarEvents = calendarRaw ? JSON.parse(calendarRaw) : [];
    
    // Remove old schedule-sourced events
    const nonScheduleEvents = calendarEvents.filter((e: any) => !e.fromSchedule);
    
    // Convert schedule events to mochi_events format
    const scheduleAsMochi = events.map(e => ({
      id: 'sch_' + e.id,
      title: e.title,
      date: e.date,
      start: `${e.date}T${e.start}`,
      time: `${e.start} - ${e.end}`,
      type: "lesson" as const,
      fromSchedule: true,
    }));
    
    localStorage.setItem('mochi_events', JSON.stringify([...nonScheduleEvents, ...scheduleAsMochi]));
  }, [events]);

  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });

  const todayEvents = events.filter(e => e.date === dateStr);

  const prevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const nextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleOpenAdd = (hour?: number) => {
    setEventTitle("");
    setEventDescription("");
    setEventStartTime(hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : "09:00");
    setEventEndTime(hour !== undefined ? `${String(hour + 1).padStart(2, '0')}:00` : "10:00");
    setIsEditing(false);
    setEditingEventId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: ScheduleEvent) => {
    setEventTitle(event.title);
    setEventDescription(event.description || "");
    setEventStartTime(event.start);
    setEventEndTime(event.end);
    setIsEditing(true);
    setEditingEventId(event.id);
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!eventTitle.trim()) return;

    if (isEditing && editingEventId) {
      setEvents(prev => prev.map(e =>
        e.id === editingEventId
          ? { ...e, title: eventTitle, start: eventStartTime, end: eventEndTime, description: eventDescription }
          : e
      ));
    } else {
      const newEvent: ScheduleEvent = {
        id: String(Date.now()),
        title: eventTitle,
        date: dateStr,
        start: eventStartTime,
        end: eventEndTime,
        description: eventDescription,
      };
      setEvents(prev => [...prev, newEvent]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = () => {
    if (editingEventId) {
      setEvents(prev => prev.filter(e => e.id !== editingEventId));
    }
    setIsModalOpen(false);
  };

  const getEventPosition = (event: ScheduleEvent) => {
    const [startH, startM] = event.start.split(':').map(Number);
    const [endH, endM] = event.end.split(':').map(Number);
    const top = (startH + startM / 60) * 60; // 60px per hour
    const height = ((endH + endM / 60) - (startH + startM / 60)) * 60;
    return { top, height: Math.max(height, 30) };
  };

  return (
    <div className="min-h-screen bg-background font-nunito p-4 md:p-8">
      <header className="flex items-center justify-between mb-8 px-6 py-4 bg-card rounded-3xl shadow-soft border border-border/40 animate-slide-up">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Schedule</h1>
            <p className="text-sm text-muted-foreground">Edit Day Schedule</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevDay} className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-bold text-foreground">
            {currentDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <Button variant="ghost" size="icon" onClick={nextDay} className="rounded-full">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Day header */}
      <div className="text-center mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <h2 className="text-2xl font-bold text-foreground">{dayName}</h2>
        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mt-2 font-bold text-lg">
          {currentDate.getDate()}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-[2.5rem] shadow-soft border border-border/40 p-6 animate-slide-up relative" style={{ animationDelay: '0.1s' }}>
        <div className="relative" style={{ height: `${24 * 60}px` }}>
          {HOURS.map(hour => (
            <div
              key={hour}
              className="absolute w-full border-t border-border/30 flex cursor-pointer hover:bg-primary/5 transition-colors"
              style={{ top: `${hour * 60}px`, height: '60px' }}
              onClick={() => handleOpenAdd(hour)}
            >
              <span className={cn(
                "text-sm font-bold w-16 flex-shrink-0 pt-1",
                todayEvents.some(e => {
                  const [sh] = e.start.split(':').map(Number);
                  const [eh] = e.end.split(':').map(Number);
                  return hour >= sh && hour < eh;
                }) ? "text-primary" : "text-muted-foreground"
              )}>
                {String(hour).padStart(2, '0')}:00
              </span>
            </div>
          ))}

          {/* Events overlay */}
          {todayEvents.map(event => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                className="absolute left-16 right-4 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg"
                style={{
                  top: `${top}px`,
                  height: `${height}px`,
                  backgroundColor: 'hsl(145 60% 80%)',
                  borderLeft: '4px solid hsl(145 60% 45%)',
                }}
                onClick={(e) => { e.stopPropagation(); handleOpenEdit(event); }}
              >
                <p className="font-bold text-foreground text-sm">{event.title}</p>
                <p className="text-xs font-semibold text-foreground/70">{event.start} - {event.end}</p>
                {event.description && <p className="text-xs text-foreground/60 mt-1">{event.description}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <Button
        onClick={() => handleOpenAdd()}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-2xl bg-primary hover:bg-primary/80 shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        <Plus className="w-8 h-8 text-primary-foreground" strokeWidth={3} />
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-card w-full max-w-md rounded-[2rem] shadow-2xl border border-border/50 overflow-hidden animate-scale-in">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  {isEditing ? "Edit Event" : "New Event"}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Event Title</label>
                  <input
                    autoFocus
                    className="w-full mt-1 bg-secondary/50 border-none rounded-2xl px-4 py-3 focus:ring-2 ring-primary/50 transition-all font-semibold text-foreground outline-none"
                    placeholder="e.g., Mathematics Activity"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Start</label>
                    <input
                      type="time"
                      className="w-full mt-1 bg-secondary/50 border-none rounded-2xl px-4 py-3 focus:ring-2 ring-primary/50 font-semibold text-foreground outline-none"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">End</label>
                    <input
                      type="time"
                      className="w-full mt-1 bg-secondary/50 border-none rounded-2xl px-4 py-3 focus:ring-2 ring-primary/50 font-semibold text-foreground outline-none"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description (optional)</label>
                  <input
                    className="w-full mt-1 bg-secondary/50 border-none rounded-2xl px-4 py-3 focus:ring-2 ring-primary/50 font-semibold text-foreground outline-none"
                    placeholder="e.g., Monthly Parent Meeting"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{eventStartTime} - {eventEndTime}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-2xl text-destructive hover:bg-destructive/10"
                    onClick={handleDeleteEvent}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  className="flex-[2] rounded-2xl bg-primary shadow-lg shadow-primary/20"
                  onClick={handleSaveEvent}
                >
                  {isEditing ? "Save Changes" : "Create Event"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
