import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  subtitle,
  icon: Icon = FolderSearch,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-500">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 ring-1 ring-white/10 relative">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl" />
        <Icon size={32} className="text-indigo-400 relative z-10" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {subtitle && (
        <p className="text-sm text-gray-400 max-w-sm mb-6">{subtitle}</p>
      )}
      {action && (
        <Button 
          onClick={action.onClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20 transition-all"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
