import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, AlertTriangle, Users, MessageSquare} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const PhoneticDashboard = () => {

    const navigate = useNavigate();

    //  State for real Database Data
    const [assessments, setAssessments] = useState<any[]>([]);
    const [students, setStudents] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedStudent, setSelectedStudent] = useState<string | "all">("all");

    // Fetch data from Neon Database via Flask

     useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the full classroom roster
                const rosterResponse = await axios.get('http://localhost:5000/students');
                
                const namesOnly = rosterResponse.data.map((student: any) => student.name);
                setStudents(namesOnly);

                // Fetch the actual assessment logs for the Cards & Graph
                const assessmentResponse = await axios.get('http://localhost:5000/speech-assessments');
                setAssessments(assessmentResponse.data);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter the assessments based on the dropdown selection
    const filteredData = selectedStudent === "all"
        ? assessments
        : assessments.filter(a => a.student_name === selectedStudent);

    //Prepare data for the graph
    const chartData = [...filteredData].reverse().map((item, index) => ({
        ...item,
        session: `Session ${index + 1}`
    }));

    // Calculate dynamic stats for the top cards
    const totalSessions = filteredData.length;
    const averageScore = totalSessions > 0
      ? Math.round(filteredData.reduce((acc, curr) => acc + curr.score, 0) / totalSessions)
      : 0;

    // Assessments are ordered DESC by the DB, so the first one [0] is the most recent!
    const latestScore = totalSessions > 0 ? filteredData[0].score : 0;

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
                            onChange={(e) => setSelectedStudent(e.target.value)}
                        >   
                            <option value="all">Entire Classroom</option>
                            {students.map((studentName, index) => (
                                <option key={index} value={studentName}>
                                    {studentName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dynamic Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Average Score</h3>
                        <p className="text-4xl font-bold text-foreground mt-2">
                             {loading ? "..." : `${averageScore}%`}
                        </p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Sessions Tracked</h3>
                        <p className="text-4xl font-bold text-primary mt-2">
                            {loading ? "..." : totalSessions}
                        </p>
                    </Card>

                    <Card className="p-6 flex flex-col justify-center items-center bg-card border-border shadow-sm">
                        <h3 className="text-sm fonst-semibold text-muted-foreground uppercase tracking-wider">Latest Score</h3>
                        <p className={`
                            text-4xl font-bold mt-2 
                            ${latestScore >= 70 ? 'text-green-500' : 'text-amber-500'}
                        `}>
                            {loading ? "..." : `${latestScore}%`}
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
                                Progress Trend {selectedStudent !== "all" ? `- ${selectedStudent}` : "(Class Average)"}
                            </h2>
                        </div>

                        <div className="p-6 h-[350px] w-full bg-card flex-1">
                            {loading ? (
                                <div className="h-full flex items-center justify-center text-muted-foreground">Loading chart...</div>
                            ) : chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                            {loading ? (
                                <p className="text-sm text-muted-foreground text-center mt-10">Syncing with Mochi...</p>
                            ) : filteredData.length > 0 ? (
                                filteredData.map((assessment) => (
                                <div key={assessment.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-xs font-bold text-muted-foreground uppercase">
                                            {assessment.student_name}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${assessment.score >= 70 ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                                            {assessment.score}%
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground mt-2">
                                        "{assessment.comments}"
                                    </p>
                                </div>
                            ))

                            ) : (
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