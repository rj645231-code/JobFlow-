import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Building2, Trash2, Edit2, Globe, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { AppStore, Company } from '@/lib/store';

const INDUSTRIES = ['Technology','Fintech','Healthcare','E-commerce','SaaS','AI/ML','Gaming','Media','Travel Tech','Education','Other'];
const EMPTY = { name:'', industry:'Technology', website:'', location:'', notes:'' };

function Modal({ onClose, onSave, form, setForm, editing }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-6 space-y-5" style={{ background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{editing ? 'Edit Company' : 'Add Company'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Company Name *', key: 'name', placeholder: 'e.g. Google' },
            { label: 'Website', key: 'website', placeholder: 'https://company.com' },
            { label: 'Location', key: 'location', placeholder: 'e.g. San Francisco, CA' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</label>
              <Input value={form[key]} placeholder={placeholder} onChange={e => setForm((f: any) => ({ ...f, [key]: e.target.value }))}
                style={{ background: 'rgba(0,0,0,0.3)', borderColor: 'rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Industry</label>
            <select value={form.industry} onChange={e => setForm((f: any) => ({ ...f, industry: e.target.value }))}
              className="w-full h-10 rounded-md px-3 text-sm"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              {INDUSTRIES.map(i => <option key={i} value={i} style={{ background: '#1a1d2e' }}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm((f: any) => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes about this company..." rows={3}
              className="w-full rounded-md px-3 py-2 text-sm resize-none"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-1">
          <Button variant="ghost" onClick={onClose} style={{ color: 'rgba(255,255,255,0.6)' }}>Cancel</Button>
          <Button onClick={onSave} className="text-white font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}>
            {editing ? 'Save Changes' : 'Add Company'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });

  useEffect(() => { setCompanies(AppStore.getCompanies()); }, []);
  const reload = () => setCompanies(AppStore.getCompanies());

  const openAdd = () => { setForm({ ...EMPTY }); setEditingId(null); setShowModal(true); };
  const openEdit = (c: Company) => { setForm({ name: c.name, industry: c.industry, website: c.website, location: c.location, notes: c.notes }); setEditingId(c.id); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim()) return alert('Company name is required.');
    if (editingId) AppStore.updateCompany(editingId, form);
    else AppStore.addCompany(form);
    reload(); setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this company?')) return;
    AppStore.deleteCompany(id); reload();
  };

  const filtered = companies.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const initials = (name: string) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444'];
  const colorFor = (name: string) => colors[name.charCodeAt(0) % colors.length];

  return (
    <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Companies</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)' }}>Manage your target companies.</p>
        </div>
        <Button onClick={openAdd} className="text-white font-semibold shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 4px 15px rgba(99,102,241,0.35)' }}>
          <Plus className="w-4 h-4 mr-2" /> Add Company
        </Button>
      </div>

      <Card className="border-0 overflow-hidden" style={{ background: 'rgba(26,29,46,0.7)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
            <Input placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9"
              style={{ background: 'rgba(0,0,0,0.2)', borderColor: 'rgba(255,255,255,0.08)', color: 'white' }} />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              {['Company','Industry','Location','Website','Actions'].map(h => (
                <TableHead key={h} className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Building2 className="w-7 h-7" style={{ color: '#6366f1' }} />
                  </div>
                  <p className="font-semibold text-white">No companies yet</p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Add your first target company</p>
                </div>
              </TableCell></TableRow>
            ) : filtered.map(c => (
              <TableRow key={c.id} style={{ borderColor: 'rgba(255,255,255,0.05)' }} className="group hover:bg-white/[0.03] transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm text-white"
                      style={{ background: colorFor(c.name) + '30', color: colorFor(c.name) }}>
                      {initials(c.name)}
                    </div>
                    <span className="font-semibold text-white text-sm">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{c.industry}</TableCell>
                <TableCell className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{c.location || '—'}</TableCell>
                <TableCell>
                  {c.website ? (
                    <a href={c.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-xs hover:underline" style={{ color: '#818cf8' }}>
                      <Globe size={12} /> {c.website.replace('https://','').replace('http://','').split('/')[0]}
                    </a>
                  ) : <span style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => openEdit(c)} style={{ color: 'rgba(255,255,255,0.4)' }}><Edit2 size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(c.id)} style={{ color: '#f87171' }}><Trash2 size={13} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-3 text-xs text-right" style={{ color: 'rgba(255,255,255,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {filtered.length} companies
        </div>
      </Card>

      {showModal && <Modal onClose={() => setShowModal(false)} onSave={handleSave} form={form} setForm={setForm} editing={!!editingId} />}
    </div>
  );
}
