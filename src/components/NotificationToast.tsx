import { useEffect } from "react";
import { CheckCircle, Eye, Bell, X } from "lucide-react";

interface NotificationToastProps {
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
  type?: "success" | "info" | "completed";
}

const NotificationToast = ({ title, message, onClose, duration = 3000, type = "success" }: NotificationToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "completed":
        return {
          backgroundColor: "#e8f5e9", 
          iconBg: "bg-success/20",
          iconColor: "text-success",
          icon: <CheckCircle className="h-5 w-5 text-success" />,
        };
      case "info":
        return {
          backgroundColor: "#e3f2fd", 
          iconBg: "bg-primary/20",
          iconColor: "text-success",
          icon: <Eye className="h-5 w-5 text-primary" />,
        };
      case "success":
      default:
        return {
          bgColor: "bg-card",
          iconBg: "bg-success/15",
          iconColor: "text-success",
          icon: <Bell className="h-5 w-5 text-success" />,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div 
        className={`min-w-[320px] max-w-md rounded-xl border border-border p-4 shadow-lg ${!styles.backgroundColor ? 'bg-card' : ''}`}
        style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : undefined}
      >
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg}`}>
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full hover:bg-white/50"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;