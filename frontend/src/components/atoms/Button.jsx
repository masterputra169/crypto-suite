// src/components/atoms/Button.jsx

import PropTypes from 'prop-types';

/**
 * Button Component - Atomic Design
 * Reusable button with multiple variants, sizes, and states
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...props 
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:scale-95 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 active:scale-95 shadow-sm hover:shadow-md',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:scale-95 shadow-sm hover:shadow-md',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:scale-95 shadow-sm hover:shadow-md',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 active:scale-95 shadow-sm hover:shadow-md',
    outline: 'border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 focus:ring-primary-500 active:scale-95',
    outlineSecondary: 'border-2 border-secondary-600 text-secondary-600 bg-transparent hover:bg-secondary-50 dark:hover:bg-secondary-900/20 focus:ring-secondary-500 active:scale-95',
    ghost: 'text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500 active:scale-95',
    link: 'text-primary-600 dark:text-primary-400 bg-transparent hover:underline focus:ring-primary-500 p-0',
  };

  // Size styles
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Loading spinner
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Render icon
  const renderIcon = () => {
    if (loading) return <LoadingSpinner />;
    if (!icon) return null;
    
    return (
      <span className="flex-shrink-0">
        {icon}
      </span>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${widthStyles}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

// PropTypes for type checking
Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'primary', 
    'secondary', 
    'success', 
    'danger', 
    'warning', 
    'outline', 
    'outlineSecondary',
    'ghost', 
    'link'
  ]),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
};

export default Button;