import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesChart = ({ salesData, title = "Monthly Sales Revenue" }) => {
  // Process sales data to group by month and sum revenue
  const processMonthlyData = (sales) => {
    if (!sales || sales.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Group sales by month
    const monthlyData = sales.reduce((acc, sale) => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });

      if (!acc[monthKey]) {
        acc[monthKey] = {
          label: monthLabel,
          revenue: 0,
          units: 0,
          royalty: 0
        };
      }

      acc[monthKey].revenue += parseFloat(sale.revenue) || 0;
      acc[monthKey].units += parseInt(sale.units) || 0;
      acc[monthKey].royalty += parseFloat(sale.royalty) || 0;

      return acc;
    }, {});

    // Convert to arrays and sort by date
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(key => monthlyData[key].label);
    const revenueData = sortedMonths.map(key => monthlyData[key].revenue);
    const unitsData = sortedMonths.map(key => monthlyData[key].units);
    const royaltyData = sortedMonths.map(key => monthlyData[key].royalty);

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenueData,
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'Units Sold',
          data: unitsData,
          backgroundColor: 'rgba(16, 185, 129, 0.5)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: 'Royalty ($)',
          data: royaltyData,
          backgroundColor: 'rgba(245, 158, 11, 0.5)',
          borderColor: 'rgba(245, 158, 11, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        }
      ]
    };
  };

  const chartData = processMonthlyData(salesData);

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
            if (context.dataset.label === 'Revenue ($)' || context.dataset.label === 'Royalty ($)') {
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
          text: 'Month'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Revenue & Royalty ($)'
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
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlySalesChart;
