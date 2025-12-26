// src/components/visualizations/ColumnarViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { ArrowDownUp, ArrowRight, Info, Grid3x3 } from 'lucide-react';

/**
 * ColumnarViz Component
 * Visualizes Columnar Transposition cipher
 */
const ColumnarViz = ({ visualization, mode = 'encrypt' }) => {
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);

  if (!visualization) return null;

  const { 
    keyword, 
    keyOrder, 
    grid, 
    sortedGrid, 
    columns, 
    encrypted,
    paddedText 
  } = visualization;

  // Get color for column based on its order
  const getColumnColor = (order) => {
    const colors = [
      'from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-700',
      'from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-300 dark:border-blue-700',
      'from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-700',
      'from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-300 dark:border-purple-700',
      'from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-300 dark:border-yellow-700',
      'from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30 border-pink-300 dark:border-pink-700',
      'from-indigo-100 to-indigo-200 dark:from-indigo-900/30 dark:to-indigo-800/30 border-indigo-300 dark:border-indigo-700',
      'from-cyan-100 to-cyan-200 dark:from-cyan-900/30 dark:to-cyan-800/30 border-cyan-300 dark:border-cyan-700',
    ];
    return colors[order % colors.length];
  };

  // Get border color for column
  const getBorderColor = (colIdx) => {
    const colors = [
      'border-red-500 dark:border-red-400',
      'border-blue-500 dark:border-blue-400',
      'border-green-500 dark:border-green-400',
      'border-purple-500 dark:border-purple-400',
      'border-yellow-500 dark:border-yellow-400',
      'border-pink-500 dark:border-pink-400',
      'border-indigo-500 dark:border-indigo-400',
      'border-cyan-500 dark:border-cyan-400',
    ];
    return colors[colIdx % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Columnar Transposition Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Text arranged in columns and read in sorted order
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Keyword & Order */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Keyword and Column Order
        </h3>

        <div className="space-y-4">
          {/* Keyword Display */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Keyword:
            </p>
            <div className="flex gap-2 flex-wrap">
              {keyword.split('').map((char, idx) => (
                <div
                  key={idx}
                  className={`relative flex flex-col items-center p-3 rounded-lg border-2 bg-gradient-to-b ${
                    getColumnColor(keyOrder[idx])
                  } ${
                    hoveredColumn === idx || selectedColumn === idx
                      ? 'ring-2 ring-yellow-400 scale-110'
                      : ''
                  } transition-all cursor-pointer`}
                  onMouseEnter={() => setHoveredColumn(idx)}
                  onMouseLeave={() => setHoveredColumn(null)}
                  onClick={() => setSelectedColumn(selectedColumn === idx ? null : idx)}
                >
                  {/* Original position */}
                  <span className="absolute -top-2 -left-2 w-6 h-6 flex items-center justify-center bg-gray-700 text-white text-xs font-bold rounded-full">
                    {idx}
                  </span>
                  
                  {/* Character */}
                  <span className="text-3xl font-bold font-mono text-gray-900 dark:text-white mb-1">
                    {char}
                  </span>
                  
                  {/* Sort order */}
                  <Badge variant="primary" size="sm">
                    Order: {keyOrder[idx]}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Sorting Explanation */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Alphabetical Sorting:</strong> The keyword is sorted alphabetically, 
              and each letter receives a number based on its position in the sorted order. 
              This determines the reading order of columns.
            </p>
          </div>

          {/* Reading Order Arrow */}
          <div className="flex items-center justify-center gap-4">
            <ArrowDownUp className="w-8 h-8 text-purple-500" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reading Order:
              </p>
              <div className="flex gap-2">
                {keyOrder.map((order, idx) => (
                  <Badge key={idx} variant="success" size="sm">
                    Col {idx} → Read #{order}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Original Grid (Before Sorting) */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Step 1: Write Text in Columns
        </h3>

        <div className="overflow-x-auto">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {/* Column Headers */}
            <div className="flex gap-2 mb-2">
              <div className="w-12" /> {/* Row number space */}
              {keyword.split('').map((char, colIdx) => (
                <div
                  key={colIdx}
                  className={`w-12 flex flex-col items-center justify-center p-2 rounded-t-lg border-2 border-b-0 bg-gradient-to-b ${
                    getColumnColor(keyOrder[colIdx])
                  } ${
                    hoveredColumn === colIdx || selectedColumn === colIdx
                      ? 'ring-2 ring-yellow-400'
                      : ''
                  } transition-all`}
                  onMouseEnter={() => setHoveredColumn(colIdx)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <span className="font-bold text-lg">{char}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Col {colIdx}
                  </span>
                </div>
              ))}
            </div>

            {/* Grid Rows */}
            {grid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-1">
                {/* Row number */}
                <div className="w-12 flex items-center justify-center">
                  <Badge variant="secondary" size="sm">
                    Row {rowIdx}
                  </Badge>
                </div>

                {/* Row cells */}
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border-2 ${
                      getBorderColor(colIdx)
                    } ${
                      cell
                        ? `bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                            hoveredColumn === colIdx || selectedColumn === colIdx
                              ? 'ring-2 ring-yellow-400 scale-110'
                              : ''
                          }`
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                    } transition-all`}
                    onMouseEnter={() => setHoveredColumn(colIdx)}
                    onMouseLeave={() => setHoveredColumn(null)}
                  >
                    {cell || 'X'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-700 dark:text-purple-300">
            <strong>Text Layout:</strong> "{paddedText}" is written row by row into {keyword.length} columns.
            Empty cells are filled with 'X' for padding.
          </p>
        </div>
      </Card>

      {/* Sorted Grid (After Sorting) */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Step 2: Rearrange Columns by Order
        </h3>

        <div className="overflow-x-auto">
          <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {/* Sorted Column Headers */}
            <div className="flex gap-2 mb-2">
              <div className="w-12" /> {/* Row number space */}
              {sortedGrid[0] && sortedGrid[0].map((_, colIdx) => {
                // Find which original column this sorted column came from
                const originalColIdx = keyOrder.indexOf(colIdx);
                const char = keyword[originalColIdx];
                
                return (
                  <div
                    key={colIdx}
                    className={`w-12 flex flex-col items-center justify-center p-2 rounded-t-lg border-2 border-b-0 bg-gradient-to-b ${
                      getColumnColor(colIdx)
                    } transition-all`}
                  >
                    <span className="font-bold text-lg">{char}</span>
                    <Badge variant="success" size="sm">
                      #{colIdx}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {/* Sorted Grid Rows */}
            {sortedGrid.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2 mb-1">
                {/* Row number */}
                <div className="w-12 flex items-center justify-center">
                  <Badge variant="secondary" size="sm">
                    Row {rowIdx}
                  </Badge>
                </div>

                {/* Row cells */}
                {row.map((cell, colIdx) => (
                  <div
                    key={colIdx}
                    className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-lg rounded border-2 ${
                      getBorderColor(keyOrder.indexOf(colIdx))
                    } ${
                      cell
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
                    } transition-all`}
                  >
                    {cell || 'X'}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>Column Reordering:</strong> Columns are rearranged according to the alphabetical 
            order of the keyword letters.
          </p>
        </div>
      </Card>

      {/* Reading Process */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Step 3: Read Columns Top-to-Bottom
        </h3>

        <div className="space-y-4">
          {columns.map((column, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-center gap-3">
                <Badge variant="primary">
                  Column #{idx}
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Original: {keyword[keyOrder.indexOf(idx)]} (Position {keyOrder.indexOf(idx)})
                </span>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* Column characters */}
                <div className="flex gap-1">
                  {column.chars.map((char, charIdx) => (
                    <div
                      key={charIdx}
                      className="w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold rounded border border-green-300 dark:border-green-700"
                    >
                      {char}
                    </div>
                  ))}
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Result */}
                <code className="px-4 py-2 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 font-mono font-bold">
                  {column.chars.join('')}
                </code>
              </div>
            </div>
          ))}

          {/* Concatenation */}
          <div className="flex items-center justify-center py-4">
            <span className="text-2xl font-bold text-gray-400">↓ Concatenate</span>
          </div>

          {/* Final Result */}
          <div className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-300 dark:border-green-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Encrypted Text:
            </p>
            <p className="font-mono text-xl font-bold text-green-700 dark:text-green-300 break-all">
              {encrypted}
            </p>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Keyword</p>
            <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
              {keyword}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grid Size</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {grid.length} rows × {keyword.length} columns
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Text Length</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {paddedText.length} characters
            </p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      {!selectedColumn && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Hover over keyword letters to highlight corresponding columns</span>
        </div>
      )}
    </div>
  );
};

// PropTypes
ColumnarViz.propTypes = {
  visualization: PropTypes.shape({
    keyword: PropTypes.string.isRequired,
    keyOrder: PropTypes.arrayOf(PropTypes.number).isRequired,
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    sortedGrid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      order: PropTypes.number.isRequired,
      chars: PropTypes.arrayOf(PropTypes.string).isRequired,
      originalIndex: PropTypes.number,
    })).isRequired,
    encrypted: PropTypes.string.isRequired,
    paddedText: PropTypes.string.isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default ColumnarViz;