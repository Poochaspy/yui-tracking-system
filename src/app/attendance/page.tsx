import { Clock, Search } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { Attendance } from '@/models/Attendance';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import CheckInButton from '@/components/CheckInButton';

export const dynamic = 'force-dynamic';

async function getAttendanceData() {
  await dbConnect();
  const date = new Date().toISOString().split('T')[0];
  
  const attendanceRecords = await Attendance.find({ date }).lean();
  const checkedInSet = new Set(attendanceRecords.map(a => a.personnelId.toString()));
  
  const users = await User.find({}).lean();
  const trainees = await Trainee.find({}).lean();
  
  const personnel = [
    ...users.map((u: any) => ({ _id: u._id.toString(), name: u.name, model: 'User', hasCheckedIn: checkedInSet.has(u._id.toString()) })),
    ...trainees.map((t: any) => ({ _id: t._id.toString(), name: t.name, model: 'Trainee', hasCheckedIn: checkedInSet.has(t._id.toString()) }))
  ];

  return { personnel };
}

export default async function AttendancePage() {
  const { personnel } = await getAttendanceData();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-gray-500 mt-1">Daily clock-in logs for today.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search personnel..." 
              className="w-full bg-black/5 dark:bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-sm text-gray-500">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person: any) => (
                <tr key={person._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{person.name}</td>
                  <td className="p-4 text-gray-500">{person.model === 'User' ? 'Employee' : 'Trainee'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      person.hasCheckedIn ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'
                    }`}>
                      {person.hasCheckedIn ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td className="p-4">
                    <CheckInButton 
                      personnelId={person._id} 
                      personnelModel={person.model} 
                      hasCheckedIn={person.hasCheckedIn} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
