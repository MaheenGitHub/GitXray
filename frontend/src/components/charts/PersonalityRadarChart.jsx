import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const PersonalityRadarChart = ({ personality }) => {
  if (!personality || !personality.scores) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <div className="text-gray-400">No personality data available</div>
      </div>
    );
  }

  // Map personality scores to radar data
  const radarData = [
    {
      trait: 'Builder',
      score: personality.scores.builder || 0,
      fullMark: 100,
    },
    {
      trait: 'Explorer',
      score: personality.scores.explorer || 0,
      fullMark: 100,
    },
    {
      trait: 'Debugger',
      score: personality.scores.debugger || 0,
      fullMark: 100,
    },
    {
      trait: 'Perfectionist',
      score: personality.scores.perfectionist || 0,
      fullMark: 100,
    },
    {
      trait: 'Hustler',
      score: personality.scores.hustler || 0,
      fullMark: 100,
    },
  ];

  // Color mapping for each personality type
  const personalityColors = {
    Builder: '#3B82F6', // Blue
    Explorer: '#10B981', // Green
    Debugger: '#F59E0B', // Yellow
    Perfectionist: '#8B5CF6', // Purple
    Hustler: '#EF4444', // Red
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Developer DNA</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid 
              gridType="polygon" 
              stroke="#374151"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="trait"
              tick={{ fill: '#9CA3AF', fontSize: 14, fontWeight: 500 }}
              className="font-medium"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Personality Scores"
              dataKey="score"
              stroke="#60A5FA"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {radarData.map((item) => (
          <div key={item.trait} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: personalityColors[item.trait] }}
            />
            <span className="text-gray-400">
              {item.trait}: {item.score}/100
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityRadarChart;
