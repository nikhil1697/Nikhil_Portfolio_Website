import React from 'react';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300 border border-green-700">
    <span className="w-2 h-2 mr-1.5 bg-green-400 rounded-full animate-pulse"></span>
    {status}
  </span>
);