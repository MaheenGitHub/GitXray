import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const StatsChart = ({ scores }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const personalityData = {
      builder: { label: 'Builder', color: '#3B82F6', icon: '🏗️' },
      explorer: { label: 'Explorer', color: '#10B981', icon: '🧭' },
      debugger: { label: 'Debugger', color: '#F59E0B', icon: '🔍' },
      perfectionist: { label: 'Perfectionist', color: '#8B5CF6', icon: '💎' },
      hustler: { label: 'Hustler', color: '#EF4444', icon: '🚀' }
    }

    const data = {
      labels: Object.keys(scores).map(key => personalityData[key].label),
      datasets: [
        {
          label: 'Personality Score',
          data: Object.values(scores),
          backgroundColor: Object.keys(scores).map(key => personalityData[key].color + '80'),
          borderColor: Object.keys(scores).map(key => personalityData[key].color),
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 40,
        }
      ]
    }

    const config = {
      type: 'bar',
      data: data,
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
            callbacks: {
              title: function(context) {
                const index = context[0].dataIndex
                const personalityType = Object.keys(scores)[index]
                return `${personalityData[personalityType].icon} ${personalityData[personalityType].label}`
              },
              label: function(context) {
                return `Score: ${context.parsed.y}/100`
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: '#374151',
              drawBorder: false
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              },
              callback: function(value) {
                return value + '/100'
              }
            }
          },
          x: {
            grid: {
              display: false,
              drawBorder: false
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
          easing: 'easeInOutQuart'
        }
      }
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [scores])

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default StatsChart
