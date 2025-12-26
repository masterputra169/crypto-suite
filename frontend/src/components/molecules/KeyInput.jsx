// src/components/molecules/KeyInput.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Key, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

/**
 * KeyInput Component - Molecule
 * Specialized input for cryptographic keys with visibility toggle and generation
 */
const KeyInput = ({ 
  label = 'Encryption Key',
  value,
  onChange,
  placeholder = 'Enter key...',
  helperText = 'Only A-Z letters will be used',
  required = false,
  disabled = false,
  error,
  
  // Key specific features
  showVisibilityToggle = true,
  showGenerator = false,
  onGenerate,
  generatorTooltip = 'Generate random key',
  
  // Validation
  minLength,
  maxLength,
  pattern,
  validateKey,
  
  // Visual
  size = 'md',
  fullWidth = true,
  
  // Advanced
  autoFormat = true, // Auto uppercase
  allowedChars = /[A-Za-z]/g,
  
  className = '',
  ...props 
}) => {
  const [showKey, setShowKey] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Handle change with formatting
  const handleChange = (e) => {
    let newValue = e.target.value;

    // Auto format (uppercase)
    if (autoFormat) {
      newValue = newValue.toUpperCase();
    }

    // Filter allowed characters
    if (allowedChars) {
      newValue = newValue.match(allowedChars)?.join('') || '';
    }

    // Custom validation
    if (validateKey) {
      const validationResult = validateKey(newValue);
      if (validationResult !== true) {
        setValidationError(validationResult || 'Invalid key');
      } else {
        setValidationError('');
      }
    }

    // Call parent onChange
    if (onChange) {
      onChange({ ...e, target: { ...e.target, value: newValue } });
    }
  };

  // Handle generate
  const handleGenerate = () => {
    if (onGenerate) {
      const generated = onGenerate();
      if (onChange) {
        onChange({ target: { value: generated } });
      }
    }
  };

  // Determine error state
  const hasError = !!error || !!validationError;
  const errorMessage = validationError || (typeof error === 'string' ? error : '');

  return (
    <div className={className}>
      {/* Label */}
      <Label
        required={required}
        disabled={disabled}
        error={hasError}
        size={size}
        icon={<Key size={16} />}
      >
        {label}
      </Label>

      {/* Input with Actions */}
      <div className="relative">
        <Input
          type={showKey ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          size={size}
          error={hasError}
          fullWidth={fullWidth}
          className={showGenerator || showVisibilityToggle ? 'pr-20' : ''}
          {...props}
        />

        {/* Action Buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Visibility Toggle */}
          {showVisibilityToggle && (
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
              aria-label={showKey ? 'Hide key' : 'Show key'}
              tabIndex={-1}
            >
              {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {/* Generator Button */}
          {showGenerator && onGenerate && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={disabled}
              className="p-1.5 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={generatorTooltip}
              title={generatorTooltip}
              tabIndex={-1}
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Helper/Error Text */}
      {(helperText || errorMessage) && (
        <p className={`mt-1.5 text-sm ${
          hasError 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-gray-500 dark:text-gray-400'
        }`}>
          {errorMessage || helperText}
        </p>
      )}

      {/* Key Strength Indicator */}
      {value && !hasError && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  value.length < 5 
                    ? 'bg-red-500 w-1/4'
                    : value.length < 10
                    ? 'bg-yellow-500 w-2/4'
                    : value.length < 15
                    ? 'bg-blue-500 w-3/4'
                    : 'bg-green-500 w-full'
                }`}
              />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {value.length} chars
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// PropTypes
KeyInput.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  
  showVisibilityToggle: PropTypes.bool,
  showGenerator: PropTypes.bool,
  onGenerate: PropTypes.func,
  generatorTooltip: PropTypes.string,
  
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  validateKey: PropTypes.func,
  
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  
  autoFormat: PropTypes.bool,
  allowedChars: PropTypes.instanceOf(RegExp),
  
  className: PropTypes.string,
};

export default KeyInput;