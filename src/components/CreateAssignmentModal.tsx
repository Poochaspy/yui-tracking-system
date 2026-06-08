'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { createAssignment, updateAssignment, deleteAssignment } from '@/actions';

export default function CreateAssignmentModal({ personnel, assignment }: { personnel: any[], assignment?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!assignment;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.append('_id', assignment._id);
    
    const res = isEdit ? await updateAssignment(formData) : await createAssignment(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    setLoading(true);
    const res = await deleteAssignment(assignment._id);
    setLoading(false);
    if (!res.success) alert(res.error);
  }

  return (
    <>
      {isEdit ? (
        <div className="flex items-center gap-2">
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
          <span>New Task</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl text-slate-800">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Task' : 'Assign New Task'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Task Title</label>
                <input required name="title" defaultValue={assignment?.title} type="text" className="enterprise-input" placeholder="e.g. ICU Rounds" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea name="description" defaultValue={assignment?.description} className="enterprise-input h-24" placeholder="Task details..." />
              </div>
              {!isEdit && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Assign To</label>
                  <select required name="assignedTo" className="enterprise-input">
                    <option value="">Select Personnel</option>
                    {personnel.map(p => (
                      <option key={p._id} value={`${p.model}:${p._id}`}>{p.name} ({p.model})</option>
                    ))}
                  </select>
                </div>
              )}
              <button disabled={loading} className="w-full enterprise-btn mt-4 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Task'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
