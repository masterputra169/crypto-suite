// src/components/organisms/AlphabetGrid.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Grid3x3, Eye, EyeOff, RefreshCw, Download } from 'lucide-react';

/**
 * AlphabetGrid Component - Organism
 * Interactive grid showing alphabet mappings for cipher visualization
 */
const AlphabetGrid = ({ 
  mapping = null, // { original: [], encrypted: [] }
  title = 'Alphabet Mapping',
  mode = 'horizontal', // horizontal, vertical, matrix
  showFrequency = false,
  frequencyData = null,
  highlightMatches = true,
  
  // Interactive features
  interactive = true,
  onCellClick,
  
  // Visual customization
  gridSize = 'md', // sm, md, lg
  showIndices = false,
  showConnections = false,
  
  className = '',
  ...props
}) => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [showPlaintext, setShowPlaintext] = useState(true);
  const [showCiphertext, setShowCiphertext] = useState(true);

  // Default alphabet if no mapping provided
  const defaultAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const originalAlphabet = mapping?.original || defaultAlphabet;
  const encryptedAlphabet = mapping?.encrypted || defaultAlphabet;

  // Cell sizes
  const cellSizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const cellSize = cellSizes[gridSize];

  // Handle cell click
  const handleCellClick = (char, index, type) => {
    if (!interactive) return;

    setSelectedChar({ char, index, type });
    if (onCellClick) {
      onCellClick(char, index, type);
    }
  };

  // Get frequency for character
  const getFrequency = (char) => {
    if (!showFrequency || !frequencyData) return null;
    const data = frequencyData.find(item => item.char === char);
    return data ? parseFloat(data.percentage) : 0;
  };

  // Get cell background color based on frequency
  const getFrequencyColor = (frequency) => {
    if (!frequency || frequency === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    if (frequency > 10) return 'bg-red-200 dark:bg-red-900/40';
    if (frequency > 7) return 'bg-orange-200 dark:bg-orange-900/40';
    if (frequency > 5) return 'bg-yellow-200 dark:bg-yellow-900/40';
    if (frequency > 3) return 'bg-green-200 dark:bg-green-900/40';
    return 'bg-blue-200 dark:bg-blue-900/40';
  };

  // Check if cell is selected
  const isSelected = (char, index, type) => {
    if (!selectedChar) return false;
    return selectedChar.char === char && selectedChar.type === type;
  };

  // Check if cell is matched (same position in both alphabets)
  const isMatched = (index) => {
    if (!highlightMatches) return false;
    return originalAlphabet[index] === encryptedAlphabet[index];
  };

  // Render alphabet row
  const renderAlphabetRow = (alphabet, type, label) => {
    if ((type === 'original' && !showPlaintext) || (type === 'encrypted' && !showCiphertext)) {
      return null;
    }

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </h3>
          <Badge 
            variant={type === 'original' ? 'primary' : 'success'}
            size="sm"
          >
            {alphabet.length} chars
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {alphabet.map((char, index) => {
            const frequency = getFrequency(char);
            const selected = isSelected(char, index, type);
            const matched = isMatched(index);

            return (
              <button
                key={index}
                onClick={() => handleCellClick(char, index, type)}
                disabled={!interactive}
                className={`
                  ${cellSize}
                  flex flex-col items-center justify-center
                  rounded-lg font-mono font-bold
                  transition-all duration-200
                  ${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                  ${selected 
                    ? 'ring-2 ring-primary-500 scale-110 z-10' 
                    : ''
                  }
                  ${matched && type === 'encrypted'
                    ? 'border-2 border-yellow-500 dark:border-yellow-400'
                    : 'border border-gray-300 dark:border-gray-600'
                  }
                  ${showFrequency && frequency
                    ? getFrequencyColor(frequency)
                    : type === 'original'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  }
                `}
                title={`${char}${showFrequency && frequency ? ` - ${frequency}%` : ''}`}
              >
                <span>{char}</span>
                {showIndices && (
                  <span className="text-xs opacity-60 mt-0.5">{index}</span>
                )}
                {showFrequency && frequency > 0 && (
                  <span className="text-xs opacity-75">{frequency.toFixed(1)}%</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render matrix view (5x5 or similar)
  const renderMatrixView = () => {
    const cols = 5;
    const rows = Math.ceil(originalAlphabet.length / cols);

    return (
      <div className="space-y-6">
        {/* Original Matrix */}
        {showPlaintext && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Original Alphabet
            </h3>
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {originalAlphabet.map((char, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(char, index, 'original')}
                  disabled={!interactive}
                  className={`
                    ${cellSize}
                    flex items-center justify-center
                    bg-blue-100 dark:bg-blue-900/30
                    text-blue-700 dark:text-blue-300
                    rounded-lg font-mono font-bold
                    border border-gray-300 dark:border-gray-600
                    transition-all duration-200
                    ${interactive ? 'cursor-pointer hover:scale-110' : ''}
                    ${isSelected(char, index, 'original') ? 'ring-2 ring-primary-500 scale-110' : ''}
                  `}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Encrypted Matrix */}
        {showCiphertext && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Encrypted Alphabet
            </h3>
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {encryptedAlphabet.map((char, index) => (
                <button
                  key={index}
                  onClick={() => handleCellClick(char, index, 'encrypted')}
                  disabled={!interactive}
                  className={`
                    ${cellSize}
                    flex items-center justify-center
                    bg-green-100 dark:bg-green-900/30
                    text-green-700 dark:text-green-300
                    rounded-lg font-mono font-bold
                    border border-gray-300 dark:border-gray-600
                    transition-all duration-200
                    ${interactive ? 'cursor-pointer hover:scale-110' : ''}
                    ${isSelected(char, index, 'encrypted') ? 'ring-2 ring-primary-500 scale-110' : ''}
                    ${isMatched(index) ? 'border-2 border-yellow-500' : ''}
                  `}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render connections view
  const renderConnectionsView = () => {
    return (
      <div className="space-y-2">
        {originalAlphabet.map((origChar, index) => {
          const encChar = encryptedAlphabet[index];
          const matched = origChar === encChar;

          return (
            <div
              key={index}
              className={`
                flex items-center gap-4 p-3 rounded-lg
                transition-all duration-200
                ${matched 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700' 
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }
                ${isSelected(origChar, index, 'original') || isSelected(encChar, index, 'encrypted')
                  ? 'ring-2 ring-primary-500'
                  : ''
                }
              `}
            >
              {/* Original Character */}
              <button
                onClick={() => handleCellClick(origChar, index, 'original')}
                disabled={!interactive}
                className={`
                  ${cellSize}
                  flex items-center justify-center
                  bg-blue-100 dark:bg-blue-900/30
                  text-blue-700 dark:text-blue-300
                  rounded-lg font-mono font-bold
                  border border-blue-300 dark:border-blue-700
                  ${interactive ? 'hover:scale-110' : ''}
                  transition-transform
                `}
              >
                {origChar}
              </button>

              {/* Arrow */}
              <div className="flex-1 flex items-center justify-center">
                <svg
                  className="w-12 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>

              {/* Encrypted Character */}
              <button
                onClick={() => handleCellClick(encChar, index, 'encrypted')}
                disabled={!interactive}
                className={`
                  ${cellSize}
                  flex items-center justify-center
                  bg-green-100 dark:bg-green-900/30
                  text-green-700 dark:text-green-300
                  rounded-lg font-mono font-bold
                  border border-green-300 dark:border-green-700
                  ${interactive ? 'hover:scale-110' : ''}
                  transition-transform
                `}
              >
                {encChar}
              </button>

              {/* Index */}
              {showIndices && (
                <span className="text-sm text-gray-500 dark:text-gray-400 w-8 text-right">
                  {index}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className={`${className}`} {...props}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Grid3x3 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mode === 'connections' ? 'Mapping View' : 'Grid View'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPlaintext(!showPlaintext)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={showPlaintext ? 'Hide plaintext' : 'Show plaintext'}
            >
              {showPlaintext ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            <button
              onClick={() => setSelectedChar(null)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Reset selection"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Selected Character Info */}
        {selectedChar && (
          <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <div className="flex items-center gap-3">
              <span className={`
                w-12 h-12 flex items-center justify-center
                rounded-lg font-mono font-bold text-2xl
                ${selectedChar.type === 'original'
                  ? 'bg-blue-500 text-white'
                  : 'bg-green-500 text-white'
                }
              `}>
                {selectedChar.char}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {selectedChar.type === 'original' ? 'Original' : 'Encrypted'} Character
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Position: {selectedChar.index} | 
                  Maps to: {selectedChar.type === 'original' 
                    ? encryptedAlphabet[selectedChar.index]
                    : originalAlphabet.indexOf(selectedChar.char)
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Grid Content */}
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
          {mode === 'horizontal' && (
            <>
              {renderAlphabetRow(originalAlphabet, 'original', 'Original Alphabet')}
              {renderAlphabetRow(encryptedAlphabet, 'encrypted', 'Encrypted Alphabet')}
            </>
          )}

          {mode === 'matrix' && renderMatrixView()}

          {mode === 'connections' && renderConnectionsView()}
        </div>

        {/* Legend */}
        {highlightMatches && (
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-500 rounded" />
              <span>Unchanged position</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 ring-2 ring-primary-500 rounded" />
              <span>Selected</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// PropTypes
AlphabetGrid.propTypes = {
  mapping: PropTypes.shape({
    original: PropTypes.arrayOf(PropTypes.string),
    encrypted: PropTypes.arrayOf(PropTypes.string),
  }),
  title: PropTypes.string,
  mode: PropTypes.oneOf(['horizontal', 'vertical', 'matrix', 'connections']),
  showFrequency: PropTypes.bool,
  frequencyData: PropTypes.arrayOf(PropTypes.shape({
    char: PropTypes.string,
    percentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  })),
  highlightMatches: PropTypes.bool,
  
  interactive: PropTypes.bool,
  onCellClick: PropTypes.func,
  
  gridSize: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIndices: PropTypes.bool,
  showConnections: PropTypes.bool,
  
  className: PropTypes.string,
};

export default AlphabetGrid;