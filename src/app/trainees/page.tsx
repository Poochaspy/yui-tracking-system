import { UserCog, Plus, Search } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Trainee } from '@/models/Trainee';
import '@/models/Department'; // Ensure Department model is registered

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainees</h1>
          <p className="text-gray-500 mt-1">Manage trainee allocations and attendance.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
          <Plus className="w-5 h-5" />
          <span>Add Trainee</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search trainees..." 
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
              {trainees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No trainees found.</td>
                </tr>
              ) : (
                trainees.map((trainee: any) => (
                  <tr key={trainee._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{trainee.name}</td>
                    <td className="p-4 text-gray-500">{trainee.email}</td>
                    <td className="p-4 text-gray-500">{trainee.departmentId?.name || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trainee.status === 'Working' ? 'bg-emerald-500/20 text-emerald-500' :
                        trainee.status === 'Available' ? 'bg-blue-500/20 text-blue-500' :
                        trainee.status === 'On Break' ? 'bg-amber-500/20 text-amber-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {trainee.status}
                      </span>
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
