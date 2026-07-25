import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText, Trash2, Edit2, Copy, X, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppStore, EmailTemplate } from '@/lib/store';

const TYPES = ['Initial Outreach','Follow-up 1','Follow-up 2','Thank You'] as const;
const TYPE_COLORS: Record<string, string> = {
  'Initial Outreach': '#6366f1',
  'Follow-up 1': '#06b6d4',
  'Follow-up 2': '#8b5cf6',
  'Thank You': '#10b981',
};
const EMPTY = { name:'', type:'Initial Outreach' as const, subject:'', body:'' };
const VARS = ['{{recruiterName}}','{{company}}','{{role}}','{{senderName}}','{{appliedDate}}'];

function Modal({ onClose, onSave, form, setForm, editing }: any) {
  const insertVar = (v: string) => setForm((f: any) => ({ ...f, body: f.body + v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{editing ? 'Edit Template' : 'Create Template'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Template Name *</label>
            <Input value={form.name} placeholder="e.g. Cold Outreach #1" onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Type</label>
            <select value={form.type} onChange={e => setForm((f: any) => ({ ...f, type: e.target.value }))}
              className="w-full h-10 rounded-md px-3 text-sm"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              {TYPES.map(t => <option key={t} value={t} style={{ background: '#1a1d2e' }}>{t}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Email Subject *</label>
            <Input value={form.subject} placeholder="e.g. Interest in {{role}} at {{company}}" onChange={e => setForm((f: any) => ({ ...f, subject: e.target.value }))}
              style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>Email Body *</label>
            <div className="flex gap-1 flex-wrap justify-end">
              {VARS.map(v => (
                <button key={v} onClick={() => insertVar(v)}
                  className="text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)' }}>
                  {v}
                </button>
              ))}
            </div>
          </div>
          <textarea value={form.body} onChange={e => setForm((f: any) => ({ ...f, body: e.target.value }))}
            placeholder="Write your email here... Click variables above to insert them." rows={12}
            className="w-full rounded-md px-3 py-2 text-sm font-mono resize-none"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', lineHeight: '1.6' }} />
        </div>

        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>Cancel</Button>
          <Button onClick={onSave} className="text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            {editing ? 'Save Template' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewModal({ template, onClose }: { template: EmailTemplate; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(template.body); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto" style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{template.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Subject</p>
          <p className="text-sm text-white font-medium">{template.subject}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>Body</p>
          <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: '1.7' }}>{template.body}</pre>
        </div>
        <div className="flex gap-3 justify-end">
          <Button onClick={copy} variant="ghost" className="text-white/70 hover:text-white gap-2">
            {copied ? <><Check size={14} className="text-green-400" /> Copied!</> : <><Copy size={14} /> Copy Body</>}
          </Button>
          <Button onClick={onClose} className="text-white" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}>Close</Button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [preview, setPreview] = useState<EmailTemplate | null>(null);

  useEffect(() => { setTemplates(AppStore.getTemplates()); }, []);
  const reload = () => setTemplates(AppStore.getTemplates());

  const openAdd = () => { setForm({ ...EMPTY }); setEditingId(null); setShowModal(true); };
  const openEdit = (t: EmailTemplate) => { setForm({ name: t.name, type: t.type, subject: t.subject, body: t.body }); setEditingId(t.id); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.subject.trim() || !form.body.trim()) return alert('Name, Subject and Body are required.');
    if (editingId) AppStore.updateTemplate(editingId, form);
    else AppStore.addTemplate(form as any);
    reload(); setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this template?')) return;
    AppStore.deleteTemplate(id); reload();
  };

  const handleDuplicate = (t: EmailTemplate) => {
    AppStore.addTemplate({ name: t.name + ' (Copy)', type: t.type, subject: t.subject, body: t.body });
    reload();
  };

  const filtered = templates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Email Templates</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Create reusable email templates with dynamic variables.</p>
        </div>
        <Button onClick={openAdd} className="text-white font-semibold shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Button>
      </div>

      {/* Variables guide */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#818cf8' }}>📝 Available Variables (auto-replaced when sending)</p>
        <div className="flex flex-wrap gap-2">
          {VARS.map(v => (
            <span key={v} className="text-xs px-2.5 py-1 rounded-full font-mono"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)' }}>
              {v}
            </span>
          ))}
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
        <Input placeholder="Search templates..." value={search} onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9"
          style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', color: 'white' }} />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
            <FileText className="w-8 h-8" style={{ color: '#6366f1' }} />
          </div>
          <p className="font-semibold text-white">No templates yet</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Create your first email template</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(t => {
            const color = TYPE_COLORS[t.type] || '#6366f1';
            return (
              <Card key={t.id} className="group relative overflow-hidden transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(26,29,46,0.8)', border: '1px solid rgba(255,255,255,0.07)', cursor: 'default' }}>
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm leading-snug">{t.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{ color, background: color + '20', border: `1px solid ${color}30` }}>
                        {t.type}
                      </span>
                    </div>
                    <FileText size={18} style={{ color: color + 'aa', flexShrink: 0 }} />
                  </div>
                  <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>Subject:</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }} title={t.subject}>
                    {t.subject.length > 60 ? t.subject.slice(0, 60) + '…' : t.subject}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {t.body.slice(0, 100)}…
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" onClick={() => setPreview(t)} className="flex-1 h-8 text-xs text-white/80 hover:text-white"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      Preview
                    </Button>
                    <Button size="icon" onClick={() => handleDuplicate(t)} variant="ghost" className="h-8 w-8"
                      style={{ color: 'rgba(255,255,255,0.4)' }}><Copy size={13} /></Button>
                    <Button size="icon" onClick={() => openEdit(t)} variant="ghost" className="h-8 w-8"
                      style={{ color: 'rgba(255,255,255,0.4)' }}><Edit2 size={13} /></Button>
                    <Button size="icon" onClick={() => handleDelete(t.id)} variant="ghost" className="h-8 w-8"
                      style={{ color: '#f87171' }}><Trash2 size={13} /></Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} form={form} setForm={setForm} editing={!!editingId} />}
      {preview && <PreviewModal template={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
