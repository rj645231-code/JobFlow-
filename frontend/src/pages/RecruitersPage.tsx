import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Users, Trash2, Edit2, Mail, Phone, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppStore, Recruiter } from '@/lib/store';

const EMPTY = { name:'', company:'', title:'', email:'', phone:'', linkedinUrl:'', notes:'' };

function Modal({ onClose, onSave, form, setForm, editing }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto" style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{editing ? 'Edit Recruiter' : 'Add Recruiter'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label:'Full Name *', key:'name', placeholder:'Sarah Jenkins', span: false },
            { label:'Company', key:'company', placeholder:'Google', span: false },
            { label:'Job Title', key:'title', placeholder:'Technical Recruiter', span: false },
            { label:'Email *', key:'email', placeholder:'recruiter@company.com', span: false },
            { label:'Phone', key:'phone', placeholder:'+1 555-0100', span: false },
            { label:'LinkedIn URL', key:'linkedinUrl', placeholder:'linkedin.com/in/...', span: false },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</label>
              <Input value={form[key]} placeholder={placeholder} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes..." rows={3} className="w-full rounded-md px-3 py-2 text-sm resize-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>Cancel</Button>
          <Button onClick={onSave} className="text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', boxShadow: '0 4px 15px rgba(139,92,246,0.4)' }}>
            {editing ? 'Save Changes' : 'Add Recruiter'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RecruitersPage() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  useEffect(() => { setRecruiters(AppStore.getRecruiters()); }, []);
  const reload = () => setRecruiters(AppStore.getRecruiters());

  const openAdd = () => { setForm({ ...EMPTY }); setEditingId(null); setShowModal(true); };
  const openEdit = (r: Recruiter) => { setForm({ name: r.name, company: r.company, title: r.title, email: r.email, phone: r.phone, linkedinUrl: r.linkedinUrl, notes: r.notes }); setEditingId(r.id); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return alert('Name and Email are required.');
    if (editingId) AppStore.updateRecruiter(editingId, form);
    else AppStore.addRecruiter(form);
    reload(); setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this recruiter?')) return;
    AppStore.deleteRecruiter(id); reload();
  };

  const filtered = recruiters.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.company.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'];
  const colorFor = (name: string) => colors[name.charCodeAt(0) % colors.length];
  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Recruiters</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Manage your recruiter contacts.</p>
        </div>
        <Button onClick={openAdd} className="text-white font-semibold shrink-0"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)', boxShadow: '0 4px 15px rgba(139,92,246,0.35)' }}>
          <Plus className="w-4 h-4 mr-2" /> Add Recruiter
        </Button>
      </div>

      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(26,29,46,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <Input placeholder="Search recruiters..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
              style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', color: 'white' }} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              {['Recruiter','Company / Title','Contact','Actions'].map(h => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                    <Users className="w-7 h-7" style={{ color: '#8b5cf6' }} />
                  </div>
                  <p className="font-semibold text-white">No recruiters yet</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Add recruiters to contact</p>
                </div>
              </TableCell></TableRow>
            ) : filtered.map(r => (
              <TableRow key={r.id} style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="group hover:bg-white/[0.03] transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm"
                      style={{ background: colorFor(r.name) + '25', color: colorFor(r.name) }}>
                      {initials(r.name)}
                    </div>
                    <span className="font-semibold text-white text-sm">{r.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-white/80">{r.company || '—'}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{r.title || ''}</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {r.email && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}><Mail size={11} />{r.email}</div>}
                    {r.phone && <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}><Phone size={11} />{r.phone}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <a href={`mailto:${r.email}`}>
                      <Button variant="ghost" size="icon" className="h-7 w-7" style={{ color: '#818cf8' }}><Mail size={13} /></Button>
                    </a>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => openEdit(r)} style={{ color: 'rgba(255,255,255,0.4)' }}><Edit2 size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(r.id)} style={{ color: '#f87171' }}><Trash2 size={13} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 text-xs text-right" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {filtered.length} recruiters
        </div>
      </Card>

      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} form={form} setForm={setForm} editing={!!editingId} />}
    </div>
  );
}
