import { Clock } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Shift } from '@/models/Shift';
import { ShiftAssignment } from '@/models/ShiftAssignment';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import CreateShiftModal from '@/components/CreateShiftModal';
import AssignShiftModal from '@/components/AssignShiftModal';

export const dynamic = 'force-dynamic';

async function getShiftData() {
  await dbConnect();
  const shifts = await Shift.find({}).lean();
  const assignments = await ShiftAssignment.find({}).populate('shiftId').populate('personnelId').sort({ date: -1 }).lean();
  
  const users = await User.find({}).lean();
  const trainees = await Trainee.find({}).lean();
  
  const personnel = [
    ...users.map((u: any) => ({ _id: u._id.toString(), name: u.name, model: 'User' })),
    ...trainees.map((t: any) => ({ _id: t._id.toString(), name: t.name, model: 'Trainee' }))
  ];

  return { 
    shifts: JSON.parse(JSON.stringify(shifts)), 
    assignments: JSON.parse(JSON.stringify(assignments)),
    personnel
  };
}

export default async function ShiftsPage() {
  const { shifts, assignments, personnel } = await getShiftData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shift Management</h1>
          <p className="text-slate-500 mt-1">Manage shift timings and assign personnel.</p>
        </div>
        <div className="flex gap-3">
          <AssignShiftModal shifts={shifts} personnel={personnel} />
          <CreateShiftModal />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Shift Types</h2>
            <div className="space-y-3">
              {shifts.length === 0 ? (
                <p className="text-slate-500 text-sm">No shift types defined.</p>
              ) : (
                shifts.map((shift: any) => (
                  <div key={shift._id} className="p-3 bg-white rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{shift.name}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3" />
                        {shift.startTime} - {shift.endTime}
                      </div>
                    </div>
                    <CreateShiftModal shift={shift} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden h-full">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-xl font-bold">Recent Assignments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Personnel</th>
                    <th className="p-4 font-medium">Shift</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-slate-500">No shifts assigned yet.</td>
                    </tr>
                  ) : (
                    assignments.map((assignment: any) => (
                      <tr key={assignment._id} className="border-b border-slate-100 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium">{assignment.date}</td>
                        <td className="p-4">{assignment.personnelId?.name || 'Unknown'}</td>
                        <td className="p-4 text-slate-500">
                          {assignment.shiftId?.name} ({assignment.shiftId?.startTime}-{assignment.shiftId?.endTime})
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
    </div>
  );
}
