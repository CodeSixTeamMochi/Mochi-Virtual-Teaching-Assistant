import { useState } from "react";
import { Phone, Cross, Building2, Pencil, Plus, X  } from "lucide-react";
import { EmergencyContact } from "@/Data/mockData.ts";
import AddEmergencyContactModal from "./AddEmergencyContactModal";

const iconMap = {
  ambulance: "🚑",
  nurse: "👩‍⚕️",
  hospital: "🏥",
};

interface Props {
  contacts: EmergencyContact[];
  onUpdateContact: (contact: EmergencyContact) => void;
  onAddContact: (contact: EmergencyContact) => void;
  onDeleteContact: (contactId: string) => void;
}

const EmergencyContacts = ({ contacts, onUpdateContact, onAddContact, onDeleteContact }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContacts, setEditingContacts] = useState<EmergencyContact[]>([]);

  const handleEditClick = () => {
    setEditingContacts([...contacts]);
    setIsEditing(true);
  };

  const handleSave = () => {
    editingContacts.forEach((contact) => {
      onUpdateContact(contact);
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingContacts([]);
    setIsEditing(false);
  };

  const handleContactChange = (id: string, field: keyof EmergencyContact, value: string) => {
    setEditingContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleDeleteFromEdit = (id: string) => {
    setEditingContacts((prev) => prev.filter((c) => c.id !== id));
    onDeleteContact(id);
  };

  const handleCall = (phone: string) => {
    // Format phone number - remove spaces and special characters
    const formattedPhone = phone.replace(/\s+/g, '').replace(/-/g, '');
    
    // If the phone number doesn't start with +, add Sri Lanka country code (+94)
    const phoneWithCountryCode = formattedPhone.startsWith('+') 
      ? formattedPhone 
      : `+94${formattedPhone.replace(/^0/, '')}`; // Remove leading 0 and add +94
    
    // Open dialer with the phone number
    window.location.href = `tel:${phoneWithCountryCode}`;
  };

  return (
    <>
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-call/10">
              <Phone className="h-5 w-5 text-call" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">Emergency Contacts</h2>
              <p className="text-sm text-muted-foreground">Quick access to emergency contacts</p>
            </div>
          </div>
          {!isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Add
              </button>
              <button
                onClick={handleEditClick}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-opacity hover:opacity-90"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          // Edit Mode
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {editingContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{iconMap[contact.icon]}</span>
                    <button
                      onClick={() => handleDeleteFromEdit(contact.id)}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 transition-colors hover:bg-destructive/20"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(contact.id, "name", e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Phone</label>
                    <input
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(contact.id, "phone", e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Icon</label>
                    <select
                      value={contact.icon}
                      onChange={(e) => handleContactChange(contact.id, "icon", e.target.value as "ambulance" | "nurse" | "hospital")}
                      className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="ambulance">🚑 Ambulance</option>
                      <option value="nurse">👩‍⚕️ Nurse</option>
                      <option value="hospital">🏥 Hospital</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // View Mode
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex flex-col justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{contact.name}</p>
                    <p className="text-xl font-bold text-card-foreground">{contact.phone}</p>
                  </div>
                  <span className="text-2xl">{iconMap[contact.icon]}</span>
                </div>
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="w-full rounded-full bg-emergency py-2 text-sm font-semibold text-emergency-foreground transition-opacity hover:opacity-90"
                >
                  Call Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    <AddEmergencyContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAddContact}
      />
    </>
  );
};

export default EmergencyContacts;
