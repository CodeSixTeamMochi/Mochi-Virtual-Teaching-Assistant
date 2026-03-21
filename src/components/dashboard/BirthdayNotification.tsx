import { Cake } from "lucide-react";

interface BirthdayNotificationProps {
  studentName: string;
}

export const BirthdayNotification = ({ studentName }: BirthdayNotificationProps) => {
  return (
    <div className="inline-flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-soft animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <Cake className="w-4 h-4 text-primary" />
      <span className="text-sm text-foreground">Today is <span className="font-semibold">{studentName}'s</span> birthday</span>
    </div>
  );
};
