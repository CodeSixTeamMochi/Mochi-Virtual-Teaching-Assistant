import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

import TeacherDashboard from "./pages/TeacherDashboard";
import LessonsPage from "./pages/LessonsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import SpeechReportsPage from "./pages/SpeechReportsPage";
import HealthDataPage from "./pages/HealthDataPage";
import RemindersPage from "./pages/RemindersPage";
import CalendarPage from "./pages/CalendarPage";
import StudentsPage from "./pages/StudentsPage";
import TimetablePage from "./pages/TimetablePage";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/dashboard" element={<TeacherDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/speech-reports" element={<SpeechReportsPage />} />
          <Route path="/health" element={<HealthDataPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/timetable" element={<TimetablePage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
