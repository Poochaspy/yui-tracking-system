import { UserCog, Search } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Trainee } from '@/models/Trainee';
import { Department } from '@/models/Department';
import CreateTraineeModal from '@/components/CreateTraineeModal';
import StatusDropdown from '@/components/StatusDropdown';

export const dynamic = 'force-dynamic';

async function getTrainees() {
  try {
    await dbConnect();
    const trainees = await Trainee.find({}).populate('departmentId').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(trainees));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TraineesPage() {
  const trainees = await getTrainees();
  await dbConnect();
  const departments = await Department.find({}).lean();
  const deptData = JSON.parse(JSON.stringify(departments));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainees</h1>
          <p className="text-slate-500 mt-1">Manage trainee allocations and attendance.</p>
        </div>
        <CreateTraineeModal departments={deptData} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search trainees..." 
              className="w-full bg-white  border border-slate-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No trainees found.</td>
                </tr>
              ) : (
                trainees.map((trainee: any) => (
                  <tr key={trainee._id} className="border-b border-slate-100 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{trainee.name}</td>
                    <td className="p-4 text-slate-500">{trainee.email}</td>
                    <td className="p-4 text-slate-500">{trainee.departmentId?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      <StatusDropdown currentStatus={trainee.status} personnelId={trainee._id} modelType="Trainee" />
                    </td>
                    <td className="p-4">
                      <CreateTraineeModal departments={deptData} trainee={trainee} />
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
