// src/components/organisms/VisualizationArea.jsx

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Activity,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
  Grid3x3,
  LineChart as LineChartIcon,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart
} from 'recharts';

/**
 * VisualizationArea Component - Organism
 * Comprehensive data visualization suite with multiple chart types
 */
const VisualizationArea = ({ 
  data = null,
  type = 'frequency', // frequency, comparison, entropy, performance, radar, area
  title,
  subtitle,
  description,
  
  // Chart customization
  height = 350,
  colors = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#06b6d4', // Cyan
    '#f43f5e', // Rose
    '#84cc16', // Lime
  ],
  
  // Features
  showLegend = true,
  showGrid = true,
  interactive = true,
  allowChartSwitch = true,
  showInfo = true,
  animated = true,
  
  // Actions
  onDataPointClick,
  onExport,
  onRefresh,
  
  className = '',
  ...props
}) => {
  const [chartType, setChartType] = useState('bar');
  const [fullscreen, setFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const chartRef = useRef(null);

  // Process data based on visualization type
  const getProcessedData = () => {
    if (!data) return [];

    switch (type) {
      case 'frequency':
        return processFrequencyData(data);
      case 'comparison':
        return processComparisonData(data);
      case 'entropy':
        return processEntropyData(data);
      case 'performance':
        return processPerformanceData(data);
      case 'radar':
        return processRadarData(data);
      case 'area':
        return processAreaData(data);
      default:
        return Array.isArray(data) ? data : [];
    }
  };

  // Process frequency data
  const processFrequencyData = (rawData) => {
    if (rawData.text) {
      const frequency = {};
      const text = rawData.text.toUpperCase().replace(/[^A-Z]/g, '');
      
      for (let char of text) {
        frequency[char] = (frequency[char] || 0) + 1;
      }

      return Object.entries(frequency)
        .map(([letter, count]) => ({
          letter,
          count,
          percentage: ((count / text.length) * 100).toFixed(2),
          value: count
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
    }
    return rawData.data || rawData || [];
  };

  // Process comparison data
  const processComparisonData = (rawData) => {
    if (rawData.algorithms) {
      return Object.entries(rawData.algorithms).map(([name, metrics]) => ({
        name,
        time: parseFloat(metrics.avgTime || metrics.time || 0),
        throughput: parseFloat(metrics.throughput || 0),
        efficiency: parseFloat(metrics.efficiency || 0),
        operations: metrics.count || 0,
      }));
    }
    return Array.isArray(rawData) ? rawData : [];
  };

  // Process entropy data
  const processEntropyData = (rawData) => {
    if (rawData.plaintext && rawData.ciphertext) {
      return [
        { 
          name: 'Plaintext', 
          value: parseFloat(rawData.plaintext.score),
          entropy: parseFloat(rawData.plaintext.entropy || 0),
          rating: rawData.plaintext.rating?.label || 'N/A'
        },
        { 
          name: 'Ciphertext', 
          value: parseFloat(rawData.ciphertext.score),
          entropy: parseFloat(rawData.ciphertext.entropy || 0),
          rating: rawData.ciphertext.rating?.label || 'N/A'
        },
      ];
    }
    return Array.isArray(rawData) ? rawData : [];
  };

  // Process performance data
  const processPerformanceData = (rawData) => {
    if (Array.isArray(rawData)) {
      return rawData.map((item, idx) => ({
        operation: item.operation || `Op ${idx + 1}`,
        time: parseFloat(item.executionTime || item.time || 0),
        throughput: parseFloat(item.throughput || 0),
        efficiency: parseFloat(item.efficiency || 0),
      }));
    }
    return [];
  };

  // Process radar data
  const processRadarData = (rawData) => {
    if (rawData.metrics) {
      return [
        { metric: 'Speed', value: rawData.metrics.speed || 0, fullMark: 100 },
        { metric: 'Security', value: rawData.metrics.security || 0, fullMark: 100 },
        { metric: 'Complexity', value: rawData.metrics.complexity || 0, fullMark: 100 },
        { metric: 'Efficiency', value: rawData.metrics.efficiency || 0, fullMark: 100 },
        { metric: 'Randomness', value: rawData.metrics.randomness || 0, fullMark: 100 },
      ];
    }
    return Array.isArray(rawData) ? rawData : [];
  };

  // Process area chart data
  const processAreaData = (rawData) => {
    if (Array.isArray(rawData)) {
      return rawData.map((item, idx) => ({
        name: item.name || `Point ${idx + 1}`,
        value: parseFloat(item.value || 0),
        secondary: parseFloat(item.secondary || 0),
      }));
    }
    return [];
  };

  const chartData = getProcessedData();

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 dark:text-gray-400">
                {entry.name}:
              </span>
              <span className="font-bold" style={{ color: entry.color }}>
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                {entry.unit && ` ${entry.unit}`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Handle data point click
  const handleDataPointClick = (data, index) => {
    if (interactive && onDataPointClick) {
      onDataPointClick(data, index);
    }
  };

  // Export chart as image
  const handleExport = () => {
    if (onExport) {
      onExport(chartData, chartType);
    } else {
      // Default export functionality
      alert('Export functionality - implement with html2canvas or similar library');
    }
  };

  // Render different chart types
  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
          <Activity className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No visualization data</p>
          <p className="text-sm text-gray-500">Process some text to see charts</p>
        </div>
      );
    }

    const chartProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      tick: { fill: 'currentColor', fontSize: 12 },
      stroke: 'currentColor',
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart {...chartProps}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-gray-200 dark:stroke-gray-700" 
                  opacity={0.3} 
                />
              )}
              <XAxis 
                dataKey={type === 'frequency' ? 'letter' : 'name'}
                {...commonAxisProps}
              />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar 
                dataKey={type === 'frequency' ? 'count' : 'value'}
                fill={colors[0]}
                radius={[8, 8, 0, 0]}
                onClick={handleDataPointClick}
                cursor={interactive ? 'pointer' : 'default'}
                animationDuration={animated ? 500 : 0}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart {...chartProps}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-gray-200 dark:stroke-gray-700" 
                  opacity={0.3} 
                />
              )}
              <XAxis 
                dataKey={type === 'frequency' ? 'letter' : 'name'}
                {...commonAxisProps}
              />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line 
                type="monotone"
                dataKey={type === 'frequency' ? 'count' : 'value'}
                stroke={colors[1]}
                strokeWidth={3}
                dot={{ fill: colors[1], r: 5 }}
                activeDot={{ r: 7, onClick: handleDataPointClick }}
                animationDuration={animated ? 500 : 0}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={chartData.slice(0, 8)}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={Math.min(height / 3, 120)}
                fill="#8884d8"
                dataKey={type === 'frequency' ? 'count' : 'value'}
                onClick={handleDataPointClick}
                animationDuration={animated ? 500 : 0}
              >
                {chartData.slice(0, 8).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]}
                    cursor={interactive ? 'pointer' : 'default'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <RadarChart data={chartData}>
              <PolarGrid className="stroke-gray-300 dark:stroke-gray-600" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: 'currentColor', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]}
                tick={{ fill: 'currentColor', fontSize: 10 }}
              />
              <Radar 
                name="Score" 
                dataKey="value" 
                stroke={colors[4]} 
                fill={colors[4]} 
                fillOpacity={0.6}
                animationDuration={animated ? 500 : 0}
              />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </RadarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart {...chartProps}>
              {showGrid && (
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  className="stroke-gray-200 dark:stroke-gray-700" 
                  opacity={0.3} 
                />
              )}
              <XAxis dataKey="name" {...commonAxisProps} />
              <YAxis {...commonAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={colors[5]} 
                fill={colors[5]}
                fillOpacity={0.3}
                animationDuration={animated ? 500 : 0}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const displayTitle = title || `${type.charAt(0).toUpperCase() + type.slice(1)} Visualization`;

  // Chart type buttons
  const chartTypeButtons = [
    { type: 'bar', icon: BarChart3, label: 'Bar Chart' },
    { type: 'line', icon: LineChartIcon, label: 'Line Chart' },
    { type: 'pie', icon: PieChartIcon, label: 'Pie Chart' },
    { type: 'radar', icon: Grid3x3, label: 'Radar Chart' },
    { type: 'area', icon: TrendingUp, label: 'Area Chart' },
  ];

  return (
    <Card 
      className={`${className} ${fullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''}`}
      {...props}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {displayTitle}
              </h3>
              {showInfo && description && (
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="relative p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <Info className="w-4 h-4 text-gray-500" />
                  {showTooltip && (
                    <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-10">
                      {description}
                    </div>
                  )}
                </button>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Chart Type Selector */}
            {allowChartSwitch && (
              <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {chartTypeButtons.map(({ type: btnType, icon: Icon, label }) => (
                  <button
                    key={btnType}
                    onClick={() => setChartType(btnType)}
                    className={`p-2 rounded transition-colors ${
                      chartType === btnType
                        ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    title={label}
                  >
                    <Icon size={18} />
                  </button>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                icon={<RefreshCw size={16} />}
                title="Refresh Data"
              />
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              icon={<Download size={16} />}
              title="Export Chart"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
              icon={fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            />
          </div>
        </div>

        {/* Chart Area */}
        <div 
          ref={chartRef}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
        >
          {renderChart()}
        </div>

        {/* Stats Footer */}
        {chartData && chartData.length > 0 && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700 flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>
                <strong className="text-gray-900 dark:text-white">
                  {chartData.length}
                </strong> data points
              </span>
              <Badge variant="primary" size="sm">
                {chartType.toUpperCase()}
              </Badge>
              {animated && (
                <Badge variant="success" size="sm" dot>
                  Animated
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setChartType('bar')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Reset View
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// PropTypes
VisualizationArea.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  type: PropTypes.oneOf(['frequency', 'comparison', 'entropy', 'performance', 'radar', 'area']),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  
  height: PropTypes.number,
  colors: PropTypes.arrayOf(PropTypes.string),
  
  showLegend: PropTypes.bool,
  showGrid: PropTypes.bool,
  interactive: PropTypes.bool,
  allowChartSwitch: PropTypes.bool,
  showInfo: PropTypes.bool,
  animated: PropTypes.bool,
  
  onDataPointClick: PropTypes.func,
  onExport: PropTypes.func,
  onRefresh: PropTypes.func,
  
  className: PropTypes.string,
};

export default VisualizationArea;