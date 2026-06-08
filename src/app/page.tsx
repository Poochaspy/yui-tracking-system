import { Users, UserCog, Building2, ClipboardList, Activity, CheckCircle } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import { Trainee } from '@/models/Trainee';
import { Assignment } from '@/models/Assignment';
import { Department } from '@/models/Department';
import { ActivityLog } from '@/models/ActivityLog';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  await dbConnect();

  const totalEmployees = await User.countDocuments({});
  const totalTrainees = await Trainee.countDocuments({});
  
  const availableEmployees = await User.countDocuments({ status: 'Available' });
  const availableTrainees = await Trainee.countDocuments({ status: 'Available' });
  const availableStaff = availableEmployees + availableTrainees;

  const busyEmployees = await User.countDocuments({ status: 'Working' });
  const busyTrainees = await Trainee.countDocuments({ status: 'Working' });
  const busyStaff = busyEmployees + busyTrainees;

  const activeAssignments = await Assignment.countDocuments({ status: 'Pending' });
  const completedAssignments = await Assignment.countDocuments({ status: 'Completed' });

  const recentLogs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(8).lean();

  const departments = await Department.find({}).lean();
  
  const deptOccupancy = await Promise.all(departments.map(async (dept: any) => {
    const uCount = await User.countDocuments({ departmentId: dept._id });
    const tCount = await Trainee.countDocuments({ departmentId: dept._id });
    const assigned = uCount + tCount;
    const capacity = dept.capacity || 1;
    const percent = Math.min(100, Math.round((assigned / capacity) * 100));
    return { name: dept.name, assigned, capacity, percent };
  }));

  return {
    totalEmployees,
    totalTrainees,
    availableStaff,
    busyStaff,
    activeAssignments,
    completedAssignments,
    recentLogs: JSON.parse(JSON.stringify(recentLogs)),
    deptOccupancy
  };
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">
          Monitor your hospital operations, staff, and trainee activities in real-time.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <DashboardCard title="Employees" value={data.totalEmployees} icon={<Users className="w-5 h-5 text-blue-500" />} />
        <DashboardCard title="Trainees" value={data.totalTrainees} icon={<UserCog className="w-5 h-5 text-purple-500" />} />
        <DashboardCard title="Available Staff" value={data.availableStaff} icon={<Activity className="w-5 h-5 text-emerald-500" />} />
        <DashboardCard title="Busy Staff" value={data.busyStaff} icon={<Activity className="w-5 h-5 text-amber-500" />} />
        <DashboardCard title="Active Tasks" value={data.activeAssignments} icon={<ClipboardList className="w-5 h-5 text-orange-500" />} />
        <DashboardCard title="Completed" value={data.completedAssignments} icon={<CheckCircle className="w-5 h-5 text-emerald-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-card rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-6 text-slate-800">Department Occupancy</h2>
          <div className="space-y-5">
            {data.deptOccupancy.map((dept, idx) => (
              <OccupancyItem key={idx} name={dept.name} percent={dept.percent} text={`${dept.assigned}/${dept.capacity}`} />
            ))}
            {data.deptOccupancy.length === 0 && <p className="text-sm text-slate-500">No departments found.</p>}
          </div>
        </div>
        
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Activity Feed</h2>
          <div className="space-y-2">
            {data.recentLogs.map((log: any) => (
              <ActivityItem key={log._id} time={new Date(log.createdAt).toLocaleString()} text={log.description} action={log.action} />
            ))}
            {data.recentLogs.length === 0 && <p className="text-sm text-slate-500">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }: any) {
  return (
    <div className="glass-card rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{title}</p>
      </div>
      <div className="flex items-center justify-between mt-2">
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">{icon}</div>
      </div>
    </div>
  );
}

function ActivityItem({ time, text, action }: { time: string, text: string, action: string }) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-default border border-transparent hover:border-slate-100">
      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800">{text}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            {action}
          </span>
          <p className="text-xs text-slate-500">{time}</p>
        </div>
      </div>
    </div>
  );
}

function OccupancyItem({ name, percent, text }: { name: string, percent: number, text: string }) {
  const getColor = (p: number) => {
    if (p >= 100) return 'bg-red-500';
    if (p >= 80) return 'bg-amber-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-slate-700">{name}</span>
        <span className="font-medium text-slate-500">{text} ({percent}%)</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div 
          className={`${getColor(percent)} h-2 rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
