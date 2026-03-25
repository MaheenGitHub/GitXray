import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const LanguageChart = ({ languages }) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const ctx = chartRef.current.getContext('2d')

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Get top 8 languages
    const sortedLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)

    const labels = sortedLanguages.map(([lang]) => lang)
    const data = sortedLanguages.map(([, bytes]) => bytes)

    // Generate colors for languages
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', 
      '#EF4444', '#06B6D4', '#F97316', '#84CC16'
    ]

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Bytes of Code',
          data: data,
          backgroundColor: colors.map(color => color + '80'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 8,
          hoverOffset: 4
        }
      ]
    }

    const config = {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f3f4f6',
              padding: 15,
              font: {
                size: 11
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
                    index: i
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
            callbacks: {
              label: function(context) {
                const value = context.parsed
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((value / total) * 100).toFixed(1)
                const bytesInMB = (value / 1024 / 1024).toFixed(1)
                
                return [
                  `Size: ${bytesInMB} MB`,
                  `Percentage: ${percentage}%`
                ]
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
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
  }, [languages])

  return (
    <div className="chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

export default LanguageChart
