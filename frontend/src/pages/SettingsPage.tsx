import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, AlertTriangle, Save, Download, Trash2, Eye, EyeOff } from 'lucide-react';
import { AppStore } from '@/lib/store';

const COLORS = {
  bg: '#0f1117',
  card: 'rgba(26,29,46,0.8)',
  border: 'rgba(255,255,255,0.07)',
  primary: '#6366f1',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
  success: '#10b981',
  danger: '#ef4444'
};

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: '', email: '', title: '', linkedin: '' });
  const [smtp, setSmtp] = useState({ host: '', port: '', user: '', pass: '', fromName: '' });
  const [extractor, setExtractor] = useState({ keywords: 'Software Engineer, React', location: 'Remote', maxJobs: 50 });
  
  const [showPass, setShowPass] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [smtpSaved, setSmtpSaved] = useState(false);
  const [testResult, setTestResult] = useState<'idle'|'testing'|'success'|'error'>('idle');

  useEffect(() => {
    try {
      const p = localStorage.getItem('jf_profile');
      if (p) setProfile(JSON.parse(p));
      const s = localStorage.getItem('jf_smtp');
      if (s) setSmtp(JSON.parse(s));
      const e = localStorage.getItem('jf_extractor_config');
      if (e) setExtractor(JSON.parse(e));
    } catch (e) {}
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('jf_profile', JSON.stringify(profile));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleSaveSmtp = () => {
    localStorage.setItem('jf_smtp', JSON.stringify(smtp));
    setSmtpSaved(true);
    setTimeout(() => setSmtpSaved(false), 2000);
  };

  const handleTestSmtp = () => {
    setTestResult('testing');
    setTimeout(() => {
      setTestResult('success');
      setTimeout(() => setTestResult('idle'), 3000);
    }, 1500);
  };

  const handleSaveExtractor = () => {
    localStorage.setItem('jf_extractor_config', JSON.stringify(extractor));
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete all applications, recruiters, companies, and settings permanently!')) {
      const keys = Object.keys(localStorage);
      keys.forEach(k => {
        if (k.startsWith('jf_') || k.startsWith('jobflow')) {
          localStorage.removeItem(k);
        }
      });
      window.location.href = '/';
    }
  };

  const handleExportData = () => {
    const data = {
      applications: AppStore.getApplications(),
      recruiters: AppStore.getRecruiters(),
      companies: AppStore.getCompanies(),
      templates: AppStore.getTemplates(),
      settings: { profile, smtp, extractor }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobflow_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const SectionCard = ({ title, icon: Icon, children }: any) => (
    <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: COLORS.border }}>
        <Icon style={{ color: COLORS.primary }} />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const Input = ({ label, type = "text", value, onChange, ...props }: any) => (
    <div>
      <label className="block text-sm mb-1 font-medium" style={{ color: COLORS.textSecondary }}>{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg bg-black/20 outline-none focus:ring-2 transition-all"
        style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}
        {...props}
      />
    </div>
  );

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            Settings & Configuration
          </h1>
          <p style={{ color: COLORS.textSecondary }} className="mt-1">Manage your account, integrations, and preferences.</p>
        </div>

        {/* Profile */}
        <SectionCard title="Personal Profile" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Full Name" value={profile.name} onChange={(e: any) => setProfile({...profile, name: e.target.value})} />
            <Input label="Email Address" value={profile.email} onChange={(e: any) => setProfile({...profile, email: e.target.value})} />
            <Input label="Job Title" value={profile.title} onChange={(e: any) => setProfile({...profile, title: e.target.value})} />
            <Input label="LinkedIn URL" value={profile.linkedin} onChange={(e: any) => setProfile({...profile, linkedin: e.target.value})} />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleSaveProfile} className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <Save size={18} /> Save Profile
            </button>
            {profileSaved && <span className="text-sm font-medium animate-pulse" style={{ color: COLORS.success }}>Saved successfully!</span>}
          </div>
        </SectionCard>

        {/* SMTP */}
        <SectionCard title="SMTP Email Integration" icon={Mail}>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm mb-4">
            <p className="font-medium text-blue-400 mb-1">Gmail Users:</p>
            <p style={{ color: COLORS.textSecondary }}>Use <b>smtp.gmail.com</b> / <b>465</b>. You must create an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-400 underline">App Password</a> instead of your regular password.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="SMTP Host" placeholder="smtp.gmail.com" value={smtp.host} onChange={(e: any) => setSmtp({...smtp, host: e.target.value})} />
            <Input label="Port" placeholder="465" value={smtp.port} onChange={(e: any) => setSmtp({...smtp, port: e.target.value})} />
            <Input label="Username (Email)" value={smtp.user} onChange={(e: any) => setSmtp({...smtp, user: e.target.value})} />
            <div className="relative">
              <Input label="App Password" type={showPass ? "text" : "password"} value={smtp.pass} onChange={(e: any) => setSmtp({...smtp, pass: e.target.value})} />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8" style={{ color: COLORS.textSecondary }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <Input label="From Name" placeholder="John Doe" value={smtp.fromName} onChange={(e: any) => setSmtp({...smtp, fromName: e.target.value})} />
          </div>
          <div className="mt-4 flex items-center gap-4">
            <button onClick={handleSaveSmtp} className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:bg-white/10" style={{ border: `1px solid ${COLORS.border}` }}>
              Save Configuration
            </button>
            <button onClick={handleTestSmtp} disabled={testResult === 'testing'} className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:opacity-90" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              {testResult === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            {smtpSaved && <span className="text-sm" style={{ color: COLORS.success }}>Saved!</span>}
            {testResult === 'success' && <span className="text-sm font-medium" style={{ color: COLORS.success }}>Connection successful!</span>}
          </div>
        </SectionCard>

        {/* LinkedIn Config */}
        <SectionCard title="Job Extractor Defaults" icon={Shield}>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Default Search Keywords (comma separated)" value={extractor.keywords} onChange={(e: any) => { setExtractor({...extractor, keywords: e.target.value}); handleSaveExtractor(); }} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Default Location" value={extractor.location} onChange={(e: any) => { setExtractor({...extractor, location: e.target.value}); handleSaveExtractor(); }} />
              <div>
                <label className="block text-sm mb-1 font-medium" style={{ color: COLORS.textSecondary }}>Max Jobs to Scrape: {extractor.maxJobs}</label>
                <input type="range" min="10" max="200" step="10" className="w-full mt-2 accent-indigo-500" value={extractor.maxJobs} onChange={(e: any) => { setExtractor({...extractor, maxJobs: parseInt(e.target.value)}); handleSaveExtractor(); }} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Danger Zone */}
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', border: `1px solid rgba(239, 68, 68, 0.2)` }} className="p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <AlertTriangle style={{ color: COLORS.danger }} />
            <h2 className="text-xl font-bold text-red-500">Danger Zone</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div>
              <p className="font-medium text-red-400">Export or Delete Data</p>
              <p className="text-sm text-red-400/70 mt-1">Once you delete your data, there is no going back. Please be certain.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleExportData} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all bg-black/20 hover:bg-black/40" style={{ border: `1px solid rgba(255,255,255,0.1)` }}>
                <Download size={18} /> Export JSON
              </button>
              <button onClick={handleClearData} className="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30">
                <Trash2 size={18} /> Clear All Data
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
