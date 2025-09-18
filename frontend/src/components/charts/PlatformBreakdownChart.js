import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlatformBreakdownChart = ({ salesData, title = "Sales by Platform" }) => {
  // Process sales data to group by platform
  const processPlatformData = (sales) => {
    if (!sales || sales.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group sales by platform
    const platformData = sales.reduce((acc, sale) => {
      const platform = sale.platform || 'Unknown';
      
      if (!acc[platform]) {
        acc[platform] = {
          revenue: 0,
          units: 0,
          royalty: 0,
          count: 0
        };
      }

      acc[platform].revenue += parseFloat(sale.revenue) || 0;
      acc[platform].units += parseInt(sale.units) || 0;
      acc[platform].royalty += parseFloat(sale.royalty) || 0;
      acc[platform].count += 1;

      return acc;
    }, {});

    // Convert to arrays
    const labels = Object.keys(platformData);
    const revenueData = labels.map(platform => platformData[platform].revenue);

    // Generate colors for each platform
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(34, 197, 94, 0.8)',    // Emerald
      'rgba(251, 146, 60, 0.8)',   // Orange
      'rgba(168, 85, 247, 0.8)',   // Violet
    ];

    const borderColors = colors.map(color => color.replace('0.8', '1'));

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenueData,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: borderColors.slice(0, labels.length),
          borderWidth: 2,
        }
      ]
    };
  };

  const chartData = processPlatformData(salesData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
    maintainAspectRatio: false,
  };

  if (!salesData || salesData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No sales data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PlatformBreakdownChart;
