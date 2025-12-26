// src/components/visualizations/RailFenceViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { TrendingDown, TrendingUp, ArrowRight, Info } from 'lucide-react';

/**
 * RailFenceViz Component
 * Visualizes Rail Fence cipher zigzag pattern
 */
const RailFenceViz = ({ visualization, mode = 'encrypt' }) => {
  const [hoveredPosition, setHoveredPosition] = useState(null);

  if (!visualization) return null;

  const { grid, pattern, readingOrder, rails, encrypted } = visualization;

  // Get color for rail
  const getRailColor = (rail) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700',
      'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    ];
    return colors[rail % colors.length];
  };

  // Get arrow icon based on direction
  const getDirectionIcon = (position) => {
    if (position === 0) return <TrendingDown className="w-3 h-3" />;
    if (position === rails - 1) return <TrendingUp className="w-3 h-3" />;
    
    // Check if going down or up based on pattern
    const currentItem = pattern.find(p => p.position === hoveredPosition);
    if (!currentItem) return null;
    
    const nextItem = pattern.find(p => p.position === hoveredPosition + 1);
    if (!nextItem) return null;
    
    return nextItem.rail > currentItem.rail ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Rail Fence Cipher Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Zigzag transposition pattern across {rails} rails
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Zigzag Pattern Grid */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Zigzag Pattern
          </h3>
          <Badge variant="info">
            {rails} Rails
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg min-w-full">
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-2 last:mb-0">
                {/* Rail Label */}
                <div className="w-12 flex items-center justify-center">
                  <Badge variant="secondary" size="sm">
                    Rail {rowIdx}
                  </Badge>
                </div>

                {/* Grid Cells */}
                {row.map((cell, colIdx) => {
                  const patternItem = pattern.find(
                    p => p.position === colIdx && p.rail === rowIdx
                  );
                  const isHovered = hoveredPosition === colIdx;

                  return (
                    <div
                      key={colIdx}
                      className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded-lg border-2 transition-all ${
                        cell 
                          ? `${getRailColor(rowIdx)} ${isHovered ? 'scale-125 ring-2 ring-yellow-400 z-10' : ''}`
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-300 dark:text-gray-600'
                      }`}
                      onMouseEnter={() => setHoveredPosition(colIdx)}
                      onMouseLeave={() => setHoveredPosition(null)}
                      title={cell ? `Position ${colIdx}: ${cell}` : 'Empty'}
                    >
                      {cell || '·'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Info */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Pattern:</strong> Text is written in a zigzag pattern going down and up across {rails} rails. 
            Reading row by row gives the encrypted text.
          </p>
        </div>
      </Card>

      {/* Writing Pattern */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Writing Order (Input Sequence)
        </h3>

        <div className="flex flex-wrap gap-2">
          {pattern.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                getRailColor(item.rail)
              } ${
                hoveredPosition === item.position ? 'scale-110 ring-2 ring-yellow-400' : ''
              }`}
              onMouseEnter={() => setHoveredPosition(item.position)}
              onMouseLeave={() => setHoveredPosition(null)}
            >
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {item.position}
              </span>
              <span className="w-10 h-10 flex items-center justify-center font-mono font-bold text-xl">
                {item.char}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="secondary" size="sm">
                  R{item.rail}
                </Badge>
                {getDirectionIcon(item.rail)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Reading Order */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Reading Order (Row by Row)
        </h3>

        <div className="space-y-4">
          {Array.from({ length: rails }, (_, railIdx) => {
            const railChars = readingOrder.filter(item => item.rail === railIdx);
            
            return (
              <div key={railIdx} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    Rail {railIdx}
                  </Badge>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {railChars.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col items-center p-2 rounded-lg border ${getRailColor(railIdx)}`}
                    >
                      <span className="w-10 h-10 flex items-center justify-center font-mono font-bold text-xl">
                        {item.char}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Pos {item.position}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Result:</span>
                  <code className="px-3 py-1 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono font-bold">
                    {railChars.map(item => item.char).join('')}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Final Result */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Encrypted Result
          </h3>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </div>

        <div className="space-y-4">
          {/* Concatenated Rails */}
          <div className="space-y-2">
            {Array.from({ length: rails }, (_, railIdx) => {
              const railText = readingOrder
                .filter(item => item.rail === railIdx)
                .map(item => item.char)
                .join('');

              return (
                <div key={railIdx} className="flex items-center gap-3">
                  <Badge variant="secondary" size="sm">
                    Rail {railIdx}
                  </Badge>
                  <code className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm">
                    {railText}
                  </code>
                </div>
              );
            })}
          </div>

          {/* Plus Signs */}
          <div className="flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">↓ Concatenate</span>
          </div>

          {/* Final Encrypted Text */}
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-300 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Final Encrypted Text:
            </p>
            <p className="font-mono text-xl font-bold text-green-700 dark:text-green-300 break-all">
              {encrypted}
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Number of Rails</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {rails}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Text Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {pattern.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Grid Width</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {grid[0]?.length || 0}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Zigzag Cycles</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.ceil(pattern.length / ((rails - 1) * 2))}
            </p>
          </div>
        </div>
      </Card>

      {/* Hover Instruction */}
      {!hoveredPosition && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Hover over characters to see their position in the zigzag pattern</span>
        </div>
      )}
    </div>
  );
};

RailFenceViz.propTypes = {
  visualization: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    pattern: PropTypes.arrayOf(PropTypes.shape({
      position: PropTypes.number.isRequired,
      rail: PropTypes.number.isRequired,
      char: PropTypes.string.isRequired,
    })).isRequired,
    readingOrder: PropTypes.arrayOf(PropTypes.shape({
      rail: PropTypes.number.isRequired,
      position: PropTypes.number.isRequired,
      char: PropTypes.string.isRequired,
    })).isRequired,
    rails: PropTypes.number.isRequired,
    encrypted: PropTypes.string.isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default RailFenceViz;