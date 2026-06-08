import { ClipboardList, Search } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Assignment } from '@/models/Assignment';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import CreateAssignmentModal from '@/components/CreateAssignmentModal';
import TaskStatusButton from '@/components/TaskStatusButton';

export const dynamic = 'force-dynamic';

async function getAssignments() {
  try {
    await dbConnect();
    const assignments = await Assignment.find({}).populate('assignedTo').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(assignments));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function AssignmentsPage() {
  const assignments = await getAssignments();

  await dbConnect();
  const users = await User.find({}).lean();
  const trainees = await Trainee.find({}).lean();
  
  const personnel = [
    ...users.map((u: any) => ({ _id: u._id.toString(), name: u.name, model: 'User' })),
    ...trainees.map((t: any) => ({ _id: t._id.toString(), name: t.name, model: 'Trainee' }))
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-gray-500 mt-1">Manage and track tasks assigned to personnel.</p>
        </div>
        <CreateAssignmentModal personnel={personnel} />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-500">
                <th className="p-4 font-medium">Task Title</th>
                <th className="p-4 font-medium">Assigned To</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No assignments found.</td>
                </tr>
              ) : (
                assignments.map((assignment: any) => (
                  <tr key={assignment._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{assignment.title}</td>
                    <td className="p-4 text-gray-500">{assignment.assignedTo?.name || 'Unknown'}</td>
                    <td className="p-4 text-gray-500">{assignment.assignedModel}</td>
                    <td className="p-4">
                      <TaskStatusButton currentStatus={assignment.status} assignmentId={assignment._id} />
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
