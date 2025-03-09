
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { format } from 'date-fns';

const TimelineChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!data || data.length === 0) return;

    // Format dates for display
    const formattedData = data.map(item => ({
      ...item,
      formattedDate: format(new Date(item.timestamp), 'MMM dd, HH:mm')
    }));

    // Sort data by timestamp
    formattedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Prepare the data for the chart
    const labels = formattedData.map(item => item.formattedDate);
    const attackAttempts = formattedData.map(item => item.attemptCount);
    const successfulAttacks = formattedData.map(item => item.successCount);

    // Get the context from the canvas element
    const ctx = chartRef.current.getContext('2d');
    
    // Create gradients
    const attemptsGradient = ctx.createLinearGradient(0, 0, 0, 400);
    attemptsGradient.addColorStop(0, 'rgba(0, 170, 255, 0.6)');
    attemptsGradient.addColorStop(1, 'rgba(0, 170, 255, 0.05)');
    
    const successGradient = ctx.createLinearGradient(0, 0, 0, 400);
    successGradient.addColorStop(0, 'rgba(255, 56, 96, 0.6)');
    successGradient.addColorStop(1, 'rgba(255, 56, 96, 0.05)');

    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Attack Attempts',
            data: attackAttempts,
            borderColor: 'rgba(0, 170, 255, 1)',
            backgroundColor: attemptsGradient,
            borderWidth: 2,
            pointBackgroundColor: 'rgba(0, 170, 255, 1)',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: true
          },
          {
            label: 'Successful Attacks',
            data: successfulAttacks,
            borderColor: 'rgba(255, 56, 96, 1)',
            backgroundColor: successGradient,
            borderWidth: 2,
            pointBackgroundColor: 'rgba(255, 56, 96, 1)',
            pointRadius: 3,
            pointHoverRadius: 5,
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: 'rgba(160, 160, 160, 0.8)',
              font: {
                family: "'Rajdhani', sans-serif",
                size: 12
              },
              boxWidth: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(20, 24, 36, 0.9)',
            titleColor: '#00ffaa',
            bodyColor: '#ffffff',
            borderColor: 'rgba(0, 255, 170, 0.2)',
            borderWidth: 1,
            padding: 12,
            titleFont: {
              family: "'Rajdhani', sans-serif",
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Rajdhani', sans-serif",
              size: 13
            },
            callbacks: {
              afterLabel: function(context) {
                if (context.datasetIndex === 1) { // Success dataset
                  const item = formattedData[context.dataIndex];
                  const successRate = (item.successCount / item.attemptCount * 100).toFixed(1);
                  return `Success Rate: ${successRate}%`;
                }
                return null;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(160, 160, 160, 0.8)',
              font: {
                family: "'Share Tech Mono', monospace",
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: 'rgba(160, 160, 160, 0.8)',
              font: {
                family: "'Share Tech Mono', monospace",
                size: 11
              }
            },
            grid: {
              color: 'rgba(0, 255, 170, 0.05)'
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TimelineChart;
