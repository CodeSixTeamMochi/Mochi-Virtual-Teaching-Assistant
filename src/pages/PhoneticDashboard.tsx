import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, AlertTriangle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Student {
  id: number;
  name: string;
}

const PhoneticDashboard = () => {

    const navigate = useNavigate();

    // State for the classroom dropdown
    const [selectedStudent, setSelectedStudent] = useState<number | "all">("all");

    // Mock student list(to be fetched from database)
    const [students] = useState<Student[]>([
        { id: 1, name: "Emma Johnson" },
        { id: 2, name: "Liam Smith" },
        { id: 3, name: "Sophia Davis" }
    ]);

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div>
                            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                                <Mic className="h-6 w-6 text-primary" />
                                Mochi Phonetic Analysis
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Track real-time pronunciation corrections across the classroom.
                            </p>
                        </div>
                    </div>

                    {/* Classroom Dropdown */}
                    <div className="flex items-center gap-2 bg-card p-2 rounded-lg border border-border shadow-sm">
                        <Users className="h-5 w-5 text-muted-foreground ml-2" />
                        <select 
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer p-2 outline-none"
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value === "all" ? "all" : Number(e.target.value))}
                        >   
                            <option value="all">Entire Classroom</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Correction Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Errors Tracked</h3>
                        <p className="text-4xl font-bold text-foreground mt-2">0</p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Most Common Mistake</h3>
                        <p className="text-2xl font-bold text-warning mt-2">-</p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Mastered Words</h3>
                        <p className="text-4xl font-bold text-success mt-2">0</p>
                    </Card>
                </div>

                {/* Empty Table Shell*/}
                <Card className="p-0 overflow-hidden border border-border shadow-sm">
                    <div className="p-4 bg-muted/30 border-b border-border">
                        <h2 className="font-semibold text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Recent Correction Logs {selectedStudent !== "all" ? `for ${students.find(s => s.id === selectedStudent)?.name}` : ""}
                        </h2>
                    </div>

                    <div className="p-16 flex flex-col items-center justify-center text-center text-muted-foreground bg-background">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Awaiting Database Connection...</p>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default PhoneticDashboard;