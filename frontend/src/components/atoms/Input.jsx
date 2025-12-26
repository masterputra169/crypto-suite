// src/components/atoms/Input.jsx

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * Input Component - Atomic Design
 * Reusable input field with various types and states
 */
const Input = forwardRef(({ 
  type = 'text',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  name,
  id,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  autoComplete = 'off',
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
  size = 'md',
  error = false,
  success = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}, ref) => {
  // Base styles
  const baseStyles = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 font-medium';
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  // State styles
  const getStateStyles = () => {
    if (error) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50 dark:bg-red-900/10';
    }
    if (success) {
      return 'border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50 dark:bg-green-900/10';
    }
    return 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500';
  };

  // Background styles
  const bgStyles = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100';
  
  // Disabled/readonly styles
  const interactionStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : readOnly 
    ? 'cursor-default bg-gray-50 dark:bg-gray-900' 
    : '';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Icon padding
  const iconPadding = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Left Icon */}
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {leftIcon}
        </div>
      )}

      {/* Input Field */}
      <input
        ref={ref}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        name={name}
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        maxLength={maxLength}
        minLength={minLength}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error}
        className={`
          ${baseStyles} 
          ${sizes[size]} 
          ${getStateStyles()} 
          ${bgStyles} 
          ${interactionStyles}
          ${widthStyles}
          ${iconPadding}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />

      {/* Right Icon */}
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {rightIcon}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// PropTypes
Input.propTypes = {
  type: PropTypes.oneOf([
    'text', 'password', 'email', 'number', 'tel', 'url', 
    'search', 'date', 'time', 'datetime-local', 'month', 'week'
  ]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  fullWidth: PropTypes.bool,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};

export default Input;