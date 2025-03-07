
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AttackDistributionChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Clean up previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (!data || data.length === 0) return;

    // Prepare the data for the chart
    const labels = data.map(item => item.name);
    const values = data.map(item => item.value);

    // Define custom colors for the pie chart
    const colors = [
      'rgba(0, 170, 255, 0.8)',  // Blue
      'rgba(255, 56, 96, 0.8)',   // Red
      'rgba(0, 255, 170, 0.8)',   // Green
      'rgba(255, 193, 7, 0.8)',   // Amber
      'rgba(156, 39, 176, 0.8)',  // Purple
      'rgba(255, 102, 0, 0.8)'    // Orange
    ];

    // Get the context from the canvas element
    const ctx = chartRef.current.getContext('2d');
    
    // Create the chart
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors,
          borderColor: 'rgba(20, 24, 36, 0.8)',
          borderWidth: 1,
          hoverOffset: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: 'rgba(160, 160, 160, 0.8)',
              font: {
                family: "'Rajdhani', sans-serif",
                size: 12
              },
              boxWidth: 15,
              padding: 15
            }
          },
          tooltip: {
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
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        elements: {
          arc: {
            borderWidth: 1
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });

    // Add center text
    Chart.register({
      id: 'centerText',
      beforeDraw: function(chart) {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        
        ctx.restore();
        
        // Calculate total
        const total = chart.data.datasets[0].data.reduce((acc, curr) => acc + curr, 0);
        
        // Font settings
        const fontSize = (height / 120).toFixed(2);
        ctx.font = `700 ${fontSize}em 'Rajdhani', sans-serif`;
        ctx.textBaseline = 'middle';
        
        // Text settings
        const text = `${total}`;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        
        // Draw text
        ctx.fillStyle = '#00ffaa';
        ctx.fillText(text, textX, textY - fontSize * 8);
        
        // Smaller "Attacks" text
        ctx.font = `500 ${fontSize * 0.6}em 'Rajdhani', sans-serif`;
        const subText = 'ATTACKS';
        const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
        
        ctx.fillStyle = 'rgba(160, 160, 160, 0.8)';
        ctx.fillText(subText, subTextX, textY + fontSize * 6);
        
        ctx.save();
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

export default AttackDistributionChart;
