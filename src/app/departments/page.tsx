import { Building2, Plus } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Department } from '@/models/Department';

export const dynamic = 'force-dynamic';

async function getDepartments() {
  await dbConnect();
  const departments = await Department.find({}).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(departments));
}

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-gray-500 mt-1">Manage hospital departments and their capacity.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span>New Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center text-gray-500">
            No departments found. Create one to get started.
          </div>
        ) : (
          departments.map((dept: any) => (
            <div key={dept._id} className="glass-card rounded-2xl p-6 hover:border-indigo-500/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                  Capacity: {dept.capacity}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{dept.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {dept.description || 'No description provided.'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
