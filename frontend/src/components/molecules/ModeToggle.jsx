// src/components/molecules/ModeToggle.jsx

import PropTypes from 'prop-types';
import { Lock, Unlock, ShieldCheck, ShieldOff } from 'lucide-react';
import Label from '../atoms/Label';

/**
 * ModeToggle Component - Molecule
 * Toggle between Encrypt and Decrypt modes with visual feedback
 */
const ModeToggle = ({ 
  mode = 'encrypt',
  onChange,
  label = 'Mode',
  disabled = false,
  
  // Customization
  encryptLabel = 'Encrypt',
  decryptLabel = 'Decrypt',
  encryptIcon = <Lock size={18} />,
  decryptIcon = <Unlock size={18} />,
  
  // Visual variants
  variant = 'default', // default, compact, pills, segmented
  size = 'md',
  fullWidth = false,
  
  // Advanced
  showIcons = true,
  showLabel = true,
  animated = true,
  
  className = '',
  ...props 
}) => {
  // Size classes
  const sizes = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-6 text-lg',
  };

  // Variant styles
  const variants = {
    default: {
      container: 'flex gap-3',
      button: 'flex-1 rounded-lg font-medium transition-all duration-200',
      active: 'bg-primary-600 text-white shadow-lg scale-105',
      inactive: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600',
    },
    compact: {
      container: 'inline-flex gap-2',
      button: 'rounded-md font-medium transition-all duration-200',
      active: 'bg-primary-600 text-white shadow-md',
      inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
    },
    pills: {
      container: 'inline-flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-full',
      button: 'rounded-full font-medium transition-all duration-200',
      active: 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md',
      inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    },
    segmented: {
      container: 'inline-flex border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden',
      button: 'font-medium transition-all duration-200 border-r-2 border-gray-300 dark:border-gray-600 last:border-r-0',
      active: 'bg-primary-600 text-white',
      inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    },
  };

  const selectedVariant = variants[variant];

  // Handle mode change
  const handleModeChange = (newMode) => {
    if (!disabled && onChange) {
      onChange(newMode);
    }
  };

  // Animation class
  const animationClass = animated ? 'transform active:scale-95' : '';

  return (
    <div className={className}>
      {/* Label */}
      {showLabel && label && (
        <Label disabled={disabled} className="mb-2">
          {label}
        </Label>
      )}

      {/* Toggle Buttons */}
      <div 
        className={`${selectedVariant.container} ${fullWidth ? 'w-full' : ''}`}
        {...props}
      >
        {/* Encrypt Button */}
        <button
          type="button"
          onClick={() => handleModeChange('encrypt')}
          disabled={disabled}
          className={`
            ${selectedVariant.button}
            ${sizes[size]}
            ${mode === 'encrypt' ? selectedVariant.active : selectedVariant.inactive}
            ${animationClass}
            ${fullWidth ? 'flex-1' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center gap-2
          `.trim().replace(/\s+/g, ' ')}
          aria-pressed={mode === 'encrypt'}
          aria-label="Encrypt mode"
        >
          {showIcons && encryptIcon}
          {encryptLabel}
        </button>

        {/* Decrypt Button */}
        <button
          type="button"
          onClick={() => handleModeChange('decrypt')}
          disabled={disabled}
          className={`
            ${selectedVariant.button}
            ${sizes[size]}
            ${mode === 'decrypt' ? selectedVariant.active : selectedVariant.inactive}
            ${animationClass}
            ${fullWidth ? 'flex-1' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center gap-2
          `.trim().replace(/\s+/g, ' ')}
          aria-pressed={mode === 'decrypt'}
          aria-label="Decrypt mode"
        >
          {showIcons && decryptIcon}
          {decryptLabel}
        </button>
      </div>

      {/* Mode Indicator */}
      {animated && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <div className={`w-2 h-2 rounded-full ${
            mode === 'encrypt' 
              ? 'bg-green-500 animate-pulse' 
              : 'bg-blue-500 animate-pulse'
          }`} />
          <span>
            {mode === 'encrypt' ? 'Encrypting' : 'Decrypting'} mode active
          </span>
        </div>
      )}
    </div>
  );
};

// PropTypes
ModeToggle.propTypes = {
  mode: PropTypes.oneOf(['encrypt', 'decrypt']).isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  
  encryptLabel: PropTypes.string,
  decryptLabel: PropTypes.string,
  encryptIcon: PropTypes.node,
  decryptIcon: PropTypes.node,
  
  variant: PropTypes.oneOf(['default', 'compact', 'pills', 'segmented']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  
  showIcons: PropTypes.bool,
  showLabel: PropTypes.bool,
  animated: PropTypes.bool,
  
  className: PropTypes.string,
};

export default ModeToggle;