// src/components/visualizations/CaesarViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { RotateCw, ArrowRight, Info, Lock } from 'lucide-react';

/**
 * CaesarViz Component
 * Visualizes Caesar cipher shift mechanism
 */
const CaesarViz = ({ visualization, mode = 'encrypt' }) => {
  const [hoveredChar, setHoveredChar] = useState(null);

  if (!visualization) return null;

  const { 
    originalAlphabet, 
    shiftedAlphabet, 
    shift, 
    mapping, 
    plaintext, 
    ciphertext 
  } = visualization;

  // Get shift direction
  const shiftDirection = mode === 'encrypt' ? 'right' : 'left';
  const effectiveShift = mode === 'encrypt' ? shift : (26 - shift) % 26;

  // Get color for character based on position
  const getCharColor = (char, type) => {
    if (!hoveredChar) return '';
    
    if (type === 'original' && char === hoveredChar.original) {
      return 'ring-2 ring-blue-500 scale-110 z-10';
    }
    if (type === 'shifted' && char === hoveredChar.shifted) {
      return 'ring-2 ring-green-500 scale-110 z-10';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Caesar Cipher Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Simple substitution cipher with alphabet shift
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Shift Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Shift Configuration
        </h3>

        <div className="flex items-center justify-center gap-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          {/* Original Position */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Original</p>
            <div className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white font-mono font-bold text-2xl rounded-full">
              A
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Position 0</p>
          </div>

          {/* Shift Arrow */}
          <div className="flex flex-col items-center">
            <RotateCw className={`w-12 h-12 text-purple-500 ${
              shiftDirection === 'left' ? 'transform scale-x-[-1]' : ''
            }`} />
            <Badge variant="primary" className="mt-2">
              Shift {effectiveShift}
            </Badge>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {shiftDirection === 'right' ? 'Right →' : '← Left'}
            </p>
          </div>

          {/* Shifted Position */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Shifted</p>
            <div className="w-16 h-16 flex items-center justify-center bg-green-500 text-white font-mono font-bold text-2xl rounded-full">
              {String.fromCharCode(65 + effectiveShift)}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Position {effectiveShift}
            </p>
          </div>
        </div>

        {/* Formula */}
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Caesar Cipher Formula:
          </p>
          <code className="text-sm text-blue-800 dark:text-blue-200 font-mono">
            {mode === 'encrypt' 
              ? `E(x) = (x + ${shift}) mod 26`
              : `D(x) = (x - ${shift}) mod 26`
            }
          </code>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            Where x is the position of the letter in the alphabet (A=0, B=1, ..., Z=25)
          </p>
        </div>
      </Card>

      {/* Alphabet Comparison */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alphabet Shift Visualization
        </h3>

        <div className="space-y-6">
          {/* Original Alphabet */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Original Alphabet
              </p>
              <Badge variant="primary" size="sm">A-Z</Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {originalAlphabet.map((char, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold rounded-lg border-2 border-blue-300 dark:border-blue-700 transition-all cursor-pointer ${
                    getCharColor(char, 'original')
                  }`}
                  onMouseEnter={() => setHoveredChar({ 
                    original: char, 
                    shifted: shiftedAlphabet[idx] 
                  })}
                  onMouseLeave={() => setHoveredChar(null)}
                  title={`${char} → ${shiftedAlphabet[idx]}`}
                >
                  <span className="text-sm">{char}</span>
                  <span className="text-xs opacity-60">{idx}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Indicator */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <ArrowRight className="w-6 h-6 text-purple-500" />
              <span className="text-purple-700 dark:text-purple-300 font-semibold">
                Shift by {effectiveShift} positions
              </span>
              <ArrowRight className="w-6 h-6 text-purple-500" />
            </div>
          </div>

          {/* Shifted Alphabet */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Shifted Alphabet
              </p>
              <Badge variant="success" size="sm">
                Cipher Key
              </Badge>
            </div>
            <div className="flex flex-wrap gap-1">
              {shiftedAlphabet.map((char, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 flex flex-col items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold rounded-lg border-2 border-green-300 dark:border-green-700 transition-all cursor-pointer ${
                    getCharColor(char, 'shifted')
                  }`}
                  onMouseEnter={() => setHoveredChar({ 
                    original: originalAlphabet[idx], 
                    shifted: char 
                  })}
                  onMouseLeave={() => setHoveredChar(null)}
                  title={`${originalAlphabet[idx]} → ${char}`}
                >
                  <span className="text-sm">{char}</span>
                  <span className="text-xs opacity-60">{idx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Info */}
        {hoveredChar && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Original</p>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {hoveredChar.original}
                </span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Becomes</p>
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {hoveredChar.shifted}
                </span>
              </div>
              <div className="flex-1 ml-4 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-mono">
                  {hoveredChar.original} (position {hoveredChar.original.charCodeAt(0) - 65}) 
                  + {effectiveShift} = {hoveredChar.shifted} (position {hoveredChar.shifted.charCodeAt(0) - 65})
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Character-by-Character Mapping */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Character Transformation
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mapping.map((map, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                hoveredChar && 
                (map.original === hoveredChar.original || map.shifted === hoveredChar.shifted)
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => setHoveredChar({ 
                original: map.original, 
                shifted: map.shifted 
              })}
              onMouseLeave={() => setHoveredChar(null)}
            >
              {/* Position */}
              <span className="w-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                {idx}
              </span>

              {/* Original Character */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Plain
                </span>
                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-mono font-bold text-xl rounded-lg">
                  {map.original}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {map.original.charCodeAt(0) - 65}
                </span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Shifted Character */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Cipher
                </span>
                <div className="w-12 h-12 flex items-center justify-center bg-green-500 text-white font-mono font-bold text-xl rounded-lg">
                  {map.shifted}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {map.shifted.charCodeAt(0) - 65}
                </span>
              </div>

              {/* Calculation */}
              <div className="flex-1 ml-4 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  ({map.original.charCodeAt(0) - 65} {mode === 'encrypt' ? '+' : '-'} {shift}) mod 26 = {map.shifted.charCodeAt(0) - 65}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Transformation Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
            </p>
            <p className="font-mono text-lg text-blue-700 dark:text-blue-300 break-all">
              {plaintext}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <RotateCw className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <Badge variant="primary">Shift {shift}</Badge>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
            </p>
            <p className="font-mono text-lg text-green-700 dark:text-green-300 break-all">
              {ciphertext}
            </p>
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Shift Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {shift}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Characters</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {mapping.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Alphabet Size</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              26
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Possible Keys</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              25
            </p>
          </div>
        </div>
      </Card>

      {/* Hover Instruction */}
      {!hoveredChar && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Hover over letters to see their transformation</span>
        </div>
      )}
    </div>
  );
};

// PropTypes
CaesarViz.propTypes = {
  visualization: PropTypes.shape({
    originalAlphabet: PropTypes.arrayOf(PropTypes.string).isRequired,
    shiftedAlphabet: PropTypes.arrayOf(PropTypes.string).isRequired,
    shift: PropTypes.number.isRequired,
    mapping: PropTypes.arrayOf(PropTypes.shape({
      original: PropTypes.string.isRequired,
      shifted: PropTypes.string.isRequired,
      position: PropTypes.number,
    })).isRequired,
    plaintext: PropTypes.string.isRequired,
    ciphertext: PropTypes.string.isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default CaesarViz;