import React from 'react';

interface TerminalBlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const TerminalBlock: React.FC<TerminalBlockProps> = ({ title = "bash", children, className = "" }) => {
  return (
    <div className={`bg-black rounded-md overflow-hidden border border-gray-700 font-mono text-sm shadow-lg ${className}`}>
      <div className="bg-gray-800 px-3 py-1 flex items-center justify-between border-b border-gray-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-gray-400 text-xs">{title}</div>
        <div className="w-8"></div> {/* Spacer */}
      </div>
      <div className="p-4 text-green-400">
        <span className="text-blue-400 mr-2">➜</span>
        <span className="text-purple-400 mr-2">~</span>
        {children}
      </div>
    </div>
  );
};