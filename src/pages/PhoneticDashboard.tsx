import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, AlertTriangle, Users, MessageSquare} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Student {
  id: number;
  name: string;
}

const mockAssessments = [
  { id: 1, session: 'Mon', student_id: 1, score: 45, comments: "Struggled with 'R' sound. Said 'wabbit'." },
  { id: 2, session: 'Tue', student_id: 1, score: 55, comments: "Improving! Corrected 'red' on second attempt." },
  { id: 3, session: 'Wed', student_id: 1, score: 70, comments: "Great progress with R sounds today." },
  { id: 4, session: 'Mon', student_id: 2, score: 85, comments: "Excellent pronunciation. Very attentive." },
  { id: 5, session: 'Wed', student_id: 2, score: 92, comments: "Mastered the requested vocabulary." },
  { id: 6, session: 'Tue', student_id: 3, score: 40, comments: "Having trouble with 'TH' sounds. Needs practice." },
];

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

    // Filter the assessments based on the dropdown selection
    const filteredData = selectedStudent === "all"
      ? mockAssessments
      : mockAssessments.filter(a => a.student_id === selectedStudent);
    // Calculate dynamic stats for the top cards
    const totalSessions = filteredData.length;
    const averageScore = totalSessions > 0
      ? Math.round(filteredData.reduce((acc, curr) => acc + curr.score, 0) / totalSessions)
      : 0;
    const latestScore = totalSessions > 0 ? filteredData[totalSessions - 1].score : 0;

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
                            className="bg-transparent border-none text-sm font-medium text-foreground focus:ring-0 cursor-pointer p-2 outline-none"
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

                {/* Dynamic Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Score</h3>
                        <p className="text-4xl font-bold text-foreground mt-2">{averageScore}%</p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sessions Tracked</h3>
                        <p className="text-4xl font-bold text-primary mt-2">{totalSessions}</p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Latest Score</h3>
                        <p className={`
                            text-4xl font-bold mt-2 
                            ${latestScore >= 70 ? 'text-green-500' : 'text-amber-500'}
                        `}>
                            {latestScore}%
                        </p>
                    </Card>
                </div>

                {/* Main Content Area */}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Recharts Progress Graph */}
                    <Card className="p-0 overflow-hidden border border-border shadow-sm lg:col-span-2 flex flex-col">
                        <div className="p-4 bg-muted/30 border-b border-border">
                            <h2 className="font-semibold text-foreground flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-primary" />
                                Progress Trend {selectedStudent !== "all" ? `- ${students.find(s => s.id === selectedStudent)?.name}` : "(Class Average)"}
                            </h2>
                        </div>

                        <div className="p-6 h-[350px] w-full bg-card flex-1">
                            {filteredData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                        <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888888', fontSize: 12 }} domain={[0, 100]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', border: '1px solid var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            name="Score"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground">
                                    No data available for this selection.
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Teacher Insights Feed */}
                    <Card className="p-0 overflow-hidden border border-border shadow-sm flex flex-col h-[400px] lg:h-auto">
                        <div className="p-4 bg-muted/30 border-b border-border">
                            <h2 className="font-semibold text-foreground flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                Assessment Logs
                            </h2>
                        </div>

                        <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-card">
                            {[...filteredData].reverse().map((assessment) => (
                                <div key={assessment.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">
                                            {selectedStudent === "all" ? students.find(s => s.id === assessment.student_id)?.name : `${assessment.session} Session`}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${assessment.score >= 70 ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {assessment.score}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground mt-2">
                                        "{assessment.comments}"
                                    </p>
                                </div>
                            ))}

                            {filteredData.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center mt-10">No logs found.</p>
                            )}

                        </div>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default PhoneticDashboard;