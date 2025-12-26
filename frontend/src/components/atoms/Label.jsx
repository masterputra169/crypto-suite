// src/components/atoms/Label.jsx

import PropTypes from 'prop-types';

/**
 * Label Component - Atomic Design
 * Reusable label for form inputs with optional required indicator and helper text
 */
const Label = ({ 
  children, 
  htmlFor,
  required = false,
  optional = false,
  disabled = false,
  error = false,
  size = 'md',
  icon,
  tooltip,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'block font-medium transition-colors duration-200';
  
  // Size styles
  const sizes = {
    sm: 'text-xs mb-1',
    md: 'text-sm mb-2',
    lg: 'text-base mb-2.5',
  };

  // Color styles
  const getColorStyles = () => {
    if (error) {
      return 'text-red-700 dark:text-red-400';
    }
    if (disabled) {
      return 'text-gray-400 dark:text-gray-600';
    }
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="flex items-start justify-between gap-2">
      <label
        htmlFor={htmlFor}
        className={`
          ${baseStyles} 
          ${sizes[size]} 
          ${getColorStyles()}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      >
        <span className="flex items-center gap-2">
          {/* Icon */}
          {icon && (
            <span className="flex-shrink-0 text-current">
              {icon}
            </span>
          )}
          
          {/* Label Text */}
          {children}
          
          {/* Required Indicator */}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-0.5" aria-label="required">
              *
            </span>
          )}
          
          {/* Optional Indicator */}
          {optional && !required && (
            <span className="text-gray-400 dark:text-gray-500 text-xs font-normal ml-1">
              (Optional)
            </span>
          )}
        </span>
      </label>

      {/* Tooltip */}
      {tooltip && (
        <div className="group relative">
          <button
            type="button"
            className="flex items-center justify-center w-4 h-4 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Help"
          >
            ?
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10 w-64">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
              {tooltip}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes
Label.propTypes = {
  children: PropTypes.node.isRequired,
  htmlFor: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  tooltip: PropTypes.string,
  className: PropTypes.string,
};

export default Label;