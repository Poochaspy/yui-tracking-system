import { Users, Building2, ClipboardList, Activity } from 'lucide-react';
import { AttendanceChart, DepartmentPieChart } from '@/components/DashboardCharts';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Monitor your hospital operations, staff, and trainee activities in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Personnel" 
          value="142" 
          subtitle="+12 this month" 
          icon={<Users className="w-5 h-5 text-indigo-500" />} 
        />
        <DashboardCard 
          title="Active Departments" 
          value="8" 
          subtitle="All operational" 
          icon={<Building2 className="w-5 h-5 text-purple-500" />} 
        />
        <DashboardCard 
          title="Pending Assignments" 
          value="24" 
          subtitle="4 overdue" 
          icon={<ClipboardList className="w-5 h-5 text-pink-500" />} 
        />
        <DashboardCard 
          title="On Shift Today" 
          value="89" 
          subtitle="87% attendance" 
          icon={<Activity className="w-5 h-5 text-emerald-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-1">Attendance Trends</h2>
          <p className="text-sm text-gray-500">7-day rolling average</p>
          <AttendanceChart />
        </div>
        
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
          <div className="w-full text-left">
            <h2 className="text-xl font-bold mb-1">Department Allocation</h2>
            <p className="text-sm text-gray-500">Distribution of active personnel</p>
          </div>
          <DepartmentPieChart />
          <div className="w-full mt-4 space-y-2">
            <LegendItem color="#6366f1" label="Cardiology" value="40%" />
            <LegendItem color="#8b5cf6" label="Emergency" value="30%" />
            <LegendItem color="#ec4899" label="Neurology" value="15%" />
            <LegendItem color="#14b8a6" label="Pediatrics" value="15%" />
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity Logs</h2>
          <div className="space-y-4">
            <ActivityItem time="10 mins ago" text="Dr. Smith changed status to 'Working'" />
            <ActivityItem time="1 hour ago" text="Trainee Alice assigned to Cardiology" />
            <ActivityItem time="2 hours ago" text="Task 'ICU Rounds' completed by Mark" />
            <ActivityItem time="5 hours ago" text="New department 'Neurology' added" />
          </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label, value }: { color: string, label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
        <span>{label}</span>
      </div>
      <span className="font-medium text-gray-400">{value}</span>
    </div>
  );
}

function DashboardCard({ title, value, subtitle, icon }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-2 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className="p-2 bg-white/5 rounded-lg border border-white/10">{icon}</div>
      </div>
      <div>
        <h3 className="text-3xl font-bold">{value}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string, text: string }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
      <div className="flex-1">
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function OccupancyItem({ name, percent }: { name: string, percent: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span>{name}</span>
        <span className="font-medium">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
