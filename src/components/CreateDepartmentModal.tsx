'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { createDepartment, updateDepartment, deleteDepartment } from '@/actions';

export default function CreateDepartmentModal({ department }: { department?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!department;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.append('_id', department._id);
    
    const res = isEdit ? await updateDepartment(formData) : await createDepartment(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this department?')) return;
    setLoading(true);
    const res = await deleteDepartment(department._id);
    setLoading(false);
    if (!res.success) alert(res.error);
  }

  return (
    <>
      {isEdit ? (
        <div className="flex items-center gap-2 mt-4">
          <button onClick={() => setIsOpen(true)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors flex-1 flex justify-center">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors flex-1 flex justify-center">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="enterprise-btn flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Department</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-slate-800">{isEdit ? 'Edit Department' : 'Add New Department'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Name</label>
                <input required name="name" defaultValue={department?.name} type="text" className="enterprise-input" placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Capacity (Beds/Staff)</label>
                <input required name="capacity" defaultValue={department?.capacity} type="number" min="1" className="enterprise-input" placeholder="e.g. 50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-slate-700">Description</label>
                <textarea name="description" defaultValue={department?.description} className="enterprise-input h-24" placeholder="Brief description..." />
              </div>
              <button disabled={loading} className="w-full enterprise-btn mt-4 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Department'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
