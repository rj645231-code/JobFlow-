import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { AppStore, Application, STATUS_CONFIG } from '@/lib/store';
import { TrendingUp, Target, Users, XCircle } from 'lucide-react';

const COLORS = {
  bg: '#0f1117',
  card: 'rgba(26,29,46,0.8)',
  border: 'rgba(255,255,255,0.07)',
  primary: '#6366f1',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
};

export default function AnalyticsPage() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    setApps(AppStore.getApplications());
  }, []);

  const total = apps.length || 1; // prevent div by zero

  const responseApps = apps.filter(a => !['Saved', 'Applied', 'Ghosted', 'Rejected', 'Withdrawn'].includes(a.status)).length;
  const interviewApps = apps.filter(a => ['Phone Screen', 'Interviewing', 'Technical', 'Offer', 'Accepted'].includes(a.status)).length;
  const offerApps = apps.filter(a => ['Offer', 'Accepted'].includes(a.status)).length;
  const rejectedApps = apps.filter(a => a.status === 'Rejected').length;

  const responseRate = ((responseApps / total) * 100).toFixed(1);
  const interviewRate = ((interviewApps / total) * 100).toFixed(1);
  const offerRate = ((offerApps / total) * 100).toFixed(1);
  const rejectionRate = ((rejectedApps / total) * 100).toFixed(1);

  const statusData = apps.reduce((acc, app) => {
    const existing = acc.find(item => item.name === app.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: app.status, value: 1, color: STATUS_CONFIG[app.status]?.color || '#8884d8' });
    }
    return acc;
  }, [] as any[]);

  const workTypeData = [
    { name: 'Remote', count: apps.filter(a => a.location?.toLowerCase().includes('remote')).length },
    { name: 'Hybrid', count: apps.filter(a => a.location?.toLowerCase().includes('hybrid')).length },
    { name: 'On-site', count: apps.filter(a => !a.location?.toLowerCase().includes('remote') && !a.location?.toLowerCase().includes('hybrid')).length },
  ];

  const companyCounts = apps.reduce((acc: any, app) => {
    acc[app.company] = (acc[app.company] || 0) + 1;
    return acc;
  }, {});
  const topCompaniesData = Object.entries(companyCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);

  const funnelData = [
    { stage: 'Applied', count: total },
    { stage: 'Responses', count: responseApps },
    { stage: 'Interviews', count: interviewApps },
    { stage: 'Offers', count: offerApps },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl flex items-center justify-between">
      <div>
        <p style={{ color: COLORS.textSecondary }} className="text-sm font-medium mb-1">{title}</p>
        <h3 style={{ color: COLORS.textPrimary }} className="text-3xl font-bold">{value}%</h3>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            Analytics & Insights
          </h1>
          <p style={{ color: COLORS.textSecondary }} className="mt-1">Track your job search conversion rates and performance.</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Response Rate" value={responseRate} icon={TrendingUp} color="#3b82f6" />
          <StatCard title="Interview Rate" value={interviewRate} icon={Target} color="#8b5cf6" />
          <StatCard title="Offer Rate" value={offerRate} icon={Users} color="#10b981" />
          <StatCard title="Rejection Rate" value={rejectionRate} icon={XCircle} color="#ef4444" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Status Breakdown</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Conversion Funnel</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} horizontal={false} />
                  <XAxis type="number" stroke={COLORS.textSecondary} />
                  <YAxis dataKey="stage" type="category" stroke={COLORS.textSecondary} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Applications by Work Type</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                  <XAxis dataKey="name" stroke={COLORS.textSecondary} />
                  <YAxis stroke={COLORS.textSecondary} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Top Target Companies</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCompaniesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                  <XAxis dataKey="name" stroke={COLORS.textSecondary} />
                  <YAxis stroke={COLORS.textSecondary} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
