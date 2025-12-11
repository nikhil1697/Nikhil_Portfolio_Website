import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  icon: LucideIcon;
  count?: number | string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, count }) => {
  return (
    <div className="flex items-center space-x-2 mb-4 text-gray-200 border-b border-gray-700 pb-2">
      <Icon size={20} className="text-blue-400" />
      <h2 className="text-lg font-semibold uppercase tracking-wider">{title}</h2>
      {count && (
        <span className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
};