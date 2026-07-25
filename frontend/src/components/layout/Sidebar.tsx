import React from 'react';
import { LayoutDashboard, Briefcase, Mail, BarChart3, Settings, LogOut, X, Zap, Users, Building2, FileText, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',      href: '/' },
  { icon: Briefcase,       label: 'Applications',   href: '/applications' },
  { icon: Sparkles,        label: 'Job Discovery',  href: '/job-discovery', badge: '🔥' },
  { icon: Users,           label: 'Recruiters',     href: '/recruiters' },
  { icon: Building2,       label: 'Companies',      href: '/companies' },
  { icon: FileText,        label: 'Templates',      href: '/templates' },
  { icon: Mail,            label: 'Bulk Email',     href: '/bulk-email' },
  { icon: BarChart3,       label: 'Analytics',      href: '/analytics' },
  { icon: Settings,        label: 'Settings',       href: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#13151f] border-r border-white/5 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Zap size={20} className="fill-current" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
              JobFlow
            </span>
          </Link>
          <button 
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 group relative",
                  isActive 
                    ? "text-indigo-400 bg-indigo-500/10" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
                )}
                <item.icon size={18} className={cn(
                  "transition-colors", 
                  isActive ? "text-indigo-400" : "text-gray-500 group-hover:text-gray-300"
                )} />
                <span className="flex-1">{item.label}</span>
                {(item as any).badge && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', fontSize: '9px' }}>{(item as any).badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
              JS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Smith</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
