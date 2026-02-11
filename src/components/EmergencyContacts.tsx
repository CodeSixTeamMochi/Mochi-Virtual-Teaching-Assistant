import { Phone, Cross, Building2 } from "lucide-react";
import { EmergencyContact } from "@/Data/mockData.ts";

const iconMap = {
  ambulance: "🚑",
  nurse: "👩‍⚕️",
  hospital: "🏥",
};

interface Props {
  contacts: EmergencyContact[];
}

const EmergencyContacts = ({ contacts }: Props) => {
  const handleCall = (phone: string, name: string) => {
    alert(`📞 Calling ${name} at ${phone}...`);
  };

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-call/10">
          <Phone className="h-5 w-5 text-call" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-card-foreground">Emergency Contacts</h2>
          <p className="text-sm text-muted-foreground">Quick access to emergency contacts</p>
        </div>
      </div>
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
              onClick={() => handleCall(contact.phone, contact.name)}
              className="w-full rounded-full bg-emergency py-2 text-sm font-semibold text-emergency-foreground transition-opacity hover:opacity-90"
            >
              Call Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EmergencyContacts;
