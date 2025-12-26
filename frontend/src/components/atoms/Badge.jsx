// src/components/atoms/Badge.jsx

import PropTypes from 'prop-types';

/**
 * Badge Component - Atomic Design
 * Reusable badge/tag component with various styles
 */
const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  outlined = false,
  dot = false,
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  className = '',
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center gap-1.5 font-medium transition-all duration-200';
  
  // Variant styles - Solid
  const solidVariants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200',
    success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200',
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-200',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900 dark:text-danger-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    dark: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800',
  };

  // Variant styles - Outlined
  const outlinedVariants = {
    primary: 'border-2 border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400',
    secondary: 'border-2 border-secondary-600 text-secondary-600 dark:border-secondary-400 dark:text-secondary-400',
    success: 'border-2 border-success-600 text-success-600 dark:border-success-400 dark:text-success-400',
    warning: 'border-2 border-warning-600 text-warning-600 dark:border-warning-400 dark:text-warning-400',
    danger: 'border-2 border-danger-600 text-danger-600 dark:border-danger-400 dark:text-danger-400',
    info: 'border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400',
    gray: 'border-2 border-gray-600 text-gray-600 dark:border-gray-400 dark:text-gray-400',
    dark: 'border-2 border-gray-800 text-gray-800 dark:border-gray-200 dark:text-gray-200',
  };

  // Size styles
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
    xl: 'px-5 py-2 text-lg',
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Dot colors
  const dotColors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    danger: 'bg-danger-600',
    info: 'bg-blue-600',
    gray: 'bg-gray-600',
    dark: 'bg-gray-800',
  };

  // Select variant style based on outlined prop
  const variantStyle = outlined ? outlinedVariants[variant] : solidVariants[variant];

  return (
    <span
      className={`
        ${baseStyles}
        ${variantStyle}
        ${sizes[size]}
        ${roundedStyles[rounded]}
        ${outlined ? 'bg-transparent' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {/* Status Dot */}
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}

      {/* Left Icon */}
      {icon && iconPosition === 'left' && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}

      {/* Content */}
      {children}

      {/* Right Icon */}
      {icon && iconPosition === 'right' && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}

      {/* Remove Button */}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// PropTypes
Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 
    'secondary', 
    'success', 
    'warning', 
    'danger', 
    'info', 
    'gray', 
    'dark'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  outlined: PropTypes.bool,
  dot: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  className: PropTypes.string,
};

export default Badge;