import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ResumeData } from '../types';

interface SkillRadarProps {
  skills: ResumeData['skills'];
  printMode: boolean;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills, printMode }) => {
  // Transform skills data for the chart
  // We calculate a "score" based on the number of skills in each category
  const data = skills.map(cat => ({
    subject: cat.category.split(' ')[0], // Take first word for label brevity
    fullLabel: cat.category,
    A: cat.skills.length,
    fullMark: 10 // Assumption max skills per cat is around 10
  }));

  if (printMode) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 p-2 rounded shadow-xl text-xs">
          <p className="font-bold text-blue-400">{payload[0].payload.fullLabel}</p>
          <p className="text-gray-300">Proficiency Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full bg-k8s-panel border border-k8s-border rounded-lg p-4 relative overflow-hidden">
      <div className="absolute top-3 left-4 z-10">
        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-2">
          <span>Skill Topology</span>
        </h3>
        <p className="text-[10px] text-gray-500">Distribution of technical competencies</p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="55%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#9CA3AF', fontSize: 10 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.3}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};