import Link from 'next/link';
import { LayoutDashboard, Users, UserCog, Building2, ClipboardList, Clock, FileText } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Trainees', href: '/trainees', icon: UserCog },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Shifts', href: '/shifts', icon: Clock },
  { name: 'Logs', href: '/logs', icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="w-64 glass-panel border-r border-r-white/10 hidden md:flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          ARDRAM TRACKER
        </h1>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-white/10 hover:text-indigo-400"
          >
            <item.icon className="w-5 h-5 opacity-70" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10 text-xs text-center text-gray-500">
        v1.0.0
      </div>
    </aside>
  );
}
