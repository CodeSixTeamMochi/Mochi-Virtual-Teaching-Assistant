import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, AlertTriangle, Pill, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StudentHealth {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string[];
  medications: { name: string; time: string }[];
  emergencyContact: { name: string; phone: string; relation: string };
  conditions: string[];
}

const HealthDataPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [students] = useState<StudentHealth[]>([
    {
      id: "1",
      name: "Emma Johnson",
      age: 4,
      bloodType: "A+",
      allergies: ["Peanuts", "Shellfish"],
      medications: [{ name: "Vitamin D", time: "10:00 AM" }],
      emergencyContact: { name: "Sarah Johnson", phone: "+1 234-567-8901", relation: "Mother" },
      conditions: ["Mild Asthma"]
    },
    {
      id: "2",
      name: "Liam Smith",
      age: 5,
      bloodType: "O+",
      allergies: [],
      medications: [],
      emergencyContact: { name: "Michael Smith", phone: "+1 234-567-8902", relation: "Father" },
      conditions: []
    },
    {
      id: "3",
      name: "Olivia Brown",
      age: 4,
      bloodType: "B+",
      allergies: ["Dairy", "Eggs"],
      medications: [{ name: "Lactase", time: "Before meals" }],
      emergencyContact: { name: "Jennifer Brown", phone: "+1 234-567-8903", relation: "Mother" },
      conditions: ["Lactose intolerance"]
    },
    {
      id: "4",
      name: "Noah Davis",
      age: 5,
      bloodType: "AB+",
      allergies: ["Bee stings"],
      medications: [{ name: "EpiPen", time: "Emergency only" }],
      emergencyContact: { name: "Robert Davis", phone: "+1 234-567-8904", relation: "Father" },
      conditions: []
    },
  ]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasAlerts = (student: StudentHealth) => 
    student.allergies.length > 0 || student.conditions.length > 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 ">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Health Data</h1>
            <p className="text-sm text-muted-foreground">Student emergency & health information</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 bg-warning/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-xs text-muted-foreground">With Allergies</p>
                <p className="text-xl font-bold text-foreground">
                  {students.filter(s => s.allergies.length > 0).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-3 bg-info">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-info-foreground" />
              <div>
                <p className="text-xs text-info-foreground">On Medication</p>
                <p className="text-xl font-bold text-info-foreground">
                  {students.filter(s => s.medications.length > 0).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Students List */}
        <div className="space-y-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student, index) => (
            <Card 
              key={student.id} 
              className="p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${hasAlerts(student) ? 'bg-warning/20' : 'bg-stats-green'}`}>
                    <Heart className={`w-5 h-5 ${hasAlerts(student) ? 'text-warning' : 'text-success'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{student.name}</h3>
                    <p className="text-xs text-muted-foreground">Age {student.age} • Blood Type: {student.bloodType}</p>
                  </div>
                </div>
              </div>

              {/* Allergies */}
              {student.allergies.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-warning mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Allergies
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {student.allergies.map((allergy, i) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions */}
              {student.conditions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Medical Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {student.conditions.map((condition, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {student.medications.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-info-foreground mb-1 flex items-center gap-1">
                    <Pill className="w-3 h-3" />
                    Medications
                  </p>
                  {student.medications.map((med, i) => (
                    <p key={i} className="text-sm text-foreground">
                      {med.name} • <span className="text-muted-foreground">{med.time}</span>
                    </p>
                  ))}
                </div>
              )}

              {/* Emergency Contact */}
              <div className="pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-1">Emergency Contact</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{student.emergencyContact.name}</p>
                    <p className="text-xs text-muted-foreground">{student.emergencyContact.relation}</p>
                  </div>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Phone className="w-3 h-3" />
                    {student.emergencyContact.phone}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthDataPage;
