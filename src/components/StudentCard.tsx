import { useState } from "react";
import { Phone, TriangleAlert, Pill, Plus, X, User, Trash2, Pencil } from "lucide-react";
import { Student } from "@/Data/mockData.ts";

interface Props {
  student: Student;
}

const StudentCard = ({ student }: Props) => {
  // const [newAllergy, setNewAllergy] = useState("");
  // const [newMedicine, setNewMedicine] = useState("");
  // const [addingAllergy, setAddingAllergy] = useState(false);
  // const [addingMedicine, setAddingMedicine] = useState(false);
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  // const [editName, setEditName] = useState(student.name);
  // const [editPhone, setEditPhone] = useState(student.parentPhone);

  const handleCall = () => {
    // Format phone number - remove spaces and special characters
    const formattedPhone = student.parentPhone.replace(/\s+/g, '').replace(/-/g, '');
    
    // If the phone number doesn't start with +, add Sri Lanka country code (+94)
    const phoneWithCountryCode = formattedPhone.startsWith('+') 
      ? formattedPhone 
      : `+94${formattedPhone.replace(/^0/, '')}`; // Remove leading 0 and add +94
    
    // Open dialer with the phone number
    window.location.href = `tel:${phoneWithCountryCode}`;
  };

  // const handleSaveEdit = () => {
  //   if (editName.trim() && editPhone.trim()) {
  //     onUpdate({
  //       ...student,
  //       name: editName.trim(),
  //       parentPhone: editPhone.trim(),
  //     });
  //     setIsEditing(false);
  //   }
  // };

  // const handleCancelEdit = () => {
  //   setEditName(student.name);
  //   setEditPhone(student.parentPhone);
  //   setIsEditing(false);
  // };

  // const addAllergy = () => {
  //   if (newAllergy.trim()) {
  //     onUpdate({ ...student, allergies: [...student.allergies, newAllergy.trim()] });
  //     setNewAllergy("");
  //     // Keep the input open for adding more
  //     // setAddingAllergy(false);
  //   }
  // };

  // const finishAddingAllergy = () => {
  //   if (newAllergy.trim()) {
  //     addAllergy();
  //   }
  //   setAddingAllergy(false);
  //   setNewAllergy("");
  // };

  // const addMedicine = () => {
  //   if (newMedicine.trim()) {
  //     onUpdate({ ...student, medicines: [...student.medicines, newMedicine.trim()] });
  //     setNewMedicine("");
  //     // Keep the input open for adding more
  //     //setAddingMedicine(false);
  //   }
  // };

  // const finishAddingMedicine = () => {
  //   if (newMedicine.trim()) {
  //     addMedicine();
  //   }
  //   setAddingMedicine(false);
  //   setNewMedicine("");
  // };

  // const removeAllergy = (index: number) => {
  //   onUpdate({ ...student, allergies: student.allergies.filter((_, i) => i !== index) });
  // };

  // const removeMedicine = (index: number) => {
  //   onUpdate({ ...student, medicines: student.medicines.filter((_, i) => i !== index) });
  // };

  // const handleDelete = () => {
  //   onDelete(student.id);
  //   setShowDeleteConfirm(false);
  // };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="font-semibold text-card-foreground">{student.name}</h3>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {student.parentPhone}
            </p>
          </div>
        </div>
        {/* Call Button */}
        <button
          onClick={handleCall}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-call/10 transition-colors hover:bg-call/20"
        >
          <Phone className="h-4 w-4 text-call" />
        </button>
      </div>

      {/* Content - Simple Display */}
      <div className="space-y-3">
        {/* Allergies */}
        {student.allergies && student.allergies.length > 0 && (
          <div className="rounded-xl bg-secondary/50 p-3">
            <span className="mb-2 block text-xs font-semibold text-card-foreground">Allergies</span>
            <div className="flex flex-wrap gap-1.5">
              {student.allergies.map((allergy, i) => (
                <span
                  key={i}
                  className="rounded-md bg-destructive/10 px-2.5 py-1 text-xs text-destructive"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Medicines */}
        {student.medicines && student.medicines.length > 0 && (
          <div className="rounded-xl bg-secondary/50 p-3">
            <span className="mb-2 block text-xs font-semibold text-card-foreground">Medicines</span>
            <div className="flex flex-wrap gap-1.5">
              {student.medicines.map((med, i) => (
                <span
                  key={i}
                  className="rounded-md bg-primary/10 px-2.5 py-1 text-xs text-primary"
                >
                  {med}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Class Badge */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
            {student.classGroup}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
