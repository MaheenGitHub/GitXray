import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { Package, Star, GitFork, Eye } from 'lucide-react'

Chart.register(...registerables)

const RepoStatsChart = ({ repositoryStats, className = '' }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !repositoryStats) return

    const ctx = chartRef.current.getContext('2d')

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data
    const stats = [
      {
        label: 'Total Repos',
        value: repositoryStats.total_count || 0,
        color: '#3B82F6',
        bgColor: '#3B82F680',
        icon: Package
      },
      {
        label: 'Total Stars',
        value: repositoryStats.total_stars || 0,
        color: '#F59E0B',
        bgColor: '#F59E0B80',
        icon: Star
      },
      {
        label: 'Total Forks',
        value: repositoryStats.total_forks || 0,
        color: '#10B981',
        bgColor: '#10B98180',
        icon: GitFork
      },
      {
        label: 'Total Watchers',
        value: repositoryStats.total_watchers || 0,
        color: '#8B5CF6',
        bgColor: '#8B5CF680',
        icon: Eye
      }
    ]

    const labels = stats.map(stat => stat.label)
    const data = stats.map(stat => stat.value)
    const colors = stats.map(stat => stat.color)
    const bgColors = stats.map(stat => stat.bgColor)

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Repository Statistics',
          data: data,
          backgroundColor: bgColors,
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 60,
        }
      ]
    }

    const config = {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f3f4f6',
            bodyColor: '#f3f4f6',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              title: function(context) {
                const index = context[0].dataIndex
                const stat = stats[index]
                return `${stat.label}`
              },
              label: function(context) {
                const value = context.parsed.y
                return `Count: ${value.toLocaleString()}`
              },
              afterLabel: function(context) {
                const index = context[0].dataIndex
                const stat = stats[index]
                
                // Add additional context based on stat type
                switch (stat.label) {
                  case 'Total Repos':
                    const original = repositoryStats.original_count || 0
                    const forked = repositoryStats.forked_count || 0
                    return [
                      `Original: ${original}`,
                      `Forked: ${forked}`
                    ]
                  case 'Total Stars':
                    const avgStars = repositoryStats.total_count > 0 
                      ? (stat.value / repositoryStats.total_count).toFixed(1)
                      : 0
                    return `Average per repo: ${avgStars}`
                  case 'Total Forks':
                    const avgForks = repositoryStats.total_count > 0 
                      ? (stat.value / repositoryStats.total_count).toFixed(1)
                      : 0
                    return `Average per repo: ${avgForks}`
                  default:
                    return ''
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#374151',
              drawBorder: false,
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              },
              callback: function(value) {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M'
                } else if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K'
                }
                return value.toLocaleString()
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              }
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart',
          delay: (context) => {
            let delay = 0
            if (context.type === 'data' && context.mode === 'default') {
              delay = context.dataIndex * 200
            }
            return delay
          }
        },
        interaction: {
          intersect: false,
          mode: 'index',
        }
      }
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [repositoryStats])

  // Handle empty state
  if (!repositoryStats) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-800/30 rounded-lg border border-gray-700 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-400">No repository data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="chart-container" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          {
            label: 'Original',
            value: repositoryStats.original_count || 0,
            color: 'text-blue-500',
            icon: Package
          },
          {
            label: 'Forked',
            value: repositoryStats.forked_count || 0,
            color: 'text-green-500',
            icon: GitFork
          },
          {
            label: 'Archived',
            value: repositoryStats.archived_count || 0,
            color: 'text-gray-500',
            icon: Package
          },
          {
            label: 'Languages',
            value: repositoryStats.languages_count || 0,
            color: 'text-purple-500',
            icon: Star
          }
        ].map((stat, index) => (
          <div key={index} className="text-center p-3 bg-gray-800/30 rounded-lg">
            <stat.icon className={`w-4 h-4 ${stat.color} mx-auto mb-1`} />
            <div className="text-lg font-semibold text-white">{stat.value}</div>
            <div className="text-xs text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RepoStatsChart
