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
    <div className="glass-morphism rounded-xl p-8">
      <h3 className="text-lg font-semibold text-white mb-6 text-center">Developer DNA</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 90, right: 90, bottom: 110, left: 90 }}>
            <PolarGrid 
              gridType="polygon" 
              stroke="#374151"
              strokeDasharray="3 3"
              radialLines={true}
            />
            <PolarAngleAxis 
              dataKey="trait"
              tick={{ fill: '#9CA3AF', fontSize: 14, fontWeight: 700 }}
              className="font-bold"
              tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
              style={{ textAnchor: 'middle' }}
              radius={150} // Increased radius by 30px for better label spacing
              labelOffset={40} // Increased offset by 5px more to ensure zero overlap
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickCount={6}
              tickLine={{ stroke: '#6B7280', strokeWidth: 1 }}
              axisLine={{ stroke: '#6B7280', strokeWidth: 1 }}
              radius={100} // Increased inner radius for better spacing
            />
            <Radar
              name="Personality Scores"
              dataKey="score"
              stroke="#60A5FA"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        {radarData.map((item) => (
          <div key={item.trait} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: personalityColors[item.trait] }}
            />
            <span className="text-gray-400 font-medium">
              {item.trait}: {item.score}/100
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalityRadarChart;
