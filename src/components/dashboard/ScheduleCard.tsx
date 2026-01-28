import { ScheduleItem } from "./ScheduleItem";

interface ScheduleEvent {
  id: string;
  title: string;
  time: string;
  status: "completed" | "ongoing" | "upcoming";
}

interface ScheduleCardProps {
  events: ScheduleEvent[];
  title?: string;
}

export const ScheduleCard = ({ events, title = "Today's Schedule" }: ScheduleCardProps) => {
  return (
    <div className="bg-card rounded-xl p-4 shadow-card border border-border animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <h3 className="font-bold text-lg text-foreground mb-3">{title}</h3>
      <div className="space-y-1">
        {events.map((event) => (
          <ScheduleItem 
            key={event.id}
            title={event.title}
            time={event.time}
            status={event.status}
          />
        ))}
      </div>
    </div>
  );
};
