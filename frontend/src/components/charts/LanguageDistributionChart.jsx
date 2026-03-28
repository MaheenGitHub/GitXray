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

  // Calculate total bytes for percentage calculation
  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
  
  // Prepare data for chart
  const chartData = {
    labels: Object.keys(languages),
    datasets: [
      {
        data: Object.values(languages),
        backgroundColor: [
          '#3B82F6', // Blue
          '#8B5CF6', // Purple
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#EF4444', // Red
          '#06B6D4', // Cyan
          '#F97316', // Orange
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
        position: 'bottom',
        labels: {
          color: '#9CA3AF',
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalBytes) * 100).toFixed(1);
            return `${label}: ${percentage}%`;
          }
        }
      }
    },
    cutout: '60%',
  };

  return (
    <div className="glass-morphism rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Language Distribution</h3>
      <div className="relative h-64">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-400">
          {Object.keys(languages).length} languages • {totalBytes.toLocaleString()} bytes
        </div>
      </div>
    </div>
  );
};

export default LanguageDistributionChart;
