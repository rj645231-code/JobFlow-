import React from 'react';
import { Bell, Menu, Search, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(true);

  // Map paths to titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/applications': return 'Applications';
      case '/outreach': return 'Outreach Campaigns';
      case '/analytics': return 'Analytics';
      case '/settings': return 'Settings';
      default: return 'JobFlow';
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-[#13151f]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden md:flex relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-64 bg-[#0f1117] border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-200"
          />
        </div>
        
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#13151f]" />
        </button>
        
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg cursor-pointer ring-2 ring-transparent hover:ring-indigo-500/50 transition-all ml-2 md:hidden">
          JS
        </div>
      </div>
    </header>
  );
};
