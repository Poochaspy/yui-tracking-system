import { Building2, Activity, Users, FileText } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Department } from '@/models/Department';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import { Assignment } from '@/models/Assignment';

export const dynamic = 'force-dynamic';

async function getReportData() {
  await dbConnect();
  
  const departments = await Department.find({}).lean();
  
  const deptOccupancy = await Promise.all(departments.map(async (dept: any) => {
    const uCount = await User.countDocuments({ departmentId: dept._id });
    const tCount = await Trainee.countDocuments({ departmentId: dept._id });
    const assigned = uCount + tCount;
    const capacity = dept.capacity || 1;
    const percent = Math.min(100, Math.round((assigned / capacity) * 100));
    return { name: dept.name, assigned, capacity, percent };
  }));

  const employees = await User.find({}).populate('departmentId').lean();
  const utilization = await Promise.all(employees.map(async (emp: any) => {
    const totalAssignments = await Assignment.countDocuments({ assignedTo: emp._id });
    const completedAssignments = await Assignment.countDocuments({ assignedTo: emp._id, status: 'Completed' });
    const completionRate = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0;
    
    return {
      name: emp.name,
      role: emp.role,
      department: emp.departmentId?.name || 'Unassigned',
      totalAssignments,
      completedAssignments,
      completionRate
    };
  }));

  return { deptOccupancy, utilization: utilization.sort((a, b) => b.totalAssignments - a.totalAssignments) };
}

export default async function ReportsPage() {
  const { deptOccupancy, utilization } = await getReportData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1">Detailed performance and utilization metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Building2 className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-slate-800">Department Occupancy Report</h2>
          </div>
          <div className="space-y-6">
            {deptOccupancy.map((dept, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">{dept.name}</span>
                  <span className="font-medium text-slate-500">{dept.assigned} / {dept.capacity} Staff ({dept.percent}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`${dept.percent >= 100 ? 'bg-red-500' : dept.percent >= 80 ? 'bg-amber-500' : 'bg-indigo-500'} h-3 rounded-full transition-all`} 
                    style={{ width: `${dept.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {deptOccupancy.length === 0 && <p className="text-slate-500">No departments found.</p>}
          </div>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden h-fit flex flex-col">
          <div className="p-6 border-b border-slate-200 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Activity className="w-5 h-5" /></div>
            <h2 className="text-xl font-bold text-slate-800">Employee Utilization</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">
                  <th className="p-4 font-medium">Employee</th>
                  <th className="p-4 font-medium">Department</th>
                  <th className="p-4 font-medium">Tasks (Done/Total)</th>
                  <th className="p-4 font-medium">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {utilization.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No employees found.</td>
                  </tr>
                ) : (
                  utilization.map((emp, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{emp.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{emp.role}</div>
                      </td>
                      <td className="p-4 text-slate-600">{emp.department}</td>
                      <td className="p-4 font-medium text-slate-700">{emp.completedAssignments} / {emp.totalAssignments}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${emp.completionRate}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-slate-700">{emp.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
