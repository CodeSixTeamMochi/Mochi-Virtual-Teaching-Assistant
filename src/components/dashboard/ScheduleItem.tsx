import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  title: string;
  time: string;
  status: "completed" | "ongoing" | "upcoming";
}

export const ScheduleItem = ({ title, time, status }: ScheduleItemProps) => {
  const statusColors = {
    completed: "bg-success",
    ongoing: "bg-warning",
    upcoming: "bg-muted-foreground/30"
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={cn(
        "w-3 h-3 rounded-full flex-shrink-0",
        statusColors[status]
      )} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground truncate">{title}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
};
