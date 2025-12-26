// src/components/visualizations/StreamCipherViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Zap, RefreshCw, Binary, TrendingUp } from 'lucide-react';

/**
 * StreamCipherViz Component
 * Visualizes Stream Cipher (LCG, BBS, or Generic) encryption process
 */
const StreamCipherViz = ({ visualization, mode = 'encrypt', algorithm = 'LCG' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showKeystream, setShowKeystream] = useState(false);

  if (!visualization) return null;

  const { 
    plaintext,
    keystream,
    ciphertext,
    generator,
    seed,
    parameters,
    xorOperations 
  } = visualization;

  // Get algorithm-specific info
  const getAlgorithmInfo = () => {
    switch (algorithm) {
      case 'LCG':
        return {
          name: 'Linear Congruential Generator',
          formula: 'Xₙ₊₁ = (a × Xₙ + c) mod m',
          color: 'blue',
        };
      case 'BBS':
        return {
          name: 'Blum Blum Shub',
          formula: 'Xₙ₊₁ = Xₙ² mod M',
          color: 'purple',
        };
      default:
        return {
          name: 'Stream Cipher',
          formula: 'Keystream ⊕ Plaintext',
          color: 'green',
        };
    }
  };

  const algInfo = getAlgorithmInfo();

  // Char to binary
  const charToBinary = (char) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`bg-gradient-to-br from-${algInfo.color}-50 to-${algInfo.color}-100 dark:from-${algInfo.color}-900/20 dark:to-${algInfo.color}-800/20`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 bg-gradient-to-br from-${algInfo.color}-500 to-${algInfo.color}-600 rounded-lg`}>
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {algInfo.name} Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Stream cipher using pseudo-random keystream generation
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Generator Parameters */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generator Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parameters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Parameters
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Seed (X₀):</span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">
                  {seed}
                </span>
              </div>

              {parameters && Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {key}:
                  </span>
                  <span className="font-mono font-bold text-gray-900 dark:text-white">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Formula */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Generation Formula
            </h4>
            
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <p className="text-lg font-mono font-bold text-indigo-900 dark:text-indigo-100 text-center">
                {algInfo.formula}
              </p>
            </div>

            {algorithm === 'LCG' && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                <p><strong>Where:</strong></p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>a = multiplier</li>
                  <li>c = increment</li>
                  <li>m = modulus</li>
                  <li>X₀ = seed (initial value)</li>
                </ul>
              </div>
            )}

            {algorithm === 'BBS' && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-xs text-purple-700 dark:text-purple-300">
                <p><strong>Where:</strong></p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>M = p × q (product of two large primes)</li>
                  <li>p, q ≡ 3 (mod 4)</li>
                  <li>X₀ = seed (coprime with M)</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Keystream Generation */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Keystream Generation
          </h3>
          <button
            onClick={() => setShowKeystream(!showKeystream)}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
          >
            <Binary className="w-4 h-4" />
            <span className="text-sm font-medium">
              {showKeystream ? 'Hide' : 'Show'} Full Keystream
            </span>
          </button>
        </div>

        {showKeystream ? (
          <div className="space-y-3">
            {/* Keystream Display */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Generated Keystream (first 50 bytes):
              </p>
              <div className="flex flex-wrap gap-1">
                {keystream.slice(0, 50).split('').map((byte, idx) => (
                  <span
                    key={idx}
                    className={`w-8 h-8 flex items-center justify-center text-xs font-mono rounded transition-all ${
                      hoveredIndex === idx
                        ? 'bg-purple-500 text-white scale-110 ring-2 ring-purple-300'
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {byte}
                  </span>
                ))}
                {keystream.length > 50 && (
                  <span className="flex items-center px-2 text-gray-400 text-sm">
                    +{keystream.length - 50} more
                  </span>
                )}
              </div>
            </div>

            {/* Generator Sequence (if available) */}
            {generator && generator.sequence && (
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                    Generator Sequence (first 10 values):
                  </p>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {generator.sequence.slice(0, 10).map((value, idx) => (
                    <div key={idx} className="flex-shrink-0">
                      <div className="p-2 bg-white dark:bg-gray-900 rounded border border-indigo-200 dark:border-indigo-800">
                        <p className="text-xs text-gray-500 dark:text-gray-400">X₍{idx}₎</p>
                        <p className="font-mono font-bold text-indigo-900 dark:text-indigo-100">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <Binary className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Click "Show Full Keystream" to view the complete generated sequence
            </p>
          </div>
        )}
      </Card>

      {/* XOR Operations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Encryption Process (XOR with Keystream)
        </h3>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {xorOperations.slice(0, 20).map((op, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg transition-all ${
                hoveredIndex === idx
                  ? 'bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400 scale-105'
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-4">
                {/* Index */}
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white font-bold rounded-full text-sm">
                  {idx}
                </span>

                {/* Plaintext */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plain</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-lg rounded-lg">
                    {op.plainChar}
                  </span>
                </div>

                <span className="text-xl text-gray-400">⊕</span>

                {/* Keystream byte */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold text-lg rounded-lg">
                    {op.keyChar}
                  </span>
                </div>

                <span className="text-xl text-gray-400">=</span>

                {/* Ciphertext */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cipher</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold text-lg rounded-lg">
                    {op.cipherChar}
                  </span>
                </div>

                {/* Binary (on hover) */}
                {hoveredIndex === idx && (
                  <div className="flex-1 ml-4">
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                      <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Plain</p>
                        <p className="text-blue-700 dark:text-blue-300">{charToBinary(op.plainChar)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Key</p>
                        <p className="text-purple-700 dark:text-purple-300">{charToBinary(op.keyChar)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Cipher</p>
                        <p className="text-green-700 dark:text-green-300">{charToBinary(op.cipherChar)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {xorOperations.length > 20 && (
            <div className="text-center py-4">
              <Badge variant="secondary">
                +{xorOperations.length - 20} more operations
              </Badge>
            </div>
          )}
        </div>
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Encryption Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Plaintext</p>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-mono text-sm text-blue-900 dark:text-blue-100 break-all">
                {plaintext}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Keystream</p>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-mono text-sm text-purple-900 dark:text-purple-100 break-all">
                {keystream.substring(0, 50)}{keystream.length > 50 ? '...' : ''}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ciphertext</p>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-mono text-sm text-green-900 dark:text-green-100 break-all">
                {ciphertext}
              </p>
            </div>
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Message Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {plaintext.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Keystream Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {keystream.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Generator Type</p>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {algorithm}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Initial Seed</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {seed}
            </p>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Stream Cipher Properties
            </h4>
            <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <p>
                <strong>Fast:</strong> Encrypts data byte-by-byte, ideal for streaming
              </p>
              <p>
                <strong>Synchronization:</strong> Sender and receiver must maintain synchronized keystream
              </p>
              <p>
                <strong>Security:</strong> Depends heavily on the quality of the pseudo-random generator
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                ⚠️ Never reuse the same seed/keystream for different messages!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

StreamCipherViz.propTypes = {
  visualization: PropTypes.shape({
    plaintext: PropTypes.string.isRequired,
    keystream: PropTypes.string.isRequired,
    ciphertext: PropTypes.string.isRequired,
    generator: PropTypes.shape({
      sequence: PropTypes.arrayOf(PropTypes.number),
    }),
    seed: PropTypes.number.isRequired,
    parameters: PropTypes.object,
    xorOperations: PropTypes.arrayOf(PropTypes.shape({
      plainChar: PropTypes.string.isRequired,
      keyChar: PropTypes.string.isRequired,
      cipherChar: PropTypes.string.isRequired,
    })).isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
  algorithm: PropTypes.oneOf(['LCG', 'BBS', 'Generic']),
};

export default StreamCipherViz;