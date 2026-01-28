import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Send, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  message: string;
  recipientType: "all" | "specific";
  status: "sent" | "scheduled" | "draft";
  sentAt?: string;
}

const RemindersPage = () => {
  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "1", title: "Field Trip Tomorrow", message: "Please prepare lunch box and comfortable shoes for the park visit.", recipientType: "all", status: "sent", sentAt: "Today, 9:00 AM" },
    { id: "2", title: "Parent Meeting", message: "Monthly parent-teacher meeting on Friday at 3 PM.", recipientType: "all", status: "sent", sentAt: "Yesterday, 2:30 PM" },
    { id: "3", title: "Medication Reminder", message: "Please ensure Emma's inhaler is in her bag.", recipientType: "specific", status: "sent", sentAt: "Jan 18, 11:00 AM" },
  ]);

  const [newReminder, setNewReminder] = useState<{
    title: string;
    message: string;
    recipientType: "all" | "specific";
  }>({
    title: "",
    message: "",
    recipientType: "all",
  });

  const sendReminder = () => {
    if (!newReminder.title.trim() || !newReminder.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    const reminder: Reminder = {
      id: Date.now().toString(),
      ...newReminder,
      status: "sent",
      sentAt: "Just now",
    };

    setReminders([reminder, ...reminders]);
    setNewReminder({ title: "", message: "", recipientType: "all" });
    toast({ 
      title: "Reminder Sent!", 
      description: `Notification sent to ${newReminder.recipientType === "all" ? "all parents" : "selected parents"}` 
    });
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
    toast({ title: "Reminder deleted" });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-full ">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Parent Reminders</h1>
            <p className="text-sm text-muted-foreground">Send notifications to parents</p>
          </div>
        </div>

        {/* New Reminder Form */}
        <Card className="p-4">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Reminder
          </h3>
          <div className="space-y-3">
            <Input
              placeholder="Reminder title..."
              value={newReminder.title}
              onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
            />
            <Textarea
              placeholder="Message to parents..."
              value={newReminder.message}
              onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
              rows={3}
            />
            <div className="flex items-center gap-3">
              <Select
                value={newReminder.recipientType}
                onValueChange={(value: "all" | "specific") => 
                  setNewReminder({ ...newReminder, recipientType: value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Parents</SelectItem>
                  <SelectItem value="specific">Specific Parents</SelectItem>
                </SelectContent>
              </Select>
              <Button className="ml-auto gap-2" onClick={sendReminder}>
                <Send className="w-4 h-4" />
                Send Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Sent Reminders */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Sent Reminders</h3>
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <Card 
                key={reminder.id} 
                className="p-4 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 flex-1">
                    <div className="w-10 h-10 bg-info rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5 text-info-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{reminder.title}</h4>
                        <span className="flex items-center gap-1 text-xs text-success">
                          <Check className="w-3 h-3" />
                          Sent
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{reminder.message}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{reminder.sentAt}</span>
                        <span>•</span>
                        <span>{reminder.recipientType === "all" ? "All Parents" : "Selected Parents"}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteReminder(reminder.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
