// src/components/molecules/MatrixInput.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Grid3x3, RotateCw, Check, X } from 'lucide-react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

/**
 * MatrixInput Component - Molecule
 * Specialized input for matrix values (Hill Cipher key matrix)
 */
const MatrixInput = ({ 
  label = 'Key Matrix',
  size = 2, // Matrix size (2x2, 3x3, etc.)
  value = [[0, 0], [0, 0]],
  onChange,
  
  // Validation
  min = 0,
  max = 25,
  validateMatrix,
  
  // Visual
  disabled = false,
  error,
  
  // Features
  showReset = true,
  showRandomize = true,
  showValidation = true,
  
  // Callbacks
  onValidate,
  
  className = '',
  ...props 
}) => {
  const [validationResult, setValidationResult] = useState(null);
  const [focusedCell, setFocusedCell] = useState(null);

  // Handle cell change
  const handleCellChange = (row, col, newValue) => {
    const numValue = parseInt(newValue) || 0;
    
    // Clamp value
    const clampedValue = Math.max(min, Math.min(max, numValue));
    
    // Create new matrix
    const newMatrix = value.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? clampedValue : c))
    );
    
    // Clear validation when matrix changes
    setValidationResult(null);
    
    // Call onChange
    if (onChange) {
      onChange(newMatrix);
    }
  };

  // Handle reset
  const handleReset = () => {
    const resetMatrix = Array(size).fill(null).map(() => 
      Array(size).fill(0)
    );
    onChange(resetMatrix);
    setValidationResult(null);
  };

  // Handle randomize
  const handleRandomize = () => {
    const randomMatrix = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => 
        Math.floor(Math.random() * (max - min + 1)) + min
      )
    );
    onChange(randomMatrix);
    setValidationResult(null);
  };

  // Handle validation
  const handleValidate = () => {
    if (validateMatrix) {
      const result = validateMatrix(value);
      setValidationResult(result);
      
      if (onValidate) {
        onValidate(result);
      }
    }
  };

  // Get cell class
  const getCellClass = (row, col) => {
    const isFocused = focusedCell?.row === row && focusedCell?.col === col;
    return `w-16 h-16 text-center font-bold text-lg transition-all ${
      isFocused 
        ? 'ring-2 ring-primary-500 scale-105' 
        : ''
    }`;
  };

  return (
    <div className={className}>
      {/* Label */}
      <Label
        disabled={disabled}
        error={!!error || (validationResult && !validationResult.valid)}
        icon={<Grid3x3 size={16} />}
        tooltip="Enter matrix values for Hill Cipher"
      >
        {label}
      </Label>

      {/* Matrix Grid */}
      <div className="inline-block p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div 
          className="inline-grid gap-2" 
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {value.map((row, i) =>
            row.map((cell, j) => (
              <Input
                key={`${i}-${j}`}
                type="number"
                value={cell}
                onChange={(e) => handleCellChange(i, j, e.target.value)}
                onFocus={() => setFocusedCell({ row: i, col: j })}
                onBlur={() => setFocusedCell(null)}
                disabled={disabled}
                min={min}
                max={max}
                className={getCellClass(i, j)}
                aria-label={`Matrix cell row ${i + 1} column ${j + 1}`}
              />
            ))
          )}
        </div>

        {/* Matrix Bracket Decoration */}
        <div className="relative mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
          <span className="font-mono">[{size}×{size} Matrix]</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {showReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={disabled}
            icon={<RotateCw size={14} />}
          >
            Reset
          </Button>
        )}

        {showRandomize && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRandomize}
            disabled={disabled}
            icon={<RotateCw size={14} />}
          >
            Randomize
          </Button>
        )}

        {showValidation && validateMatrix && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleValidate}
            disabled={disabled}
          >
            Validate
          </Button>
        )}
      </div>

      {/* Validation Result */}
      {validationResult && (
        <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
          validationResult.valid
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div className="flex-shrink-0 mt-0.5">
            {validationResult.valid ? (
              <Check size={18} className="text-green-600 dark:text-green-400" />
            ) : (
              <X size={18} className="text-red-600 dark:text-red-400" />
            )}
          </div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              validationResult.valid
                ? 'text-green-700 dark:text-green-300'
                : 'text-red-700 dark:text-red-300'
            }`}>
              {validationResult.message}
            </p>
            {validationResult.details && (
              <div className="mt-2 space-y-1">
                {Object.entries(validationResult.details).map(([key, val]) => (
                  <div key={key} className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{key}:</span> {val}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Enter values between {min} and {max} for each cell
      </p>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {typeof error === 'string' ? error : 'Invalid matrix'}
        </p>
      )}
    </div>
  );
};

// PropTypes
MatrixInput.propTypes = {
  label: PropTypes.string,
  size: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onChange: PropTypes.func.isRequired,
  
  min: PropTypes.number,
  max: PropTypes.number,
  validateMatrix: PropTypes.func,
  
  disabled: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  
  showReset: PropTypes.bool,
  showRandomize: PropTypes.bool,
  showValidation: PropTypes.bool,
  
  onValidate: PropTypes.func,
  
  className: PropTypes.string,
};

export default MatrixInput;