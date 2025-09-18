import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SalesTrendChart = ({ salesData, title = "Sales Trend Over Time" }) => {
  // Process sales data to create a trend line
  const processTrendData = (sales) => {
    if (!sales || sales.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort sales by date
    const sortedSales = [...sales].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Group by date and sum values
    const dailyData = sortedSales.reduce((acc, sale) => {
      const date = new Date(sale.date).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = {
          revenue: 0,
          units: 0,
          royalty: 0
        };
      }

      acc[date].revenue += parseFloat(sale.revenue) || 0;
      acc[date].units += parseInt(sale.units) || 0;
      acc[date].royalty += parseFloat(sale.royalty) || 0;

      return acc;
    }, {});

    // Convert to arrays
    const dates = Object.keys(dailyData).sort();
    const labels = dates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    });
    
    const revenueData = dates.map(date => dailyData[date].revenue);
    const unitsData = dates.map(date => dailyData[date].units);

    // Calculate cumulative values for trend
    const cumulativeRevenue = revenueData.reduce((acc, curr, index) => {
      acc.push(index === 0 ? curr : acc[index - 1] + curr);
      return acc;
    }, []);

    return {
      labels,
      datasets: [
        {
          label: 'Daily Revenue ($)',
          data: revenueData,
          borderColor: 'rgba(59, 130, 246, 1)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: 'Cumulative Revenue ($)',
          data: cumulativeRevenue,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y',
          borderDash: [5, 5],
        },
        {
          label: 'Daily Units',
          data: unitsData,
          borderColor: 'rgba(245, 158, 11, 1)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        }
      ]
    };
  };

  const chartData = processTrendData(salesData);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.dataset.label.includes('Revenue') || context.dataset.label.includes('Royalty')) {
              label += '$' + context.parsed.y.toFixed(2);
            } else {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Units Sold'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
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
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesTrendChart;
