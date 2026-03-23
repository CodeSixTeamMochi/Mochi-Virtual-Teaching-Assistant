import { useState, useEffect } from 'react';

export default function HeroBanner({ lessonCount }: { lessonCount: number }) {
  const [todayBirthday, setTodayBirthday] = useState<string | null>(null);

  useEffect(() => {
    // Checking for local timezone birthdays from localStorage
    const saved = localStorage.getItem('mochi_events');
    if (saved) {
      const allEvents = JSON.parse(saved);
      const today = new Date();
      const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const birthdayEvent = allEvents.find((e: any) => 
        e.date === todayStr && (e.type === "holiday" || e.title.toLowerCase().includes("birthday"))
      );
      if (birthdayEvent) setTodayBirthday(birthdayEvent.title);
    }
  }, []);

  return (
    <div className="space-y-4">
      {todayBirthday && (
        <div className="inline-flex items-center bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-600">
            Today is <span className="font-extrabold text-slate-800">{todayBirthday}</span>
          </p>
        </div>
      )}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold mb-2">Good Morning, Teacher! 👋</h1>
          <p className="text-cyan-100 text-lg">You have {lessonCount} lessons scheduled for today. Let's make it a great day!</p>
        </div>
        <div className="hidden md:flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm text-5xl">
          🐵
        </div>
      </div>
    </div>
  );
}