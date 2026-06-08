'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, UserCog, Building2, ClipboardList, Clock, FileText, PieChart } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Reports', href: '/reports', icon: PieChart },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Trainees', href: '/trainees', icon: UserCog },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  { name: 'Attendance', href: '/attendance', icon: Clock },
  { name: 'Shifts', href: '/shifts', icon: Clock },
  { name: 'Logs', href: '/logs', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-col h-full sticky top-0 hidden md:flex bg-white border-r border-slate-200 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
      <div className="h-20 flex items-center px-6 border-b border-slate-200 gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center shrink-0" id="logo-placeholder">
          <span className="text-[10px] text-slate-400 font-bold tracking-widest">LOGO</span>
        </div>
        <h1 className="text-xl font-bold text-slate-800 leading-tight tracking-tight">
          ARDRAM<br/>TRACKER
        </h1>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 text-xs text-center text-slate-500 font-medium">
        Ardram Tracker v2.0
      </div>
    </aside>
  );
}
