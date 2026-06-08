import { FileText, Search, Clock } from 'lucide-react';
import dbConnect from '@/lib/mongodb';
import { ActivityLog } from '@/models/ActivityLog';
import '@/models/User';
import '@/models/Trainee';

export const dynamic = 'force-dynamic';

async function getLogs() {
  try {
    await dbConnect();
    const logs = await ActivityLog.find({}).populate('entityId').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(logs));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function LogsPage() {
  const logs = await getLogs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historical Logs</h1>
          <p className="text-slate-500 mt-1">Track movements and status changes over time.</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full bg-white  border border-slate-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
        
        <div className="divide-y divide-white/5">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No activity logs found.</div>
          ) : (
            logs.map((log: any) => (
              <div key={log._id} className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors">
                <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {log.entityId?.name || 'Unknown'} ({log.entityModel}) - {log.action}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{log.description}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
