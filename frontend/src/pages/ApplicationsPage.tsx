import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Briefcase, Trash2, Edit2, ExternalLink, X, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppStore, Application, AppStatus, STATUS_CONFIG } from '@/lib/store';

const STATUSES: AppStatus[] = ['Saved','Applied','Phone Screen','Interviewing','Technical','Offer','Accepted','Rejected','Ghosted','Withdrawn'];
const WORK_TYPES = ['Remote','Hybrid','On-site'] as const;

const EMPTY_FORM = { role:'', company:'', recruiterName:'', recruiterEmail:'', status:'Applied' as AppStatus, workType:'Remote' as const, location:'', jobUrl:'', appliedDate: new Date().toISOString().split('T')[0], notes:'', followUpDate:'' };

function StatusBadge({ status }: { status: AppStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
      className="px-2.5 py-0.5 rounded-full text-xs font-semibold">
      {status}
    </span>
  );
}

function Modal({ title, onClose, onSave, form, setForm, editing }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
        style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Job Role / Title', key: 'role', placeholder: 'e.g. Senior Frontend Engineer' },
            { label: 'Company Name', key: 'company', placeholder: 'e.g. Google' },
            { label: 'Recruiter Name', key: 'recruiterName', placeholder: 'e.g. Sarah Jenkins' },
            { label: 'Recruiter Email', key: 'recruiterEmail', placeholder: 'recruiter@company.com' },
            { label: 'Location', key: 'location', placeholder: 'e.g. San Francisco, CA' },
            { label: 'Job URL', key: 'jobUrl', placeholder: 'https://...' },
            { label: 'Date Applied', key: 'appliedDate', type: 'date' },
            { label: 'Follow-up Date', key: 'followUpDate', type: 'date' },
          ].map(({ label, key, placeholder, type = 'text' }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</label>
              <Input
                type={type}
                value={form[key] || ''}
                placeholder={placeholder}
                onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                className="h-10"
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Status</label>
            <select
              value={form.status}
              onChange={e => setForm((f: any) => ({ ...f, status: e.target.value as AppStatus }))}
              className="w-full h-10 rounded-md px-3 text-sm appearance-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1d2e' }}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Work Type</label>
            <select
              value={form.workType}
              onChange={e => setForm((f: any) => ({ ...f, workType: e.target.value }))}
              className="w-full h-10 rounded-md px-3 text-sm appearance-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              {WORK_TYPES.map(w => <option key={w} value={w} style={{ background: '#1a1d2e' }}>{w}</option>)}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Notes</label>
            <textarea
              value={form.notes || ''}
              onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes about this application..."
              rows={3}
              className="w-full rounded-md px-3 py-2 text-sm resize-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="ghost" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>Cancel</Button>
          <Button onClick={onSave}
            className="text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            {editing ? 'Save Changes' : 'Add Application'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => { setApps(AppStore.getApplications()); }, []);

  const reload = () => setApps(AppStore.getApplications());

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowModal(true); };
  const openEdit = (app: Application) => {
    setForm({ role: app.role, company: app.company, recruiterName: app.recruiterName, recruiterEmail: app.recruiterEmail, status: app.status, workType: app.workType, location: app.location, jobUrl: app.jobUrl, appliedDate: app.appliedDate, notes: app.notes, followUpDate: app.followUpDate });
    setEditingId(app.id);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.role.trim() || !form.company.trim()) return alert('Role and Company are required.');
    if (editingId) {
      AppStore.updateApplication(editingId, form as any);
    } else {
      AppStore.addApplication(form as any);
    }
    reload();
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this application?')) return;
    AppStore.deleteApplication(id);
    reload();
  };

  const filtered = apps.filter(a => {
    const matchSearch = a.role.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = apps.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Applications</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Track every job application in one place.</p>
        </div>
        <Button onClick={openAdd} className="text-white font-semibold shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
          <Plus className="w-4 h-4 mr-2" /> New Application
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {(['Applied','Interviewing','Offer','Rejected','Ghosted'] as AppStatus[]).map(s => {
          const c = STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilterStatus(filterStatus === s ? 'All' : s)}
              className="rounded-xl p-3 text-center transition-all"
              style={{ background: filterStatus === s ? c.bg : 'rgba(255,255,255,0.03)', border: `1px solid ${filterStatus === s ? c.border : 'rgba(255,255,255,0.06)'}` }}>
              <div className="text-2xl font-bold" style={{ color: c.color }}>{counts[s] || 0}</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s}</div>
            </button>
          );
        })}
      </div>

      {/* Table card */}
      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(26,29,46,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Filters */}
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <Input placeholder="Search by role or company..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
              style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', color: 'white' }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="h-9 rounded-md px-3 text-sm"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            <option value="All" style={{ background: '#1a1d2e' }}>All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s} style={{ background: '#1a1d2e' }}>{s}</option>)}
          </select>
        </div>

        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              {['Role & Company','Recruiter','Date Applied','Work Type','Status','Actions'].map(h => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                      <Briefcase className="w-7 h-7" style={{ color: '#6366f1' }} />
                    </div>
                    <p className="font-semibold text-white">No applications yet</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Click "New Application" to add your first one</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.map(app => (
              <TableRow key={app.id} style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                className="group transition-colors hover:bg-white/[0.03]">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(99,102,241,0.15)' }}>
                      <Briefcase className="w-4 h-4" style={{ color: '#818cf8' }} />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{app.role}</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{app.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-white/80">{app.recruiterName || '—'}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{app.recruiterEmail || ''}</div>
                </TableCell>
                <TableCell className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {app.appliedDate || '—'}
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {app.workType}
                  </span>
                </TableCell>
                <TableCell><StatusBadge status={app.status} /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: 'rgba(255,255,255,0.4)' }}>
                          <ExternalLink size={13} />
                        </Button>
                      </a>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => openEdit(app)} style={{ color: 'rgba(255,255,255,0.4)' }}>
                      <Edit2 size={13} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(app.id)} style={{ color: '#f87171' }}>
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-3 text-xs text-right" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          Showing {filtered.length} of {apps.length} applications
        </div>
      </Card>

      {showModal && (
        <Modal title={editingId ? 'Edit Application' : 'Add New Application'}
          onClose={() => setShowModal(false)} onSave={handleSave}
          form={form} setForm={setForm} editing={!!editingId} />
      )}
    </div>
  );
}
