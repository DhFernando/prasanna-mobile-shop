/**
 * StatsCard Component
 * Dashboard statistics card
 */

import React from 'react';
import { Icon } from '@/components/atoms';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: 'smartphone' | 'shield' | 'star' | 'check' | 'tag' | 'users' | 'zap' | 'sparkles';
  color: 'teal' | 'amber' | 'indigo' | 'emerald' | 'orange' | 'rose';
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  subtitle,
}) => {
  const colorClasses = {
    teal: 'from-teal-500 to-emerald-600 shadow-teal-500/25',
    amber: 'from-amber-500 to-orange-500 shadow-amber-500/25',
    indigo: 'from-indigo-500 to-purple-600 shadow-indigo-500/25',
    emerald: 'from-emerald-500 to-green-600 shadow-emerald-500/25',
    orange: 'from-orange-500 to-red-500 shadow-orange-500/25',
    rose: 'from-rose-500 to-pink-600 shadow-rose-500/25',
  };

  return (
    <div className="
      bg-white rounded-xl
      border border-stone-200/60
      p-6
      hover:shadow-lg hover:border-stone-200
      transition-all duration-300
    ">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-stone-500 mb-1">{title}</p>
          <p className="text-3xl font-display font-bold text-stone-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-stone-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`
          w-12 h-12 rounded-xl
          bg-gradient-to-br ${colorClasses[color]}
          shadow-lg
          flex items-center justify-center
        `}>
          <Icon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;

