import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, XCircle, Clock, Send, Eye, FileText, 
  Users, Video, Phone, UserCheck, AlertCircle, Bookmark, Archive
} from 'lucide-react';

export type ApplicationStatus = 
  | 'Bookmarked'
  | 'Draft'
  | 'Applied'
  | 'Viewed'
  | 'Phone Screen'
  | 'Technical Interview'
  | 'Onsite Interview'
  | 'Offer Received'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn'
  | 'Archived'
  | 'Action Required';

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig: Record<ApplicationStatus, { color: string, icon: React.ElementType }> = {
  'Bookmarked': { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Bookmark },
  'Draft': { color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: FileText },
  'Applied': { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', icon: Send },
  'Viewed': { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', icon: Eye },
  'Phone Screen': { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', icon: Phone },
  'Technical Interview': { color: 'bg-teal-500/10 text-teal-400 border-teal-500/20', icon: Video },
  'Onsite Interview': { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Users },
  'Offer Received': { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: UserCheck },
  'Accepted': { color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle2 },
  'Rejected': { color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
  'Withdrawn': { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', icon: Clock },
  'Archived': { color: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20', icon: Archive },
  'Action Required': { color: 'bg-pink-500/10 text-pink-400 border-pink-500/20', icon: AlertCircle },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-sm",
      config.color,
      className
    )}>
      <Icon size={12} className="stroke-[2.5]" />
      {status}
    </span>
  );
};
