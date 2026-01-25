import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, BookOpen, Calendar, Settings, Bell } from 'lucide-react';
import mochiMascot from '@/assets/mochi-mascot.jpeg';
import teacherAvatar from '@/assets/teacher-avatar.png';

interface User {
  username: string;
  role: string;
  name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (!isAuthenticated || isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    // TODO: When database is connected, also invalidate session on server
    // await fetch('/api/auth/logout', { method: 'POST' });
    
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Users, label: 'Students', active: false },
    { icon: BookOpen, label: 'Lesson Plans', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img src={mochiMascot} alt="Mochi" className="w-12 h-12 rounded-full object-cover" />
            <span className="text-xl font-bold text-foreground">Mochi</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    item.active
                      ? 'bg-primary text-primary-foreground font-semibold'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">
              {user ? `Hello, ${user.name}` : 'Loading...'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="p-2 rounded-full hover:bg-muted transition-colors relative">
              <Bell size={22} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>

            {/* User avatar */}
            <div className="flex items-center gap-3">
              <img
                src={teacherAvatar}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user?.name || 'Teacher'}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Role'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick stats cards */}
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-primary" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Today</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">24</h3>
              <p className="text-muted-foreground">Students Present</p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">This Week</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">5</h3>
              <p className="text-muted-foreground">Lessons Planned</p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="w-8 h-8 text-primary" />
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Upcoming</span>
              </div>
              <h3 className="text-3xl font-bold text-foreground">3</h3>
              <p className="text-muted-foreground">Activities Today</p>
            </div>
          </div>

          {/* Mochi Assistant Section */}
          <div className="mt-8 bg-gradient-to-r from-primary/20 to-secondary rounded-2xl p-6 flex items-center gap-6">
            <img
              src={mochiMascot}
              alt="Mochi Assistant"
              className="w-24 h-24 rounded-full object-cover shadow-lg animate-pulse-soft"
            />
            <div>
              <h3 className="text-xl font-bold text-foreground">Mochi is ready to help!</h3>
              <p className="text-muted-foreground mt-1">
                Your virtual teaching assistant is here to support lesson planning, student tracking, and more.
              </p>
              <button className="mt-3 login-button text-sm py-2 px-6">
                Start Conversation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
