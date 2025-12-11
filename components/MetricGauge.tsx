import React from 'react';

interface MetricGaugeProps {
  value: number;
  label: string;
  suffix: string;
  description: string;
  color: string;
  printMode: boolean;
}

export const MetricGauge: React.FC<MetricGaugeProps> = ({ value, label, suffix, description, color, printMode }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  // Ensure value is treated as 0-100 percentage for the ring visual
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div 
      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
        printMode 
          ? 'bg-white border-gray-200' 
          : 'bg-k8s-panel border-k8s-border hover:bg-gray-800 hover:border-gray-600 shadow-lg'
      }`}
    >
      <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={printMode ? '#e5e7eb' : '#1f2937'}
            strokeWidth="6"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={color}
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{ filter: printMode ? 'none' : `drop-shadow(0 0 2px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-xl font-bold font-mono tracking-tighter ${printMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {value}<span className="text-sm ml-0.5 opacity-70">{suffix}</span>
          </span>
        </div>
      </div>
      <div className={`text-xs font-bold uppercase tracking-widest mb-1 text-center ${printMode ? 'text-gray-700' : 'text-gray-300'}`}>
        {label}
      </div>
      <div className={`text-[10px] font-mono text-center leading-tight ${printMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {description}
      </div>
    </div>
  );
};