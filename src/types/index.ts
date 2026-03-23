export interface DashboardStats {
  totalStudents: number;
  presentToday: number;
  activitiesDone: number;
  pendingMsgs: number;
}

export interface ScheduleSlot {
  id: number;
  time: string;
  title: string;
  duration: string;
}

export interface Announcement {
  id: number;
  title: string;
  time: string;
}