import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface TimetableSlot {
  id: number;
  day: string;
  time_from: string;
  time_to: string;
  subject: string;
  type: string;
}

export default function TimetablePage() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    day: 'Monday',
    time_from: '',
    time_to: '',
    subject: '',
    type: 'Activity'
  });

  const fetchSlots = () => {
  fetch('http://localhost:5000/api/timetable') 
    .then(res => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then(data => {
      setSlots(data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error("Fetch error:", err);
      setIsLoading(false);
    });
};

  useEffect(() => { fetchSlots(); }, []);

  const handleEdit = (slot: TimetableSlot) => {
    setEditingId(slot.id);
    setFormData({
      day: slot.day.trim(),
      time_from: slot.time_from,
      time_to: slot.time_to,
      subject: slot.subject,
      type: slot.type
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/timetable/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSlots();
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId 
      ? `http://localhost:5000/api/timetable/${editingId}` 
      : 'http://localhost:5000/api/timetable';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setEditingId(null);
        fetchSlots();
        setFormData({ day: 'Monday', time_from: '', time_to: '', subject: '', type: 'Activity' });
      }
    } catch (err) { console.error(err); }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen bg-[#edf2f7] text-[#334155] font-sans pb-10">
      <div className="bg-white border-b border-[#e2e8f0] shadow-sm sticky top-0 z-50">
        <div className="p-4 px-6 flex justify-between items-center max-w-[1200px] mx-auto">
          <div className="text-[17px] font-black text-[#1e293b] font-nunito flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="p-1 hover:bg-slate-100 rounded-full">← Back</button>
            Full Weekly Timetable
          </div>
          <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-[#0891b2] text-white px-4 py-2 rounded-[10px] text-[13px] font-bold hover:bg-[#0e7490] transition-all">
            + Add New Slot
          </button>
        </div>
      </div>

      <div className="p-6 max-w-[1200px] mx-auto animate-[fadeUp_0.3s_ease_both]">
        {isLoading ? (
          <div className="text-center py-10 font-bold text-[#0891b2]">Loading...</div>
        ) : (
          <div className="flex flex-col gap-8">
            {days.map(day => {
              const daySlots = slots.filter(s => s.day.trim() === day);
              if (daySlots.length === 0) return null;
              return (
                <div key={day} className="flex flex-col gap-3">
                  <h2 className="text-[16px] font-black text-[#1e293b] flex items-center gap-2"><span className="w-2 h-5 bg-[#0891b2] rounded-full"></span>{day}</h2>
                  <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[#64748b] text-[11px] uppercase">
                          <th className="p-4 font-bold">Time</th>
                          <th className="p-4 font-bold">Subject</th>
                          <th className="p-4 font-bold text-right pr-10">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {daySlots.map((slot) => (
                          <tr key={slot.id} className="border-b border-[#e2e8f0] last:border-0 hover:bg-[#f1f5f9] transition-colors text-[14px]">
                            <td className="p-4 font-medium text-[#64748b]">{slot.time_from} – {slot.time_to}</td>
                            <td className="p-4 font-bold text-[#1e293b]">{slot.subject}</td>
                            <td className="p-4 text-right pr-6">
                              <button onClick={() => handleEdit(slot)} className="p-2 text-[#0891b2] hover:bg-[#ecfeff] rounded-lg transition-colors mr-1">✎</button>
                              <button onClick={() => handleDelete(slot.id)} className="p-2 text-[#ef4444] hover:bg-[#fef2f2] rounded-lg transition-colors">🗑</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================= MODAL (Add/Edit) ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-[#f1f5f9] flex justify-between items-center bg-[#f8fafc]">
              <h3 className="font-black text-[#1e293b] text-[18px]">{editingId ? 'Edit Slot' : 'Add Timetable Slot'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#94a3b8] hover:text-[#1e293b]">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {/* Form fields same as before... day, time, subject, category */}
              <div>
                <label className="text-[12px] font-bold text-[#64748b] uppercase block mb-1">Day</label>
                <select value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full p-2.5 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]">
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[12px] font-bold text-[#64748b] uppercase block mb-1">From</label>
                  <input type="time" required value={formData.time_from} onChange={e => setFormData({...formData, time_from: e.target.value})} className="w-full p-2.5 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]" />
                </div>
                <div className="flex-1">
                  <label className="text-[12px] font-bold text-[#64748b] uppercase block mb-1">To</label>
                  <input type="time" required value={formData.time_to} onChange={e => setFormData({...formData, time_to: e.target.value})} className="w-full p-2.5 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]" />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#64748b] uppercase block mb-1">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full p-2.5 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc]" />
              </div>
              <button type="submit" className="w-full bg-[#0891b2] text-white py-3 rounded-[12px] font-black mt-2 hover:bg-[#0e7490]">
                {editingId ? 'Update Slot' : 'Save to Timetable'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}