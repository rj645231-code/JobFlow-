import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Zap, Search, Settings2, RefreshCw, ExternalLink, Plus,
  CheckCircle2, Trash2, X, ChevronRight, Wifi, WifiOff,
  Briefcase, MapPin, Code2, Clock, SlidersHorizontal,
  Sparkles, BarChart2, Palette, DollarSign, Users, ShoppingBag,
  FileText, Package, PenTool, Headphones, Scale, TrendingUp,
} from 'lucide-react';
import { ExtractorAPI, ExtractorConfig, DiscoveredJob, DEFAULT_CONFIG, AppStore } from '@/lib/store';

// ─── Domain config ────────────────────────────────────────────────────────────
interface DomainPreset {
  domain: string;
  keywords: string[];
  skills: string[];
  job_count: number;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  'Technology':                  Zap,
  'Data Science & AI':           BarChart2,
  'Marketing':                   TrendingUp,
  'Design':                      Palette,
  'Finance & Accounting':        DollarSign,
  'Sales & Business Development':ShoppingBag,
  'Human Resources':             Users,
  'Product Management':          Sparkles,
  'Operations & Supply Chain':   Package,
  'Content & Writing':           PenTool,
  'Customer Success':            Headphones,
  'Legal & Compliance':          Scale,
};

const DOMAIN_COLORS: Record<string, string> = {
  'Technology':                  '#6366f1',
  'Data Science & AI':           '#8b5cf6',
  'Marketing':                   '#f59e0b',
  'Design':                      '#ec4899',
  'Finance & Accounting':        '#10b981',
  'Sales & Business Development':'#06b6d4',
  'Human Resources':             '#f97316',
  'Product Management':          '#a855f7',
  'Operations & Supply Chain':   '#64748b',
  'Content & Writing':           '#14b8a6',
  'Customer Success':            '#22c55e',
  'Legal & Compliance':          '#94a3b8',
};

// ─── Skill Pill ───────────────────────────────────────────────────────────────
function SkillPill({ skill }: { skill: string }) {
  const colors: Record<string, string> = {
    react: '#61dafb', javascript: '#f7df1e', typescript: '#3178c6',
    python: '#3776ab', node: '#6db33f', sql: '#f29111',
    figma: '#f24e1e', 'machine learning': '#ff6f00', seo: '#34a853',
    'google ads': '#4285f4', salesforce: '#00a1e0', excel: '#217346',
    agile: '#0052cc', tableau: '#e97627', 'content writing': '#14b8a6',
  };
  const color = Object.keys(colors).find(k => skill.toLowerCase().includes(k))
    ? colors[Object.keys(colors).find(k => skill.toLowerCase().includes(k))!]
    : '#818cf8';
  return (
    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
      {skill}
    </span>
  );
}

// ─── Offline Banner ───────────────────────────────────────────────────────────
function OfflineBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="rounded-xl p-4 flex items-start gap-3"
      style={{ background: 'rgba(251,146,60,0.08)', border: '1px solid rgba(251,146,60,0.25)' }}>
      <WifiOff size={18} className="mt-0.5 shrink-0" style={{ color: '#fb923c' }} />
      <div className="flex-1">
        <p className="font-semibold text-sm" style={{ color: '#fb923c' }}>Extractor API Offline</p>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Start the extractor service to enable job discovery:
        </p>
        <code className="block mt-2 px-3 py-2 rounded-lg text-xs font-mono"
          style={{ background: 'rgba(0,0,0,0.4)', color: '#a5b4fc' }}>
          cd jobflow/job-saas-main &nbsp;&amp;&amp;&nbsp; node server.js
        </code>
      </div>
      <button onClick={onDismiss}><X size={14} style={{ color: 'rgba(255,255,255,0.4)' }} /></button>
    </div>
  );
}

// ─── Domain Preset Cards ──────────────────────────────────────────────────────
function DomainSelector({ presets, activeDomain, onSelect }: {
  presets: DomainPreset[];
  activeDomain: string;
  onSelect: (p: DomainPreset) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
        ⚡ Quick Domain Presets — click any to switch instantly
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {presets.map(p => {
          const Icon = DOMAIN_ICONS[p.domain] || Briefcase;
          const color = DOMAIN_COLORS[p.domain] || '#818cf8';
          const isActive = activeDomain === p.domain;
          return (
            <button key={p.domain} onClick={() => onSelect(p)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl text-center transition-all duration-200 hover:-translate-y-0.5 group"
              style={{
                background: isActive ? `${color}15` : 'rgba(255,255,255,0.03)',
                border: isActive ? `1.5px solid ${color}50` : '1px solid rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 4px 20px ${color}20` : 'none',
              }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ background: isActive ? `${color}25` : 'rgba(255,255,255,0.05)' }}>
                <Icon size={16} style={{ color: isActive ? color : 'rgba(255,255,255,0.4)' }} />
              </div>
              <div>
                <p className="text-xs font-medium leading-tight"
                  style={{ color: isActive ? color : 'rgba(255,255,255,0.6)' }}>
                  {p.domain.split(' ')[0]}
                </p>
                <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                  {p.job_count} jobs
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Config Panel ─────────────────────────────────────────────────────────────
function ConfigPanel({ config, onChange, onSave, onClose, online, presets }: {
  config: ExtractorConfig; onChange: (c: ExtractorConfig) => void;
  onSave: () => void; onClose: () => void; online: boolean;
  presets: DomainPreset[];
}) {
  const [kwInput, setKwInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const addKeyword = () => {
    const kw = kwInput.trim();
    if (kw && !config.keywords.includes(kw)) onChange({ ...config, keywords: [...config.keywords, kw] });
    setKwInput('');
  };
  const addSkill = () => {
    const s = skillInput.trim().toLowerCase();
    if (s && !config.target_skills.includes(s)) onChange({ ...config, target_skills: [...config.target_skills, s] });
    setSkillInput('');
  };
  const loadPreset = (p: DomainPreset) => {
    onChange({ ...config, keywords: p.keywords, target_skills: p.skills, domain: p.domain });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} style={{ color: '#818cf8' }} />
            <h2 className="text-lg font-bold text-white">Extractor Settings</h2>
          </div>
          <button onClick={onClose}><X size={18} style={{ color: 'rgba(255,255,255,0.4)' }} /></button>
        </div>

        {/* Domain presets */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Sparkles size={14} style={{ color: '#818cf8' }} /> Load Domain Preset
          </p>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => {
              const color = DOMAIN_COLORS[p.domain] || '#818cf8';
              const Icon = DOMAIN_ICONS[p.domain] || Briefcase;
              const isActive = (config as any).domain === p.domain;
              return (
                <button key={p.domain} onClick={() => loadPreset(p)}
                  className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all"
                  style={isActive
                    ? { background: `${color}25`, color, border: `1px solid ${color}40` }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon size={11} />
                  {p.domain.split(' & ')[0].split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Job Keywords (LinkedIn search terms)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {config.keywords.map(kw => (
              <span key={kw} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>
                {kw}
                <button onClick={() => onChange({ ...config, keywords: config.keywords.filter(k => k !== kw) })}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={kwInput} onChange={e => setKwInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKeyword()}
              placeholder="e.g. Marketing Manager, CA, Data Analyst..." className="flex-1 h-9"
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            <Button size="sm" onClick={addKeyword} className="h-9" style={{ background: '#6366f1', color: 'white' }}><Plus size={14} /></Button>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Location</label>
          <Input value={config.location} onChange={e => onChange({ ...config, location: e.target.value })}
            placeholder="e.g. India, Remote, Mumbai, Bangalore" className="h-9"
            style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
        </div>

        {/* Target Skills */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Target Skills <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>(filter to only jobs requiring these)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {config.target_skills.map(s => (
              <span key={s} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                {s}
                <button onClick={() => onChange({ ...config, target_skills: config.target_skills.filter(x => x !== s) })}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="e.g. figma, seo, excel, salesforce, python..." className="flex-1 h-9"
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            <Button size="sm" onClick={addSkill} className="h-9" style={{ background: '#10b981', color: 'white' }}><Plus size={14} /></Button>
          </div>
        </div>

        {/* Max Jobs */}
        <div>
          <label className="text-sm font-medium block mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Max Jobs Per Scan: <strong className="text-white">{config.max_jobs}</strong>
          </label>
          <input type="range" min={5} max={50} step={5} value={config.max_jobs}
            onChange={e => onChange({ ...config, max_jobs: Number(e.target.value) })} className="w-full accent-indigo-500" />
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} style={{ color: 'rgba(255,255,255,0.5)' }}>Cancel</Button>
          <Button onClick={onSave} className="text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            ✅ Save & Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Job Card ─────────────────────────────────────────────────────────────────
function JobCard({ job, onImport, onDelete }: {
  job: DiscoveredJob; onImport: (j: DiscoveredJob) => void; onDelete: (id: string) => void;
}) {
  const timeAgo = (iso: string) => {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
    return `${Math.floor(mins / 1440)}d ago`;
  };
  const domainColor = DOMAIN_COLORS[(job as any).domain] || '#818cf8';

  return (
    <Card className="group relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: job.imported ? 'rgba(16,185,129,0.05)' : 'rgba(26,29,46,0.9)',
        border: job.imported ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.07)',
      }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg,${domainColor},transparent)` }} />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white leading-snug">{job.title}</p>
            <div className="flex items-center gap-1.5 mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <Briefcase size={11} />
              <span className="text-xs">{job.company}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {(job as any).domain && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: `${domainColor}15`, color: domainColor, border: `1px solid ${domainColor}30` }}>
                {(job as any).domain.split(' & ')[0].split(' ')[0]}
              </span>
            )}
            {job.imported && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                <CheckCircle2 size={9} /> In CRM
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
          <span className="flex items-center gap-1"><Clock size={10} />{timeAgo(job.extracted_at)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          <Code2 size={11} className="shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
          {job.matched_skills.slice(0, 4).map(s => <SkillPill key={s} skill={s} />)}
          {job.matched_skills.length > 4 && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>+{job.matched_skills.length - 4}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <a href={job.link} target="_blank" rel="noreferrer" className="w-full">
            <Button size="sm" className="w-full h-9 text-xs gap-1.5 font-medium transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)' }}>
              <ExternalLink size={12} /> View on LinkedIn
            </Button>
          </a>
          {!job.imported ? (
            <Button size="sm" onClick={() => onImport(job)} className="w-full h-9 text-xs gap-1.5 text-white font-semibold transition-all"
              style={{ background: `linear-gradient(135deg,${domainColor},${domainColor}cc)`, boxShadow: `0 2px 12px ${domainColor}20` }}>
              <Plus size={12} /> Add to CRM Pipeline
            </Button>
          ) : (
            <Button size="sm" onClick={() => onDelete(job.id)} className="w-full h-9 text-xs gap-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
              variant="ghost" style={{ border: '1px solid rgba(248,113,113,0.15)' }}>
              <Trash2 size={12} /> Remove Discovered Job
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function JobDiscoveryPage() {
  const [online, setOnline] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<ExtractorConfig & { domain?: string }>(DEFAULT_CONFIG);
  const [presets, setPresets] = useState<DomainPreset[]>([]);
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [status, setStatus] = useState<any>({ running: false, message: 'Ready to scan', jobs_found: 0, new_jobs: 0 });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'new' | 'imported'>('all');
  const [search, setSearch] = useState('');
  const [importSuccess, setImportSuccess] = useState<string | null>(null);

  const checkOnline = useCallback(async () => {
    const isUp = await ExtractorAPI.isOnline();
    setOnline(isUp);
    return isUp;
  }, []);

  const refreshAll = useCallback(async (isUp = online) => {
    if (!isUp) return;
    try {
      const [jobData, statusData, configData] = await Promise.all([
        ExtractorAPI.getJobs(),
        ExtractorAPI.getStatus(),
        ExtractorAPI.getConfig(),
      ]);
      setJobs(jobData.jobs || []);
      setStatus(statusData);
      setConfig(configData);

      // Fetch domain presets
      const presetsRes = await fetch('http://localhost:8001/presets');
      const presetsData = await presetsRes.json();
      setPresets(presetsData.presets || []);
    } catch { /* offline */ }
  }, [online]);

  useEffect(() => {
    checkOnline().then(isUp => refreshAll(isUp));
    const interval = setInterval(() => checkOnline().then(isUp => { if (isUp) refreshAll(isUp); }), 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh during scan
  useEffect(() => {
    if (!status.running) return;
    const t = setInterval(() => refreshAll(online), 1000);
    return () => clearInterval(t);
  }, [status.running, online]);

  const handleDomainSwitch = async (preset: DomainPreset) => {
    const newConfig = { ...config, keywords: preset.keywords, target_skills: preset.skills, domain: preset.domain };
    setConfig(newConfig);
    if (online) {
      await ExtractorAPI.saveConfig(newConfig);
      // Clear old jobs and re-scan
      await ExtractorAPI.clearAll();
      setJobs([]);
      setLoading(true);
      await ExtractorAPI.startScrape();
      setLoading(false);
      setTimeout(() => refreshAll(true), 3000);
    }
  };

  const handleScan = async () => {
    if (!online) { alert('Start the Extractor API:\n\ncd jobflow/job-saas-main\nnode server.js'); return; }
    setLoading(true);
    try { await ExtractorAPI.startScrape(); setTimeout(() => refreshAll(true), 1000); }
    catch { /* handled */ }
    setLoading(false);
  };

  const handleSaveConfig = async () => {
    if (online) await ExtractorAPI.saveConfig(config);
    else localStorage.setItem('jf_extractor_config', JSON.stringify(config));
    setShowConfig(false);
  };

  const handleImport = async (job: DiscoveredJob) => {
    AppStore.addApplication({
      role: job.title, company: job.company, recruiterName: '', recruiterEmail: '',
      status: 'Saved',
      workType: job.location.toLowerCase().includes('remote') ? 'Remote' : 'On-site',
      location: job.location, jobUrl: job.link,
      appliedDate: '', followUpDate: '',
      notes: `Auto-discovered by JobFlow Extractor.\nDomain: ${(job as any).domain || 'General'}\nMatched skills: ${job.matched_skills.join(', ')}`,
    });
    if (online) await ExtractorAPI.markImported(job.id);
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, imported: true } : j));
    setImportSuccess(job.id);
    setTimeout(() => setImportSuccess(null), 2500);
  };

  const handleDelete = async (id: string) => {
    if (online) await ExtractorAPI.deleteJob(id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const handleClearAndRescan = async () => {
    if (!online) return;
    await ExtractorAPI.clearAll();
    setJobs([]);
    await ExtractorAPI.startScrape();
    setTimeout(() => refreshAll(true), 3000);
  };

  const filteredJobs = jobs.filter(j => {
    if (filter === 'new' && j.imported) return false;
    if (filter === 'imported' && !j.imported) return false;
    if (search) {
      const q = search.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
        j.matched_skills.some(s => s.toLowerCase().includes(q)) ||
        ((j as any).domain || '').toLowerCase().includes(q);
    }
    return true;
  });

  const newCount = jobs.filter(j => !j.imported).length;
  const activeDomain = (config as any).domain || '';
  const activeColor = DOMAIN_COLORS[activeDomain] || '#6366f1';

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Job Discovery</h1>
            <span className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold"
              style={online
                ? { background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }
                : { background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)' }}>
              {online ? <Wifi size={11} /> : <WifiOff size={11} />}
              {online ? 'API Online' : 'API Offline'}
            </span>
            {activeDomain && (
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: `${activeColor}15`, color: activeColor, border: `1px solid ${activeColor}30` }}>
                {activeDomain}
              </span>
            )}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>
            Switch domains to discover jobs in <strong className="text-white">any field</strong> — not just tech.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="ghost" onClick={handleClearAndRescan} disabled={!online || status.running}
            className="h-10 gap-2 font-medium text-white/50 hover:text-white/70"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            <RefreshCw size={13} /> Re-scan
          </Button>
          <Button variant="ghost" onClick={() => setShowConfig(true)}
            className="h-10 gap-2 font-medium text-white/70 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}>
            <Settings2 size={15} /> Settings
          </Button>
          <Button onClick={handleScan} disabled={loading || status.running}
            className="h-10 text-white font-semibold gap-2"
            style={{ background: `linear-gradient(135deg,${activeColor},${activeColor}aa)`, boxShadow: `0 4px 15px ${activeColor}35` }}>
            {status.running
              ? <><RefreshCw size={15} className="animate-spin" /> Scanning...</>
              : <><Zap size={15} className="fill-current" /> Start Scan</>}
          </Button>
        </div>
      </div>

      {!online && showOfflineBanner && <OfflineBanner onDismiss={() => setShowOfflineBanner(false)} />}

      {/* Domain Selector */}
      {online && presets.length > 0 && (
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <DomainSelector presets={presets} activeDomain={activeDomain} onSelect={handleDomainSwitch} />
        </div>
      )}

      {/* Stats */}
      {(online || jobs.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Found',        value: jobs.length,                      color: '#818cf8' },
            { label: 'New (Unimported)',   value: newCount,                         color: '#fb923c' },
            { label: 'Imported to CRM',   value: jobs.filter(j => j.imported).length, color: '#34d399' },
            { label: 'Active Keywords',   value: config.keywords.length,           color: '#06b6d4' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Status message */}
      {status.message && status.message !== 'Ready to scan' && (
        <div className="flex items-center gap-3 p-3 rounded-xl text-sm"
          style={{ background: `${activeColor}0d`, border: `1px solid ${activeColor}25` }}>
          {status.running
            ? <RefreshCw size={14} className="animate-spin shrink-0" style={{ color: activeColor }} />
            : <Zap size={14} className="shrink-0 fill-current" style={{ color: activeColor }} />}
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>{status.message}</span>
          {status.last_run && (
            <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {new Date(status.last_run).toLocaleTimeString()}
            </span>
          )}
        </div>
      )}

      {/* Active config pills */}
      {config.keywords.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.4)' }}>Scanning for:</span>
          {config.keywords.slice(0, 4).map(k => (
            <span key={k} className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: `${activeColor}12`, color: activeColor, border: `1px solid ${activeColor}25` }}>
              {k}
            </span>
          ))}
          {config.keywords.length > 4 && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>+{config.keywords.length - 4} more</span>
          )}
          <ChevronRight size={12} style={{ color: 'rgba(255,255,255,0.2)' }} />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{config.location}</span>
        </div>
      )}

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-xl overflow-hidden p-1 gap-1"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {(['all', 'new', 'imported'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
              style={filter === f ? { background: activeColor, color: 'white' } : { color: 'rgba(255,255,255,0.45)' }}>
              {f} {f === 'new' && newCount > 0 ? `(${newCount})` : ''}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <Input placeholder="Search by title, company, skill or domain..." value={search}
            onChange={e => setSearch(e.target.value)} className="pl-9 h-9"
            style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', color: 'white' }} />
        </div>
      </div>

      {/* Jobs grid */}
      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ background: `${activeColor}15`, border: `1px solid ${activeColor}25` }}>
            <Zap size={36} style={{ color: activeColor }} />
          </div>
          <div className="text-center space-y-2">
            <p className="text-xl font-bold text-white">
              {online ? 'No jobs yet — click Start Scan' : 'Start the Extractor API'}
            </p>
            <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {online
                ? `Select a domain above then click "Start Scan" to discover ${activeDomain || 'matching'} jobs.`
                : 'Run `node server.js` in the job-saas-main folder, then refresh.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map(job => (
            <div key={job.id} className="relative">
              {importSuccess === job.id && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl"
                  style={{ background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(4px)' }}>
                  <div className="text-center text-white">
                    <CheckCircle2 size={32} className="mx-auto mb-2" />
                    <p className="font-bold">Added to Pipeline!</p>
                    <p className="text-xs opacity-80">Check Applications page</p>
                  </div>
                </div>
              )}
              <JobCard job={job} onImport={handleImport} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {showConfig && (
        <ConfigPanel config={config} onChange={setConfig} onSave={handleSaveConfig}
          onClose={() => setShowConfig(false)} online={online} presets={presets} />
      )}
    </div>
  );
}
