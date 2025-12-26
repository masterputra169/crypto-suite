// src/components/visualizations/PlayfairGrid.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Grid3x3, ArrowRight, Info, Zap } from 'lucide-react';

/**
 * PlayfairGrid Component
 * Visualizes Playfair cipher 5x5 grid and encryption process
 */
const PlayfairGrid = ({ visualization, mode = 'encrypt' }) => {
  const [selectedPair, setSelectedPair] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  if (!visualization) return null;

  const { grid, keyword, digraphs, processedText } = visualization;

  // Find position in grid
  const findPosition = (char) => {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (grid[i][j] === char) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  };

  // Get rule type for digraph pair
  const getRuleType = (pos1, pos2) => {
    if (pos1.row === pos2.row) return 'same-row';
    if (pos1.col === pos2.col) return 'same-column';
    return 'rectangle';
  };

  // Handle digraph hover
  const handleDigraphHover = (digraph, index) => {
    const pos1 = findPosition(digraph.pair[0]);
    const pos2 = findPosition(digraph.pair[1]);
    
    if (pos1 && pos2) {
      const rule = getRuleType(pos1, pos2);
      let highlighted = [pos1, pos2];
      
      // Add intermediate cells for visualization
      if (rule === 'rectangle') {
        highlighted.push(
          { row: pos1.row, col: pos2.col },
          { row: pos2.row, col: pos1.col }
        );
      }
      
      setHighlightedCells(highlighted);
      setSelectedPair({ ...digraph, rule, index });
    }
  };

  // Clear highlights
  const clearHighlights = () => {
    setHighlightedCells([]);
    setSelectedPair(null);
  };

  // Check if cell is highlighted
  const isCellHighlighted = (row, col) => {
    return highlightedCells.some(cell => cell.row === row && cell.col === col);
  };

  // Get cell highlight class
  const getCellHighlightClass = (row, col) => {
    if (!selectedPair) return '';
    
    const pos1 = findPosition(selectedPair.pair[0]);
    const pos2 = findPosition(selectedPair.pair[1]);
    
    if (pos1 && pos1.row === row && pos1.col === col) {
      return 'bg-blue-500 text-white scale-110 ring-4 ring-blue-300 z-20';
    }
    if (pos2 && pos2.row === row && pos2.col === col) {
      return 'bg-purple-500 text-white scale-110 ring-4 ring-purple-300 z-20';
    }
    if (isCellHighlighted(row, col)) {
      return 'bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white ring-2 ring-yellow-400 z-10';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Playfair Cipher Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              5×5 grid cipher encrypting letter pairs (digraphs)
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Keyword & Grid Generation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grid Display */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Playfair 5×5 Grid
          </h3>

          <div className="flex flex-col items-center">
            <div className="inline-block p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {grid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex gap-2 mb-2 last:mb-0">
                  {row.map((cell, colIdx) => (
                    <div
                      key={colIdx}
                      className={`w-14 h-14 flex items-center justify-center font-mono font-bold text-xl rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                        getCellHighlightClass(rowIdx, colIdx) ||
                        'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {cell}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Grid Info */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-full">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Keyword:</strong> {keyword}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                I and J are combined into one cell
              </p>
            </div>
          </div>
        </Card>

        {/* Rules */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Playfair Rules
          </h3>

          <div className="space-y-4">
            {/* Rule 1: Same Row */}
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Same Row
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Replace each letter with the one to its right (wrap around)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                    Example: AB → BC
                  </p>
                </div>
              </div>
            </div>

            {/* Rule 2: Same Column */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ArrowRight className="w-5 h-5 text-white transform rotate-90" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Same Column
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Replace each letter with the one below it (wrap around)
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                    Example: AF → FK
                  </p>
                </div>
              </div>
            </div>

            {/* Rule 3: Rectangle */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Grid3x3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Rectangle
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Replace with letters on same row but in other pair's column
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                    Example: AG → BF (form rectangle)
                  </p>
                </div>
              </div>
            </div>

            {/* Spacer Rule */}
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  <strong>Note:</strong> Double letters are separated with X (e.g., HELLO → HEL LX O)
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Digraph Processing */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Letter Pairs (Digraphs) Processing
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {digraphs.map((digraph, idx) => {
            const pos1 = findPosition(digraph.pair[0]);
            const pos2 = findPosition(digraph.pair[1]);
            const rule = pos1 && pos2 ? getRuleType(pos1, pos2) : null;

            const ruleColors = {
              'same-row': 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800',
              'same-column': 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800',
              'rectangle': 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800',
            };

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border bg-gradient-to-r transition-all cursor-pointer ${
                  selectedPair?.index === idx
                    ? 'ring-2 ring-primary-500 scale-105'
                    : ruleColors[rule] || 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
                onMouseEnter={() => handleDigraphHover(digraph, idx)}
                onMouseLeave={clearHighlights}
              >
                <div className="flex items-center gap-4">
                  {/* Step number */}
                  <div className="w-8 h-8 flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full">
                    {idx + 1}
                  </div>

                  {/* Input pair */}
                  <div className="flex gap-1">
                    <span className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white font-mono font-bold text-xl rounded-lg">
                      {digraph.pair[0]}
                    </span>
                    <span className="w-12 h-12 flex items-center justify-center bg-purple-500 text-white font-mono font-bold text-xl rounded-lg">
                      {digraph.pair[1]}
                    </span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="w-6 h-6 text-gray-400" />

                  {/* Output pair */}
                  <div className="flex gap-1">
                    <span className="w-12 h-12 flex items-center justify-center bg-green-500 text-white font-mono font-bold text-xl rounded-lg">
                      {digraph.encrypted[0]}
                    </span>
                    <span className="w-12 h-12 flex items-center justify-center bg-emerald-500 text-white font-mono font-bold text-xl rounded-lg">
                      {digraph.encrypted[1]}
                    </span>
                  </div>

                  {/* Rule badge */}
                  <div className="flex-1 ml-4">
                    <Badge variant={
                      rule === 'same-row' ? 'danger' :
                      rule === 'same-column' ? 'primary' : 'secondary'
                    }>
                      {rule === 'same-row' ? 'Same Row' :
                       rule === 'same-column' ? 'Same Column' : 'Rectangle'}
                    </Badge>
                    {pos1 && pos2 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ({pos1.row},{pos1.col}) + ({pos2.row},{pos2.col})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Processed Text</p>
            <p className="font-mono text-lg text-gray-900 dark:text-white break-all">
              {processedText}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Number of Digraphs</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">
              {digraphs.length}
            </p>
          </div>
        </div>
      </Card>

      {/* Hover instruction */}
      {!selectedPair && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4" />
          <span>Hover over digraph pairs to see their positions in the grid</span>
        </div>
      )}
    </div>
  );
};

PlayfairGrid.propTypes = {
  visualization: PropTypes.shape({
    grid: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    keyword: PropTypes.string.isRequired,
    digraphs: PropTypes.arrayOf(PropTypes.shape({
      pair: PropTypes.string.isRequired,
      encrypted: PropTypes.string.isRequired,
      rule: PropTypes.string,
    })).isRequired,
    processedText: PropTypes.string.isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default PlayfairGrid;