'use client';

import { RadarChart as RechartsRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';

interface RadarChartProps {
  data: any[];
  dataKey: string;
  title?: string;
  color?: string;
}

export default function RadarChart({ data, dataKey, title, color = '#0ea5e9' }: RadarChartProps) {
  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar name={title || 'Value'} dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.6} />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
