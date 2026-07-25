import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, Trash2, Download, AlertCircle } from 'lucide-react';

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

interface Resume {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  uploadedAt: string;
  isDefault: boolean;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jf_resumes');
      if (saved) setResumes(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const saveToLocal = (newResumes: Resume[]) => {
    setResumes(newResumes);
    localStorage.setItem('jf_resumes', JSON.stringify(newResumes));
  };

  const handleFileUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Max 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: e.target?.result as string,
        uploadedAt: new Date().toISOString(),
        isDefault: resumes.length === 0 // Make default if it's the first one
      };
      saveToLocal([...resumes, newResume]);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const setAsDefault = (id: string) => {
    saveToLocal(resumes.map(r => ({ ...r, isDefault: r.id === id })));
  };

  const deleteResume = (id: string) => {
    if (window.confirm('Delete this resume?')) {
      const filtered = resumes.filter(r => r.id !== id);
      if (filtered.length > 0 && !filtered.find(r => r.isDefault)) {
        filtered[0].isDefault = true;
      }
      saveToLocal(filtered);
    }
  };

  const downloadResume = (resume: Resume) => {
    const a = document.createElement('a');
    a.href = resume.dataUrl;
    a.download = resume.name;
    a.click();
  };

  const storageUsed = resumes.reduce((acc, r) => acc + r.size, 0);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: COLORS.bg, color: COLORS.textPrimary }}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              Resume Manager
            </h1>
            <p style={{ color: COLORS.textSecondary }} className="mt-1">Manage and organize your master resumes.</p>
          </div>
          <div className="text-right" style={{ color: COLORS.textSecondary }}>
            <p className="text-sm font-medium">{resumes.length} Document(s)</p>
            <p className="text-xs">{formatSize(storageUsed)} / 15 MB Local Storage</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div 
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${isDragging ? 'bg-indigo-500/10' : 'bg-black/20'}`}
          style={{ borderColor: isDragging ? COLORS.primary : COLORS.border }}
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf,.doc,.docx" 
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} 
          />
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-colors" style={{ backgroundColor: isDragging ? COLORS.primary : 'rgba(255,255,255,0.05)' }}>
            <UploadCloud size={32} style={{ color: isDragging ? '#fff' : COLORS.textSecondary }} />
          </div>
          <h3 className="text-xl font-bold mb-2">Drag & Drop Resume</h3>
          <p style={{ color: COLORS.textSecondary }} className="text-sm max-w-md mx-auto">
            Upload your PDF or Word documents. Max size 5MB. Files are stored securely in your browser's local storage.
          </p>
        </div>

        {/* Resumes Grid */}
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => (
              <div key={resume.id} style={{ backgroundColor: COLORS.card, border: `1px solid ${resume.isDefault ? COLORS.primary : COLORS.border}` }} className="p-6 rounded-xl relative group transition-all hover:-translate-y-1 hover:shadow-xl">
                
                {resume.isDefault && (
                  <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-green-500/30">
                    <CheckCircle size={12} /> Default
                  </div>
                )}

                <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                  <FileText size={24} />
                </div>
                
                <h4 className="font-bold truncate mb-1" title={resume.name}>{resume.name}</h4>
                <div className="flex gap-3 text-xs mb-6" style={{ color: COLORS.textSecondary }}>
                  <span>{formatSize(resume.size)}</span>
                  <span>•</span>
                  <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex gap-2">
                  {!resume.isDefault && (
                    <button 
                      onClick={() => setAsDefault(resume.id)}
                      className="flex-1 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/10"
                      style={{ border: `1px solid ${COLORS.border}` }}
                    >
                      Set Default
                    </button>
                  )}
                  <button 
                    onClick={() => downloadResume(resume)}
                    className="flex-1 py-2 rounded-lg text-xs font-medium transition-all hover:bg-white/10 flex justify-center items-center gap-2"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    <Download size={14} /> Download
                  </button>
                  <button 
                    onClick={() => deleteResume(resume.id)}
                    className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textSecondary }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center" style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.card, borderRadius: '0.75rem' }}>
            <AlertCircle size={48} className="mx-auto mb-4" style={{ color: COLORS.textSecondary }} />
            <h3 className="text-xl font-bold mb-2">No Resumes Found</h3>
            <p style={{ color: COLORS.textSecondary }}>Upload your first resume above to get started.</p>
          </div>
        )}

      </div>
    </div>
  );
}
