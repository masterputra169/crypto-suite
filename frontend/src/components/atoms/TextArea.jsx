// src/components/atoms/TextArea.jsx

import PropTypes from 'prop-types';
import { forwardRef } from 'react';

/**
 * TextArea Component - Atomic Design
 * Reusable textarea with auto-resize and character count
 */
const TextArea = forwardRef(({ 
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  name,
  id,
  rows = 4,
  cols,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  maxLength,
  minLength,
  resize = 'vertical',
  error = false,
  success = false,
  fullWidth = true,
  showCharCount = false,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}, ref) => {
  // Base styles
  const baseStyles = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 font-medium';
  
  // Padding
  const paddingStyles = 'px-4 py-3';

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

  // Resize styles
  const resizeStyles = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  // Character count
  const currentLength = value?.length || defaultValue?.length || 0;

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <textarea
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        name={name}
        id={id}
        rows={rows}
        cols={cols}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        autoFocus={autoFocus}
        maxLength={maxLength}
        minLength={minLength}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={error}
        className={`
          ${baseStyles} 
          ${paddingStyles}
          ${getStateStyles()} 
          ${bgStyles} 
          ${interactionStyles}
          ${widthStyles}
          ${resizeStyles[resize]}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
        {...props}
      />

      {/* Character Count */}
      {showCharCount && maxLength && (
        <div className={`absolute bottom-2 right-2 text-xs ${
          currentLength > maxLength * 0.9 
            ? 'text-red-600 dark:text-red-400 font-bold' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {currentLength} / {maxLength}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

// PropTypes
TextArea.propTypes = {
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  rows: PropTypes.number,
  cols: PropTypes.number,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  resize: PropTypes.oneOf(['none', 'vertical', 'horizontal', 'both']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  fullWidth: PropTypes.bool,
  showCharCount: PropTypes.bool,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};

export default TextArea;