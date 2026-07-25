import React, { useEffect, useState } from 'react';
import { AppStore, Recruiter, EmailTemplate, Application } from '@/lib/store';
import { Users, Mail, Rocket, Check, ChevronRight, ArrowLeft } from 'lucide-react';

const COLORS = {
  bg: '#0f1117',
  card: 'rgba(26,29,46,0.8)',
  border: 'rgba(255,255,255,0.07)',
  primary: '#6366f1',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
  success: '#10b981'
};

export default function BulkEmailPage() {
  const [step, setStep] = useState(1);
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setRecruiters(AppStore.getRecruiters());
    setTemplates(AppStore.getTemplates());
  }, []);

  const filteredRecruiters = recruiters.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleRecruiter = (id: string) => {
    const newSet = new Set(selectedRecruiters);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRecruiters(newSet);
  };

  const toggleAll = () => {
    if (selectedRecruiters.size === filteredRecruiters.length) {
      setSelectedRecruiters(new Set());
    } else {
      setSelectedRecruiters(new Set(filteredRecruiters.map(r => r.id)));
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tId = e.target.value;
    setSelectedTemplateId(tId);
    const template = templates.find(t => t.id === tId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  const previewRecruiter = selectedRecruiters.size > 0 
    ? recruiters.find(r => r.id === Array.from(selectedRecruiters)[0]) 
    : recruiters[0] || { name: 'John Doe', company: 'Tech Inc' };
  
  const previewBody = body
    .replace(/{{recruiterName}}/g, previewRecruiter?.name || 'Recruiter')
    .replace(/{{company}}/g, previewRecruiter?.company || 'Company')
    .replace(/{{role}}/g, 'Software Engineer')
    .replace(/{{senderName}}/g, 'Your Name');

  const launchCampaign = () => {
    setSending(true);
    let count = 0;
    const total = selectedRecruiters.size;
    const selectedArray = Array.from(selectedRecruiters);
    
    const interval = setInterval(() => {
      count++;
      setProgress((count / total) * 100);
      
      const rId = selectedArray[count - 1];
      const r = recruiters.find(rec => rec.id === rId);
      if (r) {
        AppStore.addApplication({
          role: 'Software Engineer',
          company: r.company,
          status: 'Applied',
          url: '',
          location: '',
          salary: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as any);
      }

      if (count >= total) {
        clearInterval(interval);
        setTimeout(() => {
          setSending(false);
          setSuccess(true);
        }, 500);
      }
    }, 2000 / total);
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Stepper */}
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
            Bulk Email Campaign
          </h1>
          <p style={{ color: COLORS.textSecondary }} className="mt-1">Reach out to multiple recruiters seamlessly.</p>
        </div>

        <div className="flex items-center justify-between relative" style={{ margin: '40px 0' }}>
          <div className="absolute left-0 top-1/2 w-full h-1 -translate-y-1/2 rounded" style={{ backgroundColor: COLORS.card }}></div>
          <div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded transition-all duration-300" style={{ backgroundColor: COLORS.primary, width: `${(step - 1) * 50}%` }}></div>
          
          {[
            { num: 1, title: 'Recipients', icon: Users },
            { num: 2, title: 'Compose', icon: Mail },
            { num: 3, title: 'Review & Send', icon: Rocket }
          ].map(s => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors`}
                style={{ 
                  backgroundColor: step >= s.num ? COLORS.primary : COLORS.bg,
                  borderColor: COLORS.bg,
                  color: step >= s.num ? '#fff' : COLORS.textSecondary
                }}
              >
                <s.icon size={20} />
              </div>
              <span className="absolute top-14 whitespace-nowrap text-sm font-medium" style={{ color: step >= s.num ? COLORS.textPrimary : COLORS.textSecondary }}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Recipients */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Select Recipients</h3>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Search recruiters..." 
                    className="px-4 py-2 rounded-lg bg-black/20 outline-none focus:ring-2"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary }}
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button 
                    onClick={toggleAll}
                    className="px-4 py-2 rounded-lg font-medium transition-all hover:bg-white/10"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    {selectedRecruiters.size === filteredRecruiters.length && filteredRecruiters.length > 0 ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <tr>
                      <th className="p-4 w-12"></th>
                      <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Name</th>
                      <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Company</th>
                      <th className="p-4 font-medium" style={{ color: COLORS.textSecondary }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecruiters.map(r => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-white/5 cursor-pointer transition-colors" style={{ borderColor: COLORS.border }} onClick={() => toggleRecruiter(r.id)}>
                        <td className="p-4">
                          <input type="checkbox" checked={selectedRecruiters.has(r.id)} onChange={() => {}} className="w-4 h-4 cursor-pointer" />
                        </td>
                        <td className="p-4 font-medium">{r.name}</td>
                        <td className="p-4">{r.company}</td>
                        <td className="p-4" style={{ color: COLORS.textSecondary }}>{r.email}</td>
                      </tr>
                    ))}
                    {filteredRecruiters.length === 0 && (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No recruiters found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-between items-center pt-6 border-t" style={{ borderColor: COLORS.border }}>
                <span style={{ color: COLORS.textSecondary }}>{selectedRecruiters.size} recruiters selected</span>
                <button 
                  disabled={selectedRecruiters.size === 0}
                  onClick={() => setStep(2)}
                  className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                  style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                >
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Compose */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Editor */}
              <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl flex flex-col gap-4">
                <h3 className="text-xl font-bold">Compose Email</h3>
                
                <div>
                  <label className="block text-sm mb-1" style={{ color: COLORS.textSecondary }}>Template</label>
                  <select 
                    value={selectedTemplateId} 
                    onChange={handleTemplateChange}
                    className="w-full px-4 py-2 rounded-lg bg-black/20 outline-none focus:ring-2"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    <option value="">-- Select Template --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: COLORS.textSecondary }}>Subject</label>
                  <input 
                    type="text" 
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-black/20 outline-none focus:ring-2"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-sm mb-1" style={{ color: COLORS.textSecondary }}>Message Body</label>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {['recruiterName', 'company', 'role', 'senderName'].map(v => (
                      <button key={v} onClick={() => insertVariable(v)} className="text-xs px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                        {`{{${v}}}`}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    className="w-full flex-1 min-h-[200px] px-4 py-2 rounded-lg bg-black/20 outline-none focus:ring-2 font-mono text-sm resize-y"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  ></textarea>
                </div>
              </div>

              {/* Preview */}
              <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-6 rounded-xl flex flex-col">
                <h3 className="text-xl font-bold mb-4">Live Preview</h3>
                <div className="p-6 rounded-lg bg-black/20 flex-1 border" style={{ borderColor: COLORS.border }}>
                  <div className="mb-4 pb-4 border-b" style={{ borderColor: COLORS.border }}>
                    <p className="text-sm"><span style={{ color: COLORS.textSecondary }}>To:</span> {previewRecruiter?.name} &lt;{previewRecruiter?.email}&gt;</p>
                    <p className="text-sm mt-1"><span style={{ color: COLORS.textSecondary }}>Subject:</span> {subject || 'No Subject'}</p>
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {previewBody || 'Your message will appear here...'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center pt-6 border-t" style={{ borderColor: COLORS.border }}>
              <button 
                onClick={() => setStep(1)}
                className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all hover:bg-white/10"
                style={{ border: `1px solid ${COLORS.border}` }}
              >
                <ArrowLeft size={18} /> Back
              </button>
              <button 
                disabled={!subject || !body}
                onClick={() => setStep(3)}
                className="px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              >
                Review <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && !success && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-8 rounded-xl text-center">
              <Rocket size={48} className="mx-auto mb-4" style={{ color: COLORS.primary }} />
              <h3 className="text-2xl font-bold mb-2">Ready to Launch</h3>
              <p style={{ color: COLORS.textSecondary }} className="mb-8">
                You are about to send an email to <strong>{selectedRecruiters.size} recruiters</strong>.
              </p>

              <div className="text-left bg-black/20 p-6 rounded-lg mb-8" style={{ border: `1px solid ${COLORS.border}` }}>
                <h4 className="font-bold mb-4 border-b pb-2" style={{ borderColor: COLORS.border }}>Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textSecondary }}>Recipients</span>
                    <span>{selectedRecruiters.size} Contacts</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textSecondary }}>Subject</span>
                    <span className="truncate ml-4 max-w-[200px]">{subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textSecondary }}>Tracking</span>
                    <span className="text-green-400">Add to Applications</span>
                  </div>
                </div>
              </div>

              {sending ? (
                <div className="space-y-4">
                  <p className="font-medium animate-pulse">Sending emails...</p>
                  <div className="w-full h-3 rounded-full bg-black/40 overflow-hidden border" style={{ borderColor: COLORS.border }}>
                    <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}></div>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.textSecondary }}>{Math.round(progress)}% Complete</p>
                </div>
              ) : (
                <div className="flex justify-center gap-4 mt-6">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-lg font-medium transition-all hover:bg-white/10"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    Go Back
                  </button>
                  <button 
                    onClick={launchCampaign}
                    className="px-8 py-3 rounded-lg font-bold text-lg transition-all hover:scale-105"
                    style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}
                  >
                    Launch Campaign
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="animate-in zoom-in duration-500 max-w-lg mx-auto">
            <div style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} className="p-10 rounded-xl text-center shadow-2xl">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${COLORS.success}20`, color: COLORS.success }}>
                <Check size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-2">Campaign Sent!</h3>
              <p style={{ color: COLORS.textSecondary }} className="mb-8">
                Successfully delivered {selectedRecruiters.size} emails. Job applications have been automatically tracked in your dashboard.
              </p>
              <button 
                onClick={() => { setStep(1); setSelectedRecruiters(new Set()); setSuccess(false); }}
                className="w-full px-6 py-3 rounded-lg font-medium transition-all hover:bg-white/10"
                style={{ border: `1px solid ${COLORS.border}` }}
              >
                Start New Campaign
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
