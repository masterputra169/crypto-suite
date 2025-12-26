// src/components/organisms/CipherPanel.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';
import { TrendingUp, RotateCcw, Download, Share2 } from 'lucide-react';
import { Card } from '../atoms';
import { 
  InputField, 
  KeyInput, 
  MatrixInput, 
  ModeToggle, 
  ResultDisplay 
} from '../molecules';
import { Button } from '../atoms';

/**
 * CipherPanel Component - Organism
 * Complete cipher interface with input, key, mode selection, and results
 * Can be customized for different cipher algorithms
 */
const CipherPanel = ({
  // Algorithm info
  algorithmName = 'Cipher',
  algorithmType = 'text', // text, matrix, number
  
  // Callbacks
  onProcess,
  onReset,
  
  // State
  inputValue = '',
  onInputChange,
  keyValue = '',
  onKeyChange,
  matrixValue,
  onMatrixChange,
  mode = 'encrypt',
  onModeChange,
  result = '',
  
  // Validation
  validateKey,
  validateMatrix,
  
  // Features
  showKeyGenerator = false,
  onGenerateKey,
  showMatrixInput = false,
  showNumberInput = false,
  numberMin = 0,
  numberMax = 25,
  
  // UI customization
  inputLabel = 'Input Text',
  inputPlaceholder = 'Enter text here...',
  keyLabel = 'Encryption Key',
  keyPlaceholder = 'Enter key...',
  resultLabel = 'Result',
  
  // Loading & Error states
  isProcessing = false,
  error = null,
  
  // Additional features
  showStats = true,
  showActions = true,
  
  className = '',
  ...props
}) => {
  const [localError, setLocalError] = useState('');

  // Handle process with validation
  const handleProcess = async () => {
    setLocalError('');

    // Validate based on algorithm type
    if (algorithmType === 'text' && !keyValue.trim()) {
      setLocalError('Please enter a key');
      return;
    }

    if (!inputValue.trim()) {
      setLocalError('Please enter text to process');
      return;
    }

    try {
      if (onProcess) {
        await onProcess();
      }
    } catch (err) {
      setLocalError(err.message || 'Processing failed');
    }
  };

  // Handle reset
  const handleReset = () => {
    setLocalError('');
    if (onReset) {
      onReset();
    }
  };

  // Export result
  const handleExport = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${algorithmName.toLowerCase()}-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {algorithmName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'} Panel
          </p>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              icon={<RotateCcw size={16} />}
            >
              Reset
            </Button>
            {result && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  icon={<Download size={16} />}
                >
                  Export
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Input
          </h3>

          <div className="space-y-4">
            {/* Mode Toggle */}
            <ModeToggle
              mode={mode}
              onChange={onModeChange}
              fullWidth
            />

            {/* Text Input */}
            <InputField
              label={inputLabel}
              value={inputValue}
              onChange={onInputChange}
              placeholder={inputPlaceholder}
              helperText={`${inputValue.length} characters`}
              required
              fullWidth
            />

            {/* Key Input (for text-based ciphers) */}
            {algorithmType === 'text' && (
              <KeyInput
                label={keyLabel}
                value={keyValue}
                onChange={onKeyChange}
                placeholder={keyPlaceholder}
                showVisibilityToggle
                showGenerator={showKeyGenerator}
                onGenerate={onGenerateKey}
                validateKey={validateKey}
              />
            )}

            {/* Number Input (for Caesar-like ciphers) */}
            {showNumberInput && (
              <InputField
                label="Shift Value"
                type="number"
                value={keyValue}
                onChange={onKeyChange}
                min={numberMin}
                max={numberMax}
                helperText={`Value between ${numberMin} and ${numberMax}`}
              />
            )}

            {/* Matrix Input (for Hill cipher) */}
            {showMatrixInput && matrixValue && (
              <MatrixInput
                label="Key Matrix"
                value={matrixValue}
                onChange={onMatrixChange}
                validateMatrix={validateMatrix}
                showReset
                showRandomize
                showValidation
              />
            )}

            {/* Error Display */}
            {(error || localError) && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || localError}
                </p>
              </div>
            )}

            {/* Process Button */}
            <Button
              variant="primary"
              fullWidth
              onClick={handleProcess}
              disabled={isProcessing}
              loading={isProcessing}
              icon={<TrendingUp size={18} />}
            >
              {isProcessing ? 'Processing...' : `${mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}`}
            </Button>
          </div>
        </Card>

        {/* Output Panel */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Output
          </h3>

          <ResultDisplay
            result={result}
            label={resultLabel}
            mode={mode}
            showCopy
            showDownload
            showStats={showStats}
            variant="gradient"
          />
        </Card>
      </div>

      {/* Quick Stats */}
      {showStats && result && (
        <Card className="p-4 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Input Length</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {inputValue.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Output Length</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {result.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Key Length</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {keyValue?.toString().length || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {result ? 'Complete' : 'Waiting'}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

// PropTypes
CipherPanel.propTypes = {
  algorithmName: PropTypes.string,
  algorithmType: PropTypes.oneOf(['text', 'matrix', 'number']),
  
  onProcess: PropTypes.func,
  onReset: PropTypes.func,
  
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  keyValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onKeyChange: PropTypes.func,
  matrixValue: PropTypes.arrayOf(PropTypes.array),
  onMatrixChange: PropTypes.func,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
  onModeChange: PropTypes.func,
  result: PropTypes.string,
  
  validateKey: PropTypes.func,
  validateMatrix: PropTypes.func,
  
  showKeyGenerator: PropTypes.bool,
  onGenerateKey: PropTypes.func,
  showMatrixInput: PropTypes.bool,
  showNumberInput: PropTypes.bool,
  numberMin: PropTypes.number,
  numberMax: PropTypes.number,
  
  inputLabel: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  keyLabel: PropTypes.string,
  keyPlaceholder: PropTypes.string,
  resultLabel: PropTypes.string,
  
  isProcessing: PropTypes.bool,
  error: PropTypes.string,
  
  showStats: PropTypes.bool,
  showActions: PropTypes.bool,
  
  className: PropTypes.string,
};

export default CipherPanel;