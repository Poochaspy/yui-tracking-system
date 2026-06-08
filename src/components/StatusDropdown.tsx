'use client';
import { useState, useTransition } from 'react';
import { updateStatus } from '@/actions';
import { ChevronDown } from 'lucide-react';

const statuses = ['Working', 'Available', 'On Break', 'Off Duty'];

export default function StatusDropdown({ currentStatus, personnelId, modelType }: { currentStatus: string, personnelId: string, modelType: 'User' | 'Trainee' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = async (newStatus: string) => {
    setIsOpen(false);
    if (newStatus === currentStatus) return;
    
    startTransition(async () => {
      const res = await updateStatus(personnelId, modelType, newStatus);
      if (!res.success) alert(res.error);
    });
  };

  const getStatusColor = (status: string) => {
    if (status === 'Working') return 'bg-emerald-500/20 text-emerald-500';
    if (status === 'Available') return 'bg-blue-500/20 text-blue-500';
    if (status === 'On Break') return 'bg-amber-500/20 text-amber-500';
    return 'bg-gray-500/20 text-slate-500';
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 transition-opacity ${getStatusColor(currentStatus)} ${isPending ? 'opacity-50' : 'hover:opacity-80'}`}
      >
        {isPending ? 'Updating...' : currentStatus}
        <ChevronDown className="w-3 h-3" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-32 rounded-xl glass-panel border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="py-1 bg-[#1e1e1e]">
              {statuses.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors ${currentStatus === s ? 'font-bold ' : 'text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
