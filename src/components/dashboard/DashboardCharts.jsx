import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

export const DoughnutChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;
    
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chartData = [data.on_hold, data.in_progress, data.completed];

      // Clear previous chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['On Hold', 'In Progress', 'Completed'],
          datasets: [{
            data: chartData,
            backgroundColor: ['#7987FF', '#F765A3', '#A155B9'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 8,
                boxHeight: 8,
                padding: 10,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          },
        },
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>
};

export const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let chartInstance = null;

    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      // Prepare data for bar chart
      const labels = data.map(item => item.title);
      const chartData = data.map(item => item.count);
      const tooltips = data.map(item => item.tooltip);

      // Generate colors for bars
      const backgroundColors = labels.map((_, index) => {
        const colors = ['#FF5B5B', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B',
          '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4',
          '#A855F7', '#EF4444'];
        return colors[index % colors.length];
      });

      // Calculate dynamic bar thickness
      const barThickness = Math.min(80, Math.max(20, 400 / labels.length));

      // Clear previous chart if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Requests',
            data: chartData,
            backgroundColor: backgroundColors,
            borderRadius: {
              topLeft: 20,
              topRight: 20,
              bottomLeft: 0,
              bottomRight: 0
            },
            borderSkipped: false,
            barThickness: barThickness,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 50
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
                drawBorder: false
              },
              ticks: {
                display: false
              },
              border: {
                display: false
              }
            },
            x: {
              grid: {
                drawOnChartArea: true,
                lineWidth: 0.5,
                color: '#E5E7EB',
                drawTicks: false
              },
              border: {
                display: false
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const index = context.dataIndex;
                  return tooltips[index];
                }
              }
            }
          }
        },
        plugins: [{
          id: 'customLabels',
          afterDraw(chart) {
            const {ctx, data, scales: {x, y}} = chart;

            ctx.save();
            ctx.font = '700 24px Manrope';
            ctx.fillStyle = '#1F2937';
            ctx.textAlign = 'center';

            data.datasets[0].data.forEach((value, index) => {
              if (value > 0) {
                const xPos = x.getPixelForValue(index);
                const yPos = y.getPixelForValue(value);
                const text = value.toString();
                ctx.fillText(text, xPos, yPos - 10);
              }
            });
            ctx.restore();
          }
        }]
      });
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>
};