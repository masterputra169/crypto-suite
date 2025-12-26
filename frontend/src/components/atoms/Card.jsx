// src/components/atoms/Card.jsx

import PropTypes from 'prop-types';

/**
 * Card Component - Atomic Design
 * Reusable card container with various styles and effects
 */
const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  bordered = false,
  shadow = 'lg',
  rounded = 'xl',
  padding = '6',
  onClick,
  className = '',
  header,
  footer,
  ...props 
}) => {
  // Base styles
  const baseStyles = 'transition-all duration-200';
  
  // Variant styles
  const variants = {
    default: 'bg-white dark:bg-gray-800',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg',
    outline: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-xl',
  };

  // Hover effects
  const hoverEffects = hover 
    ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer' 
    : '';

  // Border styles
  const borderStyles = bordered 
    ? 'border border-gray-200 dark:border-gray-700' 
    : '';

  // Shadow styles
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  };

  // Padding styles
  const paddings = {
    '0': 'p-0',
    '2': 'p-2',
    '4': 'p-4',
    '6': 'p-6',
    '8': 'p-8',
    '10': 'p-10',
  };

  // Click handler
  const clickable = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${hoverEffects}
        ${borderStyles}
        ${shadows[shadow]}
        ${roundedStyles[rounded]}
        ${paddings[padding]}
        ${clickable}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Header */}
      {header && (
        <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {header}
        </div>
      )}

      {/* Content */}
      <div className={header || footer ? '' : ''}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
};

// PropTypes
Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'gradient', 'glass', 'outline', 'elevated']),
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full']),
  padding: PropTypes.oneOf(['0', '2', '4', '6', '8', '10']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  header: PropTypes.node,
  footer: PropTypes.node,
};

export default Card;