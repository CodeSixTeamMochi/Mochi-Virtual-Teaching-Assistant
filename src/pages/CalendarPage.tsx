import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "lesson" | "activity" | "meeting" | "holiday";
}

const CalendarPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [events] = useState<CalendarEvent[]>([
    { id: "1", title: "Morning Circle", date: new Date(), time: "9:00 AM", type: "activity" },
    { id: "2", title: "Color Learning Session", date: new Date(), time: "10:00 AM", type: "lesson" },
    { id: "3", title: "Parent Meeting", date: new Date(Date.now() + 86400000 * 2), time: "3:00 PM", type: "meeting" },
    { id: "4", title: "Field Trip to Zoo", date: new Date(Date.now() + 86400000 * 5), time: "9:00 AM", type: "activity" },
  ]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const hasEvents = (date: Date) => {
    return events.some(e => isSameDay(e.date, date));
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(e => isSameDay(e.date, date));
  };

  const typeColors = {
    lesson: "bg-primary text-primary-foreground",
    activity: "bg-success text-success-foreground",
    meeting: "bg-info text-info-foreground",
    holiday: "bg-warning text-warning-foreground",
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
            <p className="text-sm text-muted-foreground">Manage your schedule</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
        </div>

        {/* Calendar */}
        <Card className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">{formatMonth(currentDate)}</h2>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => (
              <button
                key={index}
                onClick={() => date && setSelectedDate(date)}
                disabled={!date}
                className={cn(
                  "aspect-square p-1 rounded-lg text-sm flex flex-col items-center justify-center relative transition-all",
                  !date && "invisible",
                  date && isSameDay(date, new Date()) && "bg-primary text-primary-foreground font-bold",
                  date && selectedDate && isSameDay(date, selectedDate) && !isSameDay(date, new Date()) && "bg-mochi",
                  date && !isSameDay(date, new Date()) && !(selectedDate && isSameDay(date, selectedDate)) && "hover:bg-secondary"
                )}
              >
                {date?.getDate()}
                {date && hasEvents(date) && (
                  <div className="w-1 h-1 bg-success rounded-full absolute bottom-1" />
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Events for Selected Date */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">
            {selectedDate 
              ? `Events for ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`
              : "Select a date"
            }
          </h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length === 0 ? (
              <Card className="p-4 text-center text-muted-foreground">
                No events scheduled for this day
              </Card>
            ) : (
              getEventsForDate(selectedDate).map((event, index) => (
                <Card 
                  key={event.id} 
                  className="p-3 animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-10 rounded-full", typeColors[event.type].split(" ")[0])} />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.time}</p>
                    </div>
                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", typeColors[event.type])}>
                      {event.type}
                    </span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
