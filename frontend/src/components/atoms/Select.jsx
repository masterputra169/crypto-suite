// src/components/atoms/Select.jsx

import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select Component - Atomic Design
 * Reusable select dropdown with options and groups
 */
const Select = forwardRef(({ 
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  options = [],
  groups = [],
  placeholder = 'Select an option...',
  name,
  id,
  disabled = false,
  required = false,
  multiple = false,
  size = 'md',
  error = false,
  success = false,
  fullWidth = false,
  icon,
  className = '',
  ariaLabel,
  ariaDescribedBy,
  ...props 
}, ref) => {
  // Base styles
  const baseStyles = 'border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 font-medium appearance-none bg-no-repeat';
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm pr-8',
    md: 'px-4 py-2 text-base pr-10',
    lg: 'px-5 py-3 text-lg pr-12',
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
  
  // Disabled styles
  const interactionStyles = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer';

  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';

  // Icon padding
  const iconPadding = icon ? 'pl-10' : '';

  // Render options
  const renderOptions = () => {
    // If using option groups
    if (groups.length > 0) {
      return groups.map((group, groupIndex) => (
        <optgroup key={groupIndex} label={group.label}>
          {group.options.map((option, optionIndex) => (
            <option 
              key={optionIndex} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </optgroup>
      ));
    }

    // Regular options
    return options.map((option, index) => (
      <option 
        key={index} 
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </option>
    ));
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      {/* Left Icon */}
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
          {icon}
        </div>
      )}

      {/* Select Field */}
      <select
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        name={name}
        id={id}
        disabled={disabled}
        required={required}
        multiple={multiple}
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
      >
        {/* Placeholder */}
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {/* Options */}
        {renderOptions()}
      </select>

      {/* Chevron Icon */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <ChevronDown size={20} />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

// PropTypes
Select.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number,
    PropTypes.array
  ]),
  defaultValue: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number,
    PropTypes.array
  ]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
  })),
  groups: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })),
  })),
  placeholder: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  multiple: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  ariaDescribedBy: PropTypes.string,
};

export default Select;