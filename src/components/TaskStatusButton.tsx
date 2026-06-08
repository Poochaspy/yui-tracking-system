'use client';
import { useTransition } from 'react';
import { updateAssignmentStatus } from '@/actions';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TaskStatusButton({ assignmentId, currentStatus }: { assignmentId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const isCompleted = currentStatus === 'Completed';

  const toggleStatus = () => {
    startTransition(async () => {
      const newStatus = isCompleted ? 'Pending' : 'Completed';
      const res = await updateAssignmentStatus(assignmentId, newStatus);
      if (!res.success) alert(res.error);
    });
  };

  return (
    <button 
      onClick={toggleStatus}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all ${
        isCompleted ? 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : <Circle className="w-3 h-3" />}
      {isPending ? 'Saving...' : (isCompleted ? 'Completed' : 'Pending')}
    </button>
  );
}
