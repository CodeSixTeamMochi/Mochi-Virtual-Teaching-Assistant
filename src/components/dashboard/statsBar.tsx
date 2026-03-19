import { StatCard } from './StatCard';
import { DashboardStats } from '../../types';

export default function StatsBar({ stats }: { stats: DashboardStats | null }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Total Students" value={stats.totalStudents} variant="green" />
      <StatCard label="Present Today" value={stats.presentToday} variant="green" />
      <StatCard label="Activities Done" value={stats.activitiesDone} variant="yellow" />
      <StatCard label="Pending Msgs" value={stats.pendingMsgs} variant="yellow" />
    </div>
  );
}