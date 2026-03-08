import { useEffect, useState } from "react";
import { ScheduleItem } from "./ScheduleItem"; 
import { Calendar as CalendarIcon } from "lucide-react";

export const ScheduleCard = () => {
  const [todaysEvents, setTodaysEvents] = useState<any[]>([]);

  useEffect(() => {
    // 1. Pull the unified data hub
    const saved = localStorage.getItem('mochi_events');
    if (saved) {
      const allEvents = JSON.parse(saved);
      const todayStr = new Date().toISOString().split('T')[0];

      // 2. Filter for events happening TODAY
      const filtered = allEvents
        .filter((e: any) => e.date === todayStr || (e.start && e.start.startsWith(todayStr)))
        .map((e: any) => ({
          id: e.id,
          title: e.title,
          time: e.time || new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          // Logic: If event type is 'holiday', color it differently or mark as special
          status: e.type === "holiday" ? "ongoing" : "upcoming"
        }));

      setTodaysEvents(filtered);
    }
  }, []);

  return (
    <div className="bg-card rounded-[2.5rem] p-6 shadow-soft border border-border/40 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-primary">
          <CalendarIcon className="w-5 h-5" />
          <h4 className="font-bold text-foreground">Today's Schedule</h4>
        </div>
      </div>

      <div className="space-y-2">
        {todaysEvents.length > 0 ? (
          todaysEvents.map((event) => (
            <ScheduleItem 
              key={event.id}
              title={event.title}
              time={event.time}
              status={event.status}
            />
          ))
        ) : (
          <div className="py-8 text-center bg-secondary/20 rounded-2xl">
            <p className="text-sm text-muted-foreground italic">No activities for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};