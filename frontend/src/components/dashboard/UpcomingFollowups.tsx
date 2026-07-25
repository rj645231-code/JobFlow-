import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface FollowupItem {
  id: string;
  recruiterName: string;
  company: string;
  role: string;
  dueIn: string; // e.g. "2 hours", "Tomorrow"
  status: 'Action Required' | 'Applied' | 'Phone Screen';
}

const mockFollowups: FollowupItem[] = [
  {
    id: '1',
    recruiterName: 'Sarah Jenkins',
    company: 'Stripe',
    role: 'Frontend Engineer',
    dueIn: 'In 2 hours',
    status: 'Action Required'
  },
  {
    id: '2',
    recruiterName: 'Michael Chang',
    company: 'Vercel',
    role: 'Senior React Developer',
    dueIn: 'Tomorrow',
    status: 'Phone Screen'
  },
  {
    id: '3',
    recruiterName: 'Alex River',
    company: 'Linear',
    role: 'Product Engineer',
    dueIn: 'In 2 days',
    status: 'Applied'
  }
];

interface UpcomingFollowupsProps {
  items?: FollowupItem[];
}

export const UpcomingFollowups: React.FC<UpcomingFollowupsProps> = ({ items = mockFollowups }) => {
  return (
    <div className="bg-[#1a1d2e] rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Upcoming Follow-ups</h3>
        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group flex flex-col gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white truncate">{item.recruiterName}</h4>
                <p className="text-sm text-gray-400 truncate">{item.role} @ {item.company}</p>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={item.status as any} />
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
              <div className="flex items-center text-xs font-medium text-amber-400/90 bg-amber-400/10 px-2 py-1 rounded-md gap-1.5">
                <Clock size={12} />
                {item.dueIn}
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <Clock size={20} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-300">You're all caught up!</p>
            <p className="text-xs text-gray-500 mt-1">No pending follow-ups scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};
