'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { createTrainee, updateTrainee, deleteTrainee } from '@/actions';

export default function CreateTraineeModal({ departments, trainee }: { departments: any[], trainee?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!trainee;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.append('_id', trainee._id);
    
    const res = isEdit ? await updateTrainee(formData) : await createTrainee(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this trainee?')) return;
    setLoading(true);
    const res = await deleteTrainee(trainee._id);
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
          <span>Add Trainee</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl text-slate-800">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Trainee' : 'Add New Trainee'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required name="name" defaultValue={trainee?.name} type="text" className="enterprise-input" placeholder="e.g. Alice Smith" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input required name="email" defaultValue={trainee?.email} type="email" className="enterprise-input" placeholder="alice@example.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Department</label>
                <select name="departmentId" defaultValue={trainee?.departmentId?._id || trainee?.departmentId} className="enterprise-input">
                  <option value="">Unassigned</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <button disabled={loading} className="w-full enterprise-btn mt-4 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Trainee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
