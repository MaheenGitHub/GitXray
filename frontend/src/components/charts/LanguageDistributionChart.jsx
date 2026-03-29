import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageDistributionChart = ({ languages }) => {
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="glass-morphism rounded-xl p-6 text-center">
        <div className="text-gray-400">No language data available</div>
      </div>
    );
  }

  // Format bytes to readable string
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Calculate total bytes for percentage calculation
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  // Process languages and group smaller ones
  const processLanguages = () => {
    const sortedEntries = Object.entries(languages)
      .sort(([,a], [,b]) => b - a); // Sort by byte count descending
    
    // Separate significant languages (>= 1%) from micro-languages
    const significant = [];
    const microLanguages = [];
    
    sortedEntries.forEach(([lang, bytes]) => {
      const percentage = (bytes / totalBytes) * 100;
      if (percentage >= 1.0) {
        significant.push([lang, bytes]);
      } else {
        microLanguages.push([lang, bytes]);
      }
    });
    
    // Take top 5 significant languages
    const topLanguages = Object.fromEntries(significant.slice(0, 5));
    const topBytes = Object.values(topLanguages).reduce((sum, bytes) => sum + bytes, 0);
    const microBytes = microLanguages.reduce((sum, [,bytes]) => sum + bytes, 0);
    const remainingBytes = totalBytes - topBytes - microBytes;
    
    const finalLanguages = { ...topLanguages };
    
    // Add micro-languages to "Others" if they exist
    if (microBytes > 0 || remainingBytes > 0) {
      finalLanguages['Others'] = (microBytes || 0) + (remainingBytes || 0);
    }
    
    return finalLanguages;
  };
  
  const processedLanguages = processLanguages();
  
  // Prepare data for chart
  const chartData = {
    labels: Object.keys(processedLanguages),
    datasets: [
      {
        data: Object.values(processedLanguages),
        backgroundColor: [
          '#3B82F6', // Blue
          '#8B5CF6', // Purple
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#6B7280', // Gray for Others
        ],
        borderColor: '#1F2937',
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false // Hide default legend, we'll create custom one
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalBytes) * 100).toFixed(1);
            return `${label}: ${percentage}% (${formatBytes(value)})`;
          }
        }
      }
    },
    cutout: '60%',
  };

  // Create custom legend items
  const legendItems = Object.entries(processedLanguages).map(([label, value], index) => {
    const percentage = ((value / totalBytes) * 100).toFixed(1);
    const colors = [
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#10B981', // Green
      '#F59E0B', // Yellow
      '#EF4444', // Red
      '#6B7280', // Gray for Others
    ];
    
    return {
      label: `${label}: ${percentage}%`,
      color: colors[index % colors.length]
    };
  });

  return (
    <div className="glass-morphism rounded-xl p-6 flex flex-col h-full">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Language Distribution</h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative h-64 w-full max-w-xs">
          <Doughnut data={chartData} options={options} />
        </div>
      </div>
      
      {/* Custom 2-Column Legend */}
      <div className="mt-6 mb-4">
        <div 
          className="grid gap-3 text-xs"
          style={{ 
            gridTemplateColumns: 'repeat(2, 1fr)',
            color: '#9CA3AF',
            padding: '10px 0 15px 0'
          }}
        >
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3" style={{ paddingLeft: '4px' }}>
              <div 
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="truncate" style={{ fontSize: '0.9rem', lineHeight: '1.4', marginLeft: '4px' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <div className="text-sm text-gray-400">
          {Object.keys(processedLanguages).length} languages • {formatBytes(totalBytes)} total
        </div>
      </div>
    </div>
  );
};

export default LanguageDistributionChart;
