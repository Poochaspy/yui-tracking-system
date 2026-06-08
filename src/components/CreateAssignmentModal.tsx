'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createAssignment } from '@/actions';

export default function CreateAssignmentModal({ personnel }: { personnel: { _id: string, name: string, model: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createAssignment(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
      >
        <Plus className="w-5 h-5" />
        <span>New Assignment</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md rounded-2xl p-6 relative border border-white/20">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-4">New Task Assignment</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required name="title" type="text" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. ICU Morning Rounds" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea name="description" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Task details..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select required name="assignedTo" className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black dark:text-white">
                  <option value="" className="text-black dark:text-black">Select Personnel...</option>
                  {personnel.map(p => (
                    <option key={`${p.model}:${p._id}`} value={`${p.model}:${p._id}`} className="text-black dark:text-black">
                      {p.name} ({p.model === 'User' ? 'Employee' : 'Trainee'})
                    </option>
                  ))}
                </select>
              </div>
              <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl transition-colors disabled:opacity-50 mt-4">
                {loading ? 'Assigning...' : 'Assign Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
