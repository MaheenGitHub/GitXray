import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const LanguagePieChart = ({ languages, className = '' }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current || !languages || Object.keys(languages).length === 0) return

    const ctx = chartRef.current.getContext('2d')

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Process language data
    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)

    const labels = sortedLanguages.map(([lang]) => lang)
    const data = sortedLanguages.map(([, bytes]) => bytes)

    // Generate beautiful colors for languages
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Green
      '#F59E0B', // Amber
      '#8B5CF6', // Purple
      '#EF4444', // Red
      '#06B6D4', // Cyan
      '#F97316', // Orange
      '#84CC16', // Lime
      '#EC4899', // Pink
      '#14B8A6', // Teal
    ]

    const backgroundColors = colors.slice(0, data.length).map(color => color + 'CC')
    const borderColors = colors.slice(0, data.length)

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Language Usage',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 8,
          hoverBorderWidth: 3,
        }
      ]
    }

    const config = {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f3f4f6',
              padding: 20,
              font: {
                size: 12,
                family: 'Inter'
              },
              generateLabels: function(chart) {
                const data = chart.data
                const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
                
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  const percentage = ((value / total) * 100).toFixed(1)
                  
                  return {
                    text: `${label} (${percentage}%)`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    strokeStyle: data.datasets[0].borderColor[i],
                    lineWidth: 2,
                    hidden: false,
                    index: i,
                    font: {
                      size: 12
                    }
                  }
                })
              }
            }
          },
          tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#f3f4f6',
            bodyColor: '#f3f4f6',
            borderColor: '#374151',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              title: function(context) {
                return context[0].label
              },
              label: function(context) {
                const value = context.parsed
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                const bytesInMB = (value / 1024 / 1024).toFixed(1)
                const bytesInKB = (value / 1024).toFixed(1)
                
                let sizeText = ''
                if (bytesInMB >= 1) {
                  sizeText = `${bytesInMB} MB`
                } else {
                  sizeText = `${bytesInKB} KB`
                }
                
                return [
                  `Size: ${sizeText}`,
                  `Percentage: ${percentage}%`,
                  `Bytes: ${value.toLocaleString()}`
                ]
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeInOutQuart',
          delay: (context) => {
            let delay = 0
            if (context.type === 'data' && context.mode === 'default') {
              delay = context.dataIndex * 100
            }
            return delay
          }
        }
      }
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [languages])

  // Handle empty state
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-800/30 rounded-lg border border-gray-700 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-400">No language data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="chart-container" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {Object.keys(languages).length}
          </div>
          <div className="text-sm text-gray-400">Languages</div>
        </div>
      </div>
    </div>
  )
}

export default LanguagePieChart
