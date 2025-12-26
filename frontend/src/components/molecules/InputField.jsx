// src/components/molecules/InputField.jsx

import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

/**
 * InputField Component - Molecule
 * Combines Label and Input atoms into a complete form field
 * Includes error handling, helper text, and validation states
 */
const InputField = forwardRef(({ 
  // Label props
  label,
  labelIcon,
  labelTooltip,
  required = false,
  optional = false,
  
  // Input props
  id,
  name,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  readOnly = false,
  autoFocus = false,
  autoComplete = 'off',
  
  // Validation props
  min,
  max,
  step,
  pattern,
  maxLength,
  minLength,
  
  // Visual props
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = true,
  
  // State props
  error,
  success = false,
  
  // Helper text
  helperText,
  errorText,
  successText,
  
  // Layout
  direction = 'vertical', // vertical or horizontal
  labelWidth,
  
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  // Determine error state
  const hasError = !!error || !!errorText;
  const hasSuccess = success && !hasError;

  // Get display message
  const getMessage = () => {
    if (hasError && errorText) return errorText;
    if (hasError && typeof error === 'string') return error;
    if (hasSuccess && successText) return successText;
    if (helperText) return helperText;
    return null;
  };

  const message = getMessage();

  // Message color
  const getMessageColor = () => {
    if (hasError) return 'text-red-600 dark:text-red-400';
    if (hasSuccess) return 'text-green-600 dark:text-green-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  // Layout classes
  const isHorizontal = direction === 'horizontal';
  const containerClasses = isHorizontal 
    ? 'flex items-start gap-4' 
    : 'space-y-0';

  const labelContainerClasses = isHorizontal && labelWidth
    ? `flex-shrink-0 pt-2 ${labelWidth}`
    : '';

  return (
    <div className={`${containerClasses} ${containerClassName}`}>
      {/* Label */}
      {label && (
        <div className={labelContainerClasses}>
          <Label
            htmlFor={id}
            required={required}
            optional={optional}
            disabled={disabled}
            error={hasError}
            size={size}
            icon={labelIcon}
            tooltip={labelTooltip}
          >
            {label}
          </Label>
        </div>
      )}

      {/* Input Container */}
      <div className={isHorizontal ? 'flex-1' : ''}>
        <Input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
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
          size={size}
          error={hasError}
          success={hasSuccess}
          fullWidth={fullWidth}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          className={className}
          ariaDescribedBy={message ? `${id}-message` : undefined}
          {...props}
        />

        {/* Helper/Error/Success Message */}
        {message && (
          <p 
            id={`${id}-message`}
            className={`mt-1.5 text-sm ${getMessageColor()}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
});

InputField.displayName = 'InputField';

// PropTypes
InputField.propTypes = {
  // Label props
  label: PropTypes.string,
  labelIcon: PropTypes.node,
  labelTooltip: PropTypes.string,
  required: PropTypes.bool,
  optional: PropTypes.bool,
  
  // Input props
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  autoComplete: PropTypes.string,
  
  // Validation props
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  pattern: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  
  // Visual props
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  fullWidth: PropTypes.bool,
  
  // State props
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  success: PropTypes.bool,
  
  // Helper text
  helperText: PropTypes.string,
  errorText: PropTypes.string,
  successText: PropTypes.string,
  
  // Layout
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  labelWidth: PropTypes.string,
  
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default InputField;