import { Bell } from "lucide-react";

const MedicationReminders = () => {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-notification-background">
          <Bell className="h-5 w-5 text-notification" />
        </div>
        <h2 className="text-lg font-bold text-card-foreground">Medication Reminders</h2>
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-16 items-center justify-center rounded-xl border border-dashed border-border bg-secondary/40"
          >
            <p className="text-sm text-muted-foreground">No reminder set</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MedicationReminders;