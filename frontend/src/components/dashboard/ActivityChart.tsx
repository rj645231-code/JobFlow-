import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Mon', emails: 4, replies: 2 },
  { name: 'Tue', emails: 7, replies: 3 },
  { name: 'Wed', emails: 5, replies: 1 },
  { name: 'Thu', emails: 12, replies: 5 },
  { name: 'Fri', emails: 8, replies: 4 },
  { name: 'Sat', emails: 2, replies: 0 },
  { name: 'Sun', emails: 1, replies: 1 },
];

interface ActivityChartProps {
  data?: any[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data = mockData }) => {
  return (
    <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-white/5 shadow-xl w-full h-[350px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Activity Overview</h3>
          <p className="text-sm text-gray-400">Emails sent and replies received this week</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-xs text-gray-400">Emails Sent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400" />
            <span className="text-xs text-gray-400">Replies</span>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{
                backgroundColor: '#13151f',
                borderColor: '#ffffff10',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                color: '#fff'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Bar 
              dataKey="emails" 
              name="Emails Sent" 
              fill="#6366f1" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
            <Bar 
              dataKey="replies" 
              name="Replies" 
              fill="#c084fc" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
