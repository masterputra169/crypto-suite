// src/components/visualizations/VigenereViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Grid3x3, ArrowRight, Info } from 'lucide-react';

/**
 * VigenereViz Component
 * Visualizes Vigenère cipher encryption/decryption process
 */
const VigenereViz = ({ visualization, mode = 'encrypt' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!visualization) return null;

  const { plaintext, ciphertext, keyword, repeatedKey, mapping } = visualization;

  // Vigenère Square (26x26 grid)
  const generateVigenereSquare = () => {
    const square = [];
    for (let i = 0; i < 26; i++) {
      const row = [];
      for (let j = 0; j < 26; j++) {
        row.push(String.fromCharCode(65 + ((i + j) % 26)));
      }
      square.push(row);
    }
    return square;
  };

  const vigenereSquare = generateVigenereSquare();

  // Get highlighted cell in Vigenère square
  const getHighlightedCell = (index) => {
    if (hoveredIndex === null || !mapping[hoveredIndex]) return null;
    
    const map = mapping[hoveredIndex];
    const plainIndex = map.plainChar.charCodeAt(0) - 65;
    const keyIndex = map.keyChar.charCodeAt(0) - 65;
    
    return { row: keyIndex, col: plainIndex };
  };

  const highlightedCell = hoveredIndex !== null ? getHighlightedCell(hoveredIndex) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Vigenère Cipher Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Polyalphabetic substitution cipher using a keyword
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Keyword Display */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Keyword Information
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-32">
              Original Keyword:
            </span>
            <div className="flex gap-1">
              {keyword.split('').map((char, idx) => (
                <span
                  key={idx}
                  className="w-10 h-10 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold rounded-lg border-2 border-purple-300 dark:border-purple-700"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-32">
              Repeated Key:
            </span>
            <div className="flex flex-wrap gap-1">
              {repeatedKey.split('').slice(0, 30).map((char, idx) => (
                <span
                  key={idx}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-mono font-bold rounded transition-all ${
                    hoveredIndex === idx
                      ? 'bg-purple-500 text-white scale-110 ring-2 ring-purple-300'
                      : 'bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400'
                  }`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {char}
                </span>
              ))}
              {repeatedKey.length > 30 && (
                <span className="px-2 h-8 flex items-center text-gray-400 text-sm">
                  +{repeatedKey.length - 30} more
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Character Mapping */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Character-by-Character Transformation
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mapping.slice(0, 20).map((map, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                hoveredIndex === idx
                  ? 'bg-purple-100 dark:bg-purple-900/30 ring-2 ring-purple-300 scale-105'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Position */}
              <span className="w-8 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                {idx}
              </span>

              {/* Plaintext Character */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plain</span>
                <span className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-lg rounded-lg border-2 border-blue-300 dark:border-blue-700">
                  {map.plainChar}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {map.plainChar.charCodeAt(0) - 65}
                </span>
              </div>

              {/* Plus Sign */}
              <span className="text-2xl font-bold text-gray-400">+</span>

              {/* Key Character */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key</span>
                <span className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold text-lg rounded-lg border-2 border-purple-300 dark:border-purple-700">
                  {map.keyChar}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {map.keyChar.charCodeAt(0) - 65}
                </span>
              </div>

              {/* Arrow */}
              <ArrowRight className="w-6 h-6 text-gray-400" />

              {/* Cipher Character */}
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cipher</span>
                <span className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold text-lg rounded-lg border-2 border-green-300 dark:border-green-700">
                  {map.cipherChar}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {map.cipherChar.charCodeAt(0) - 65}
                </span>
              </div>

              {/* Formula */}
              <div className="flex-1 ml-4 p-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  ({map.plainChar.charCodeAt(0) - 65} + {map.keyChar.charCodeAt(0) - 65}) mod 26 = {map.cipherChar.charCodeAt(0) - 65}
                </p>
              </div>
            </div>
          ))}

          {mapping.length > 20 && (
            <div className="text-center py-4">
              <Badge variant="secondary">
                +{mapping.length - 20} more transformations
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Vigenère Square (Tabula Recta) */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Vigenère Square (Tabula Recta)
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Info className="w-4 h-4" />
            <span>Hover over characters above to see position</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Column headers (A-Z) */}
            <div className="flex">
              <div className="w-8 h-8" /> {/* Empty corner */}
              {Array.from({ length: 26 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400"
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>

            {/* Rows */}
            {vigenereSquare.map((row, rowIdx) => (
              <div key={rowIdx} className="flex">
                {/* Row header */}
                <div className="w-8 h-8 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
                  {String.fromCharCode(65 + rowIdx)}
                </div>

                {/* Row cells */}
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-mono transition-all ${
                      highlightedCell && highlightedCell.row === rowIdx && highlightedCell.col === colIdx
                        ? 'bg-yellow-300 dark:bg-yellow-600 text-gray-900 font-bold scale-125 z-10 shadow-lg rounded'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>How to use:</strong> Find the plaintext letter in the top row, 
            follow down to the row starting with the key letter. The intersection is your ciphertext.
          </p>
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Original Text</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {plaintext}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Keyword (Repeated)</p>
            <p className="font-mono text-sm text-purple-700 dark:text-purple-300 break-all">
              {repeatedKey}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cipher Text</p>
            <p className="font-mono text-sm text-green-700 dark:text-green-300 break-all">
              {ciphertext}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

VigenereViz.propTypes = {
  visualization: PropTypes.shape({
    plaintext: PropTypes.string.isRequired,
    ciphertext: PropTypes.string.isRequired,
    keyword: PropTypes.string.isRequired,
    repeatedKey: PropTypes.string.isRequired,
    mapping: PropTypes.arrayOf(PropTypes.shape({
      plainChar: PropTypes.string.isRequired,
      keyChar: PropTypes.string.isRequired,
      cipherChar: PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
    })).isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default VigenereViz;