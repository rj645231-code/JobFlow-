import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { AppStore, Application, Recruiter, Company, STATUS_CONFIG } from '@/lib/store';
import {
  Briefcase,
  Building2,
  Users,
  CheckCircle2,
  Phone,
  Trophy,
  Mail,
  Search,
  FileText
} from 'lucide-react';

const COLORS = {
  bg: '#0f1117',
  card: 'rgba(26,29,46,0.8)',
  border: 'rgba(255,255,255,0.07)',
  primary: '#6366f1',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
};

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('User');
  const [apps, setApps] = useState<Application[]>([]);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    try {
      const auth = localStorage.getItem('jobflow-auth');
      if (auth) {
        const parsed = JSON.parse(auth);
        if (parsed?.name) setUserName(parsed.name);
      }
    } catch (e) {}

    setApps(AppStore.getApplications());
    setRecruiters(AppStore.getRecruiters());
    setCompanies(AppStore.getCompanies());
  }, []);

  const totalApps = apps.length;
  const totalCompanies = companies.length;
  const totalRecruiters = recruiters.length;

  const activeApps = apps.filter(a => !['Rejected', 'Ghosted', 'Withdrawn'].includes(a.status)).length;
  const interviewApps = apps.filter(a => ['Phone Screen', 'Interviewing', 'Technical'].includes(a.status)).length;
  const offerApps = apps.filter(a => ['Offer', 'Accepted'].includes(a.status)).length;

  const recentApps = [...apps].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusData = apps.reduce((acc, app) => {
    const existing = acc.find(item => item.name === app.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: app.status, value: 1, color: STATUS_CONFIG[app.status]?.color || '#8884d8' });
    }
    return acc;
  }, [] as any[]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = days.map(day => ({ name: day, count: 0 }));
  apps.forEach(app => {
    const d = new Date(app.createdAt).getDay();
    weeklyData[d].count += 1;
  });

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl flex items-center justify-between">
      <div>
        <p style={{ color: COLORS.textSecondary }} className="text-sm font-medium mb-1">{title}</p>
        <h3 style={{ color: COLORS.textPrimary }} className="text-3xl font-bold">{value}</h3>
      </div>
      <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20`, color }}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Welcome back, {userName}
            </h1>
            <p style={{ color: COLORS.textSecondary }} className="mt-1">Here's what's happening with your job search today.</p>
          </div>
          <div className="flex gap-4">
            <Link to="/job-discovery" className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: 'white' }}>
              <Search size={18} /> Find Jobs
            </Link>
            <Link to="/bulk-email" className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:bg-white/10" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}>
              <Mail size={18} /> Email Campaign
            </Link>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { to: '/applications', icon: Briefcase, label: 'Applications' },
            { to: '/job-discovery', icon: Search, label: 'Job Discovery' },
            { to: '/templates', icon: FileText, label: 'Templates' },
            { to: '/bulk-email', icon: Mail, label: 'Bulk Email' },
          ].map((action, i) => (
            <Link key={i} to={action.to} className="flex-1 min-w-[150px] p-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/5" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <action.icon size={18} style={{ color: COLORS.primary }} />
              <span className="font-medium">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Total Applications" value={totalApps} icon={Briefcase} color="#3b82f6" />
          <StatCard title="Companies Targeted" value={totalCompanies} icon={Building2} color="#8b5cf6" />
          <StatCard title="Recruiters Added" value={totalRecruiters} icon={Users} color="#10b981" />
          <StatCard title="Active Applications" value={activeApps} icon={CheckCircle2} color="#f59e0b" />
          <StatCard title="Interviews" value={interviewApps} icon={Phone} color="#ec4899" />
          <StatCard title="Offers" value={offerApps} icon={Trophy} color="#22c55e" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Applications this Week</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                  <XAxis dataKey="name" stroke={COLORS.textSecondary} />
                  <YAxis stroke={COLORS.textSecondary} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: COLORS.bg, borderColor: COLORS.border, borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-6">Application Status</h3>
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
        </div>

        {/* Recent Applications Table */}
        <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="rounded-xl overflow-hidden">
          <div className="p-6 border-b" style={{ borderColor: COLORS.border }}>
            <h3 className="text-lg font-bold">Recent Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                <tr>
                  <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Role</th>
                  <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Company</th>
                  <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Date</th>
                  <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app.id} className="border-b last:border-0 transition-colors hover:bg-white/5" style={{ borderColor: COLORS.border }}>
                    <td className="p-4 font-medium">{app.role}</td>
                    <td className="p-4">{app.company}</td>
                    <td className="p-4" style={{ color: COLORS.textSecondary }}>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                        backgroundColor: STATUS_CONFIG[app.status]?.bg || '#222',
                        color: STATUS_CONFIG[app.status]?.color || '#fff',
                        border: `1px solid ${STATUS_CONFIG[app.status]?.border || '#333'}` 
                      }}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentApps.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center" style={{ color: COLORS.textSecondary }}>
                      No applications found. Time to start applying!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
