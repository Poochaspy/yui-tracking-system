'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Mon', attendance: 85 },
  { name: 'Tue', attendance: 92 },
  { name: 'Wed', attendance: 88 },
  { name: 'Thu', attendance: 95 },
  { name: 'Fri', attendance: 90 },
  { name: 'Sat', attendance: 65 },
  { name: 'Sun', attendance: 50 },
];

const pieData = [
  { name: 'Cardiology', value: 40 },
  { name: 'Emergency', value: 30 },
  { name: 'Neurology', value: 15 },
  { name: 'Pediatrics', value: 15 },
];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6'];

export function AttendanceChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
          <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
          />
          <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentPieChart() {
  return (
    <div className="h-[250px] w-full mt-4 flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
