import { Users, Search } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Department } from '@/models/Department';
import CreateEmployeeModal from '@/components/CreateEmployeeModal';
import StatusDropdown from '@/components/StatusDropdown';

export const dynamic = 'force-dynamic';

async function getEmployees() {
  try {
    await dbConnect();
    const employees = await User.find({}).populate('departmentId').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(employees));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const departments = await Department.find({}).lean();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-gray-500 mt-1">Manage staff directory and working status.</p>
        </div>
        <CreateEmployeeModal departments={JSON.parse(JSON.stringify(departments))} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No employees found.</td>
                </tr>
              ) : (
                employees.map((emp: any) => (
                  <tr key={emp._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{emp.name}</td>
                    <td className="p-4 text-gray-500">{emp.email}</td>
                    <td className="p-4 text-gray-500">{emp.departmentId?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      <StatusDropdown currentStatus={emp.status} personnelId={emp._id} modelType="User" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
