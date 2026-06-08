'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { createShift, updateShift, deleteShift } from '@/actions';

export default function CreateShiftModal({ shift }: { shift?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!shift;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.append('_id', shift._id);
    
    const res = isEdit ? await updateShift(formData) : await createShift(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this shift?')) return;
    setLoading(true);
    const res = await deleteShift(shift._id);
    setLoading(false);
    if (!res.success) alert(res.error);
  }

  return (
    <>
      {isEdit ? (
        <div className="flex items-center gap-1">
          <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-800 p-1">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800 p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="enterprise-btn flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Shift</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl text-slate-800">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Shift' : 'Create New Shift'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Shift Name</label>
                <input required name="name" defaultValue={shift?.name} type="text" className="enterprise-input" placeholder="e.g. Morning Shift" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Start Time</label>
                  <input required name="startTime" defaultValue={shift?.startTime} type="time" className="enterprise-input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">End Time</label>
                  <input required name="endTime" defaultValue={shift?.endTime} type="time" className="enterprise-input" />
                </div>
              </div>
              <button disabled={loading} className="w-full enterprise-btn mt-4 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Shift'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
