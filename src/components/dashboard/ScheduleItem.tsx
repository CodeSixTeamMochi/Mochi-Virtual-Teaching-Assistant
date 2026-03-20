import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  title: string;
  time: string;
  dotColor?: string; // Passed from the API
}

export const ScheduleItem = ({ title, time, dotColor = "bg-muted-foreground/30" }: ScheduleItemProps) => {
  return (
    <div className="flex items-center gap-3 py-3 px-1 hover:bg-slate-50 rounded-lg transition-colors group">
      {/* The Status Dot */}
      <div className={cn(
        "w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm",
        dotColor
      )} />
      
      <div className="min-w-0 flex-1">
        <p className="font-bold text-[#1e293b] text-[14px] truncate group-hover:text-[#0891b2] transition-colors">
          {title}
        </p>
        <p className="text-[12px] font-semibold text-slate-400 flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          {time}
        </p>
      </div>
    </div>
  );
};