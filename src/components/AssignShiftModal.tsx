'use client';
import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { createShiftAssignment } from '@/actions';

export default function AssignShiftModal({ shifts, personnel }: { shifts: any[], personnel: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createShiftAssignment(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700  px-4 py-2 rounded-xl transition-colors shadow-lg shadow-purple-500/30">
        <Calendar className="w-5 h-5" />
        <span>Assign Shift</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white0 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 relative border border-white/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-500 hover:text-gray-800 dark:hover:">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Assign Shift</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Shift</label>
                <select required name="shiftId" className="w-full bg-white  border border-black/10 dark:border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:">
                  <option value="" className="text-black dark:text-black">Choose...</option>
                  {shifts.map(s => <option key={s._id} value={s._id} className="text-black dark:text-black">{s.name} ({s.startTime}-{s.endTime})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Personnel</label>
                <select required name="personnelId" className="w-full bg-white  border border-black/10 dark:border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:">
                  <option value="" className="text-black dark:text-black">Choose...</option>
                  {personnel.map(p => <option key={`${p.model}:${p._id}`} value={`${p.model}:${p._id}`} className="text-black dark:text-black">{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input required name="date" type="date" className="w-full bg-white  border border-black/10 dark:border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700  font-medium py-2 rounded-xl transition-colors disabled:opacity-50 mt-4">
                {loading ? 'Assigning...' : 'Assign Shift'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
