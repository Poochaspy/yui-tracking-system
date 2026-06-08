'use client';
import { useState } from 'react';
import { Clock } from 'lucide-react';
import { checkIn } from '@/actions';

export default function CheckInButton({ personnelId, personnelModel, hasCheckedIn }: { personnelId: string, personnelModel: string, hasCheckedIn: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckIn() {
    setLoading(true);
    const res = await checkIn(personnelId, personnelModel as any);
    setLoading(false);
    if (!res.success) alert(res.error);
  }

  if (hasCheckedIn) {
    return (
      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-500 text-xs font-medium rounded-full flex items-center gap-1 w-fit">
        <Clock className="w-3 h-3" /> Checked In
      </span>
    );
  }

  return (
    <button 
      onClick={handleCheckIn}
      disabled={loading}
      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-full transition-colors disabled:opacity-50"
    >
      {loading ? 'Clocking in...' : 'Clock In'}
    </button>
  );
}
