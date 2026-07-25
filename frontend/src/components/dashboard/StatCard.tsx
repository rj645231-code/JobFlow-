import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number; // Percentage
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  className
}) => {
  return (
    <div className={cn(
      "bg-[#1a1d2e] rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300",
      className
    )}>
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={cn(
                "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-md",
                trend.value === 0 
                  ? "text-gray-400 bg-gray-500/10"
                  : trend.isPositive 
                    ? "text-emerald-400 bg-emerald-500/10" 
                    : "text-red-400 bg-red-500/10"
              )}>
                {trend.value === 0 ? <Minus size={12} className="mr-1" /> : 
                 trend.isPositive ? <TrendingUp size={12} className="mr-1" /> : 
                 <TrendingDown size={12} className="mr-1" />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-white/5 rounded-xl text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/10 transition-all duration-300">
          <Icon size={24} className="stroke-[1.5]" />
        </div>
      </div>
    </div>
  );
};
