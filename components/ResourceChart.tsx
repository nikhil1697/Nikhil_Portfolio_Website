import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ResourceChartProps {
  printMode: boolean;
}

export const ResourceChart: React.FC<ResourceChartProps> = ({ printMode }) => {
  if (printMode) return null;

  // Generate mock data for the last 24 hours
  const data = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    cpu: 15 + Math.random() * 25 + (i > 8 && i < 18 ? 20 : 0), // Higher during work hours
    memory: 30 + Math.random() * 15 + (i > 8 && i < 18 ? 10 : 0),
    pods: 40 + Math.floor(Math.random() * 10)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-xl text-xs font-mono">
          <p className="text-gray-400 mb-2">Time: {label}</p>
          <div className="space-y-1">
            <p className="text-blue-400 flex justify-between gap-4">
              <span>CPU Usage:</span>
              <span className="font-bold">{payload[0].value.toFixed(1)}%</span>
            </p>
            <p className="text-purple-400 flex justify-between gap-4">
              <span>Memory:</span>
              <span className="font-bold">{payload[1].value.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-k8s-panel border border-k8s-border rounded-lg p-4 h-[300px] w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
            Cluster Resources
          </h3>
          <p className="text-[10px] text-gray-500">24h utilization metrics for resume-cluster-01</p>
        </div>
        <div className="flex gap-4 text-[10px]">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-400">CPU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-gray-400">Memory</span>
          </div>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis 
              stroke="#6b7280" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="cpu" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCpu)" 
            />
            <Area 
              type="monotone" 
              dataKey="memory" 
              stroke="#a855f7" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorMem)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};