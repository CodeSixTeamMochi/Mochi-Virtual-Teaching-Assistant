import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mic, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SpeechReport {
  id: string;
  studentName: string;
  clarity: number;
  pronunciation: number;
  fluency: number;
  commonErrors: string[];
  trend: "improving" | "stable" | "needs-attention";
}

const SpeechReportsPage = () => {
  const navigate = useNavigate();
  const [reports] = useState<SpeechReport[]>([
    { 
      id: "1", 
      studentName: "Emma Johnson", 
      clarity: 85, 
      pronunciation: 78, 
      fluency: 82, 
      commonErrors: ["th sounds", "r sounds"],
      trend: "improving"
    },
    { 
      id: "2", 
      studentName: "Liam Smith", 
      clarity: 92, 
      pronunciation: 88, 
      fluency: 90, 
      commonErrors: [],
      trend: "stable"
    },
    { 
      id: "3", 
      studentName: "Olivia Brown", 
      clarity: 65, 
      pronunciation: 60, 
      fluency: 68, 
      commonErrors: ["s sounds", "l sounds", "word endings"],
      trend: "needs-attention"
    },
    { 
      id: "4", 
      studentName: "Noah Davis", 
      clarity: 75, 
      pronunciation: 72, 
      fluency: 78, 
      commonErrors: ["ch sounds"],
      trend: "improving"
    },
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4 text-success" />;
      case "needs-attention":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <TrendingDown className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Improving";
      case "needs-attention":
        return "Needs Attention";
      default:
        return "Stable";
    }
  };

  const getAverageScore = (report: SpeechReport) => {
    return Math.round((report.clarity + report.pronunciation + report.fluency) / 3);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 max-w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Speech Reports</h1>
            <p className="text-sm text-muted-foreground">Monitor student speech development</p>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-stats-green text-center">
            <p className="text-xs text-muted-foreground">Improving</p>
            <p className="text-xl font-bold text-foreground">
              {reports.filter(r => r.trend === "improving").length}
            </p>
          </Card>
          <Card className="p-3 bg-info text-center">
            <p className="text-xs text-info-foreground">Stable</p>
            <p className="text-xl font-bold text-info-foreground">
              {reports.filter(r => r.trend === "stable").length}
            </p>
          </Card>
          <Card className="p-3 bg-warning/10 text-center">
            <p className="text-xs text-warning">Attention</p>
            <p className="text-xl font-bold text-warning">
              {reports.filter(r => r.trend === "needs-attention").length}
            </p>
          </Card>
        </div>

        {/* Reports List */}
        <div className="space-y-3">
          {reports.map((report, index) => (
            <Card 
              key={report.id} 
              className="p-4 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-mochi rounded-full flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{report.studentName}</h3>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(report.trend)}
                      <span className="text-xs text-muted-foreground">{getTrendLabel(report.trend)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{getAverageScore(report)}%</p>
                  <p className="text-xs text-muted-foreground">Overall</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Clarity</span>
                    <span className="font-medium text-foreground">{report.clarity}%</span>
                  </div>
                  <Progress value={report.clarity} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Pronunciation</span>
                    <span className="font-medium text-foreground">{report.pronunciation}%</span>
                  </div>
                  <Progress value={report.pronunciation} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Fluency</span>
                    <span className="font-medium text-foreground">{report.fluency}%</span>
                  </div>
                  <Progress value={report.fluency} className="h-2" />
                </div>
              </div>

              {report.commonErrors.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Areas to focus:</p>
                  <div className="flex flex-wrap gap-1">
                    {report.commonErrors.map((error, i) => (
                      <span key={i} className="px-2 py-0.5 bg-warning/10 text-warning text-xs rounded-full">
                        {error}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeechReportsPage;
