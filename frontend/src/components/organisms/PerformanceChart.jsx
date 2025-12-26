// src/components/organisms/PerformanceChart.jsx

import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * PerformanceChart Component
 * Base chart component with multiple types
 */
const PerformanceChart = ({ type = 'bar', data, title, height = 300, options = {} }) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          color: 'rgb(107, 114, 128)',
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          family: 'Inter, sans-serif',
          weight: 'bold',
        },
        color: 'rgb(17, 24, 39)',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'Inter, sans-serif',
        },
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
    },
  };

  const barOptions = {
    ...defaultOptions,
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgb(107, 114, 128)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgb(107, 114, 128)',
        },
      },
      ...options.scales,
    },
  };

  const lineOptions = {
    ...defaultOptions,
    ...options,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgb(107, 114, 128)',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: 'rgb(107, 114, 128)',
        },
      },
      ...options.scales,
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
      },
    },
  };

  const pieOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      legend: {
        ...defaultOptions.plugins.legend,
        position: 'right',
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={barOptions} height={height} />;
      case 'line':
        return <Line data={data} options={lineOptions} height={height} />;
      case 'pie':
        return <Pie data={data} options={pieOptions} height={height} />;
      default:
        return <Bar data={data} options={barOptions} height={height} />;
    }
  };

  return (
    <div style={{ height: `${height}px`, position: 'relative' }}>
      {renderChart()}
    </div>
  );
};

PerformanceChart.propTypes = {
  type: PropTypes.oneOf(['bar', 'line', 'pie']),
  data: PropTypes.shape({
    labels: PropTypes.array.isRequired,
    datasets: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.array.isRequired,
      backgroundColor: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      borderColor: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
      ]),
      borderWidth: PropTypes.number,
    })).isRequired,
  }).isRequired,
  title: PropTypes.string,
  height: PropTypes.number,
  options: PropTypes.object,
};

/**
 * FrequencyChart Component
 * Displays character frequency distribution
 */
export const FrequencyChart = ({ frequencyData, maxItems = 10 }) => {
  if (!frequencyData || !frequencyData.data || frequencyData.data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <p>No frequency data available</p>
        </div>
      </div>
    );
  }

  const topData = frequencyData.data.slice(0, maxItems);

  const chartData = {
    labels: topData.map(item => item.char),
    datasets: [
      {
        label: 'Frequency (%)',
        data: topData.map(item => parseFloat(item.percentage)),
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Character Frequency Distribution
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Top {maxItems} most frequent characters
      </p>
      <PerformanceChart 
        type="bar" 
        data={chartData} 
        height={300}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Frequency: ${context.parsed.y.toFixed(2)}%`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

FrequencyChart.propTypes = {
  frequencyData: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.shape({
      char: PropTypes.string.isRequired,
      count: PropTypes.number,
      percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })).isRequired,
  }),
  maxItems: PropTypes.number,
};

/**
 * ComparisonChart Component
 * Compares algorithm performance
 */
export const ComparisonChart = ({ comparison }) => {
  if (!comparison || Object.keys(comparison).length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <p>No comparison data available</p>
        </div>
      </div>
    );
  }

  const algorithms = Object.keys(comparison);
  
  const chartData = {
    labels: algorithms,
    datasets: [
      {
        label: 'Average Time (ms)',
        data: algorithms.map(algo => parseFloat(comparison[algo].avgTime)),
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgba(168, 85, 247, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 50,
      },
      {
        label: 'Operations Count',
        data: algorithms.map(algo => comparison[algo].count),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Algorithm Performance Comparison
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Compare execution time and usage across algorithms
      </p>
      <PerformanceChart 
        type="bar" 
        data={chartData} 
        height={320}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Value',
                color: 'rgb(107, 114, 128)',
              }
            }
          }
        }}
      />
    </div>
  );
};

ComparisonChart.propTypes = {
  comparison: PropTypes.objectOf(PropTypes.shape({
    avgTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    count: PropTypes.number.isRequired,
    totalTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    avgThroughput: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalChars: PropTypes.number,
  })),
};

/**
 * TimeSeriesChart Component
 * Shows performance over time
 */
export const TimeSeriesChart = ({ history, maxPoints = 15 }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <p>No historical data available</p>
        </div>
      </div>
    );
  }

  const recentHistory = history.slice(-maxPoints);

  const chartData = {
    labels: recentHistory.map((_, idx) => `Op ${idx + 1}`),
    datasets: [
      {
        label: 'Execution Time (ms)',
        data: recentHistory.map(h => parseFloat(h.executionTime)),
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Performance Over Time
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Last {recentHistory.length} operations
      </p>
      <PerformanceChart 
        type="line" 
        data={chartData} 
        height={280}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Time (ms)',
                color: 'rgb(107, 114, 128)',
              }
            }
          }
        }}
      />
    </div>
  );
};

TimeSeriesChart.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    executionTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    algorithm: PropTypes.string,
    timestamp: PropTypes.string,
    inputSize: PropTypes.number,
    throughput: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })).isRequired,
  maxPoints: PropTypes.number,
};

/**
 * UsagePieChart Component
 * Shows algorithm usage distribution
 */
export const UsagePieChart = ({ comparison }) => {
  if (!comparison || Object.keys(comparison).length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <p>No usage data available</p>
        </div>
      </div>
    );
  }

  const algorithms = Object.keys(comparison);
  
  const colors = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(249, 115, 22, 0.8)',   // Orange
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(6, 182, 212, 0.8)',    // Cyan
    'rgba(132, 204, 22, 0.8)',   // Lime
  ];

  const borderColors = colors.map(c => c.replace('0.8', '1'));

  const chartData = {
    labels: algorithms,
    datasets: [
      {
        label: 'Usage Count',
        data: algorithms.map(algo => comparison[algo].count),
        backgroundColor: colors.slice(0, algorithms.length),
        borderColor: borderColors.slice(0, algorithms.length),
        borderWidth: 2,
      },
    ],
  };

  const totalCount = algorithms.reduce((sum, algo) => sum + comparison[algo].count, 0);

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Algorithm Usage Distribution
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Total operations: <span className="font-bold text-gray-900 dark:text-white">{totalCount}</span>
      </p>
      <PerformanceChart 
        type="pie" 
        data={chartData} 
        height={320}
        options={{
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const percentage = ((value / totalCount) * 100).toFixed(1);
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          }
        }}
      />
    </div>
  );
};

UsagePieChart.propTypes = {
  comparison: PropTypes.objectOf(PropTypes.shape({
    count: PropTypes.number.isRequired,
    avgTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
};

/**
 * EntropyComparisonChart Component
 * Compares entropy before and after encryption
 */
export const EntropyComparisonChart = ({ entropyData }) => {
  if (!entropyData || !entropyData.plaintext || !entropyData.ciphertext) {
    return (
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <p>No entropy data available</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: ['Plaintext', 'Ciphertext'],
    datasets: [
      {
        label: 'Entropy Score (%)',
        data: [
          parseFloat(entropyData.plaintext.score),
          parseFloat(entropyData.ciphertext.score)
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(34, 197, 94, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(34, 197, 94, 1)',
        ],
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 80,
      },
    ],
  };

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Entropy Comparison
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Improvement: <span className={`font-bold ${
          parseFloat(entropyData.improvement) > 0 
            ? 'text-green-600 dark:text-green-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {entropyData.improvementPercent}
        </span>
      </p>
      <PerformanceChart 
        type="bar" 
        data={chartData} 
        height={280}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Entropy Score (%)',
                color: 'rgb(107, 114, 128)',
              }
            }
          }
        }}
      />
    </div>
  );
};

EntropyComparisonChart.propTypes = {
  entropyData: PropTypes.shape({
    plaintext: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      entropy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.object,
    }).isRequired,
    ciphertext: PropTypes.shape({
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      entropy: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      rating: PropTypes.object,
    }).isRequired,
    improvement: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    improvementPercent: PropTypes.string.isRequired,
    analysis: PropTypes.string,
  }),
};

export default PerformanceChart;