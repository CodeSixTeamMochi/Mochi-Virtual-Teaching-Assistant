import { useState } from "react";
import { X, Stethoscope, Building2, UserCog, Siren } from "lucide-react";
import { EmergencyContact } from "@/Data/mockData";

// Icon preview component
const getIconComponent = (iconName: string, size: string = "h-6 w-6") => {
  const iconMap: { [key: string]: JSX.Element } = {
    ambulance: <Siren className={size} />,
    doctor: <Stethoscope className={size} />,
    nurse: <Stethoscope className={size} />,
    hospital: <Building2 className={size} />,
    principal: <UserCog className={size} />,
  };
  
  return iconMap[iconName] || <Siren className={size} />;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (contact: EmergencyContact) => void;
}

const AddEmergencyContactModal = ({ isOpen, onClose, onAdd }: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [icon, setIcon] = useState("ambulance");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim() && phone.trim() && type.trim()) {
      const newContact: EmergencyContact = {
        id: `emergency-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        type: type.trim(),
        icon: icon,
      };
      
      onAdd(newContact);
      handleClose();
    }
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    setType("");
    setIcon("ambulance");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-card-foreground">Add Emergency Contact</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-secondary"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Contact Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., School Nurse"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., +94 77 123 4567"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="e.g., Doctor, Principal, Headmaster"
              className="w-full rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              required
            />
            <p className="mt-1 text-xs text-muted-foreground">
              You can enter the role: Doctor, Principal, Headmaster, Security, etc.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">
              Icon
            </label>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {getIconComponent(icon, "h-6 w-6")}
              </div>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="flex-1 rounded-lg border border-input bg-background px-4 py-2 text-card-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="ambulance">🚑 Ambulance</option>
                <option value="doctor">👨‍⚕️ Doctor</option>
                <option value="nurse">👩‍⚕️ Nurse</option>
                <option value="hospital">🏥 Hospital</option>
                <option value="principal">👔 Principal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-primary py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Add Contact
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-full bg-secondary py-2.5 font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmergencyContactModal;