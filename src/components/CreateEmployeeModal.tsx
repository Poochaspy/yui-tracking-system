'use client';
import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { createEmployee, updateEmployee, deleteEmployee } from '@/actions';

export default function CreateEmployeeModal({ departments, employee }: { departments: any[], employee?: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!employee;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (isEdit) formData.append('_id', employee._id);
    
    const res = isEdit ? await updateEmployee(formData) : await createEmployee(formData);
    setLoading(false);
    if (res.success) {
      setIsOpen(false);
    } else {
      alert(res.error);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    setLoading(true);
    const res = await deleteEmployee(employee._id);
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
          <span>Add Employee</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-xl text-slate-800">
            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required name="name" defaultValue={employee?.name} type="text" className="enterprise-input" placeholder="e.g. Dr. Sarah Smith" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input required name="email" defaultValue={employee?.email} type="email" className="enterprise-input" placeholder="sarah@hospital.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <select name="role" defaultValue={employee?.role || 'staff'} className="enterprise-input">
                  <option value="staff">Staff</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Department</label>
                <select name="departmentId" defaultValue={employee?.departmentId?._id || employee?.departmentId} className="enterprise-input">
                  <option value="">Unassigned</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <button disabled={loading} className="w-full enterprise-btn mt-4 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
