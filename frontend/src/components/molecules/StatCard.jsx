// src/components/molecules/StatCard.jsx

import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';

/**
 * StatCard Component - Molecule
 * Display statistics with icon, value, and trend indicators
 */
const StatCard = ({ 
  // Content
  title,
  value,
  subtitle,
  description,
  
  // Icon
  icon: Icon,
  iconColor = 'blue',
  
  // Trend
  trend,
  trendLabel,
  showTrend = true,
  
  // Visual
  variant = 'gradient', // gradient, solid, outline, minimal
  size = 'md',
  
  // Layout
  layout = 'horizontal', // horizontal, vertical
  
  // Actions
  onClick,
  actionLabel,
  onAction,
  
  // Badge
  badge,
  badgeVariant = 'primary',
  
  className = '',
  ...props 
}) => {
  // Size configurations
  const sizes = {
    sm: {
      icon: 24,
      value: 'text-2xl',
      title: 'text-xs',
      padding: '4',
    },
    md: {
      icon: 32,
      value: 'text-3xl',
      title: 'text-sm',
      padding: '6',
    },
    lg: {
      icon: 40,
      value: 'text-4xl',
      title: 'text-base',
      padding: '8',
    },
  };

  const config = sizes[size];

  // Icon background colors
  const iconColors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    pink: 'bg-pink-500',
    indigo: 'bg-indigo-500',
    yellow: 'bg-yellow-500',
  };

  // Variant styles
  const variants = {
    gradient: `bg-gradient-to-br from-${iconColor}-500 to-${iconColor}-600 text-white`,
    solid: `bg-${iconColor}-100 dark:bg-${iconColor}-900/20 text-${iconColor}-900 dark:text-${iconColor}-100`,
    outline: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700',
    minimal: 'bg-gray-50 dark:bg-gray-800/50',
  };

  // Get trend icon and color
  const getTrendDisplay = () => {
    if (!showTrend || trend === undefined || trend === null) return null;

    const trendValue = parseFloat(trend);
    let TrendIcon = Minus;
    let trendColor = 'text-gray-500';

    if (trendValue > 0) {
      TrendIcon = TrendingUp;
      trendColor = 'text-green-600 dark:text-green-400';
    } else if (trendValue < 0) {
      TrendIcon = TrendingDown;
      trendColor = 'text-red-600 dark:text-red-400';
    }

    return (
      <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
        <TrendIcon size={16} />
        <span className="font-medium">
          {trendValue > 0 ? '+' : ''}{trend}%
        </span>
        {trendLabel && (
          <span className="text-xs opacity-75 ml-1">{trendLabel}</span>
        )}
      </div>
    );
  };

  return (
    <Card
      variant={variant === 'gradient' ? 'elevated' : 'default'}
      hover={!!onClick}
      onClick={onClick}
      padding={config.padding}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      <div className={`flex ${
        layout === 'vertical' 
          ? 'flex-col items-center text-center space-y-3' 
          : 'items-start gap-4'
      }`}>
        {/* Icon */}
        {Icon && (
          <div className={`flex-shrink-0 p-3 ${
            variant === 'gradient' 
              ? 'bg-white/20' 
              : iconColors[iconColor]
          } rounded-lg`}>
            <Icon 
              size={config.icon} 
              className={variant === 'gradient' ? 'text-white' : 'text-white'}
            />
          </div>
        )}

        {/* Content */}
        <div className={`flex-1 ${layout === 'vertical' ? 'w-full' : ''}`}>
          {/* Header with Badge */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={`${config.title} font-medium ${
              variant === 'gradient' 
                ? 'opacity-90' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {title}
            </p>
            {badge && (
              <Badge variant={badgeVariant} size="sm">
                {badge}
              </Badge>
            )}
          </div>

          {/* Value */}
          <p className={`${config.value} font-bold ${
            variant === 'gradient' 
              ? 'text-white' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className={`text-xs mt-1 ${
              variant === 'gradient' 
                ? 'opacity-75' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {getTrendDisplay()}

          {/* Description */}
          {description && (
            <p className={`text-xs mt-2 ${
              variant === 'gradient' 
                ? 'opacity-75' 
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {description}
            </p>
          )}

          {/* Action Button */}
          {actionLabel && onAction && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
              className={`mt-3 text-sm font-medium ${
                variant === 'gradient'
                  ? 'text-white underline hover:no-underline'
                  : 'text-primary-600 dark:text-primary-400 hover:underline'
              }`}
            >
              {actionLabel} →
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

// PropTypes
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  
  icon: PropTypes.elementType,
  iconColor: PropTypes.oneOf([
    'blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'yellow'
  ]),
  
  trend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  trendLabel: PropTypes.string,
  showTrend: PropTypes.bool,
  
  variant: PropTypes.oneOf(['gradient', 'solid', 'outline', 'minimal']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  
  layout: PropTypes.oneOf(['horizontal', 'vertical']),
  
  onClick: PropTypes.func,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
  
  badge: PropTypes.string,
  badgeVariant: PropTypes.string,
  
  className: PropTypes.string,
};

export default StatCard;