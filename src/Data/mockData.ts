export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  icon: "ambulance" | "nurse" | "hospital";
}

export interface MedicationReminder {
  id: string;
  studentName: string;
  medication: string;
  time: string;
  completed: boolean;
}

export interface Student {
  id: string;
  name: string;
  parentPhone: string;
  classGroup: string;
  allergies: string[];
  medicines: string[];
}

export const emergencyContacts: EmergencyContact[] = [
  { id: "1", name: "Ambulance Service", phone: "1990", icon: "ambulance" },
  { id: "2", name: "School Nurse", phone: "+94 77 123 4567", icon: "nurse" },
  { id: "3", name: "Nearest Hospital", phone: "+94 11 234 5678", icon: "hospital" },
];

export const medicationReminders: MedicationReminder[] = [];

export const students: Student[] = [
  {
    id: "1",
    name: "Movindu Gamage",
    parentPhone: "+94 77 111 2222",
    classGroup: "Class A",
    allergies: ["Peanuts", "Dust"],
    medicines: ["Cetirizine 5mg"],
  },
  {
    id: "2",
    name: "Sithumi Perera",
    parentPhone: "+94 77 333 4444",
    classGroup: "Class A",
    allergies: ["Lactose"],
    medicines: ["Lactaid"],
  },
  {
    id: "3",
    name: "Kavith Fernando",
    parentPhone: "+94 77 555 6666",
    classGroup: "Class A",
    allergies: [],
    medicines: ["Ventolin Inhaler"],
  },
  {
    id: "4",
    name: "Nethmi Silva",
    parentPhone: "+94 77 777 8888",
    classGroup: "Class B",
    allergies: ["Shellfish", "Eggs"],
    medicines: [],
  },

  {
    id: "5",
    name: "Anul Sandes",
    parentPhone: "+94 77 999 0000",
    classGroup: "Class B",
    allergies: ["Pollen"],
    medicines: ["Flonase Nasal Spray"],
  },

  {
    id: "6",
    name: "Thewan Jayaweera",
    parentPhone: "+94 77 123 7890",
    classGroup: "Class B",
    allergies: ["Gluten"],
    medicines: ["Gluten-Free Multivitamin"],
  }
];
