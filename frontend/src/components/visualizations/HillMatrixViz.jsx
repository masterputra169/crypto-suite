// src/components/visualizations/HillMatrixViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Grid3x3, ArrowRight, X as MultiplyIcon, Info, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * HillMatrixViz Component
 * Visualizes Hill cipher matrix operations
 */
const HillMatrixViz = ({ visualization, mode = 'encrypt' }) => {
  const [selectedBlock, setSelectedBlock] = useState(null);

  if (!visualization) return null;

  const { 
    keyMatrix, 
    inverseMatrix, 
    validation, 
    paddedText, 
    steps 
  } = visualization;

  // Render matrix
  const renderMatrix = (matrix, label, color = 'blue') => (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </p>
      <div className={`inline-flex flex-col gap-1 p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border-2 border-${color}-300 dark:border-${color}-700`}>
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-1">
            {row.map((val, j) => (
              <div
                key={j}
                className={`w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-${color}-700 dark:text-${color}-300 font-mono font-bold text-lg rounded border border-${color}-300 dark:border-${color}-700`}
              >
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  // Render vector
  const renderVector = (vector, label, color = 'purple') => (
    <div className="flex flex-col items-center">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {label}
      </p>
      <div className={`inline-flex flex-col gap-1 p-3 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border border-${color}-300 dark:border-${color}-700`}>
        {vector.map((val, i) => (
          <div
            key={i}
            className={`w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-800 text-${color}-700 dark:text-${color}-300 font-mono font-bold text-lg rounded border border-${color}-300 dark:border-${color}-700`}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Grid3x3 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Hill Cipher Matrix Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Polygram cipher using linear algebra and matrix multiplication
            </p>
          </div>
          <Badge variant="primary">
            {mode === 'encrypt' ? 'Encryption' : 'Decryption'}
          </Badge>
        </div>
      </Card>

      {/* Matrix Validation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Matrix Validation
        </h3>

        <div className="flex items-start gap-6">
          {renderMatrix(keyMatrix, 'Key Matrix', 'blue')}
          
          {validation && (
            <div className="flex-1 space-y-3">
              <div className={`p-4 rounded-lg border ${
                validation.valid 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {validation.valid ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <h4 className={`font-semibold ${
                    validation.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {validation.message}
                  </h4>
                </div>

                {validation.determinant !== undefined && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Determinant:</span>
                      <span className="font-mono font-bold text-gray-900 dark:text-white">
                        {validation.determinant}
                      </span>
                    </div>
                    {validation.determinantMod26 !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Det mod 26:</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {validation.determinantMod26}
                        </span>
                      </div>
                    )}
                    {validation.inverse !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Modular Inverse:</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">
                          {validation.inverse}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {validation.valid && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>✓ Valid Matrix:</strong> Determinant has modular inverse, matrix can be used for encryption/decryption
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inverse Matrix (for decryption) */}
        {inverseMatrix && mode === 'decrypt' && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-6">
              {renderMatrix(inverseMatrix, 'Inverse Matrix (for Decryption)', 'purple')}
              
              <div className="flex-1">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    The inverse matrix is used for decryption. It's calculated such that:
                  </p>
                  <p className="text-sm font-mono text-purple-800 dark:text-purple-200 mt-2">
                    Key Matrix × Inverse Matrix ≡ Identity Matrix (mod 26)
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Block Processing Steps */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Block-by-Block Matrix Multiplication
        </h3>

        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                selectedBlock === idx
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 ring-2 ring-yellow-400'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedBlock(selectedBlock === idx ? null : idx)}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 flex items-center justify-center bg-indigo-500 text-white font-bold rounded-full">
                  {step.blockNumber}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Block {step.blockNumber}: "{step.plainBlock}"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Vector: [{step.plainVector.join(', ')}]
                  </p>
                </div>
                <Badge variant="success">
                  Result: {step.encryptedBlock}
                </Badge>
              </div>

              {selectedBlock === idx && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {/* Key Matrix */}
                    {renderMatrix(keyMatrix, 'Key Matrix', 'blue')}

                    {/* Multiply symbol */}
                    <MultiplyIcon className="w-8 h-8 text-gray-400" />

                    {/* Plaintext Vector */}
                    {renderVector(step.plainVector, 'Plaintext Vector', 'purple')}

                    {/* Equals */}
                    <span className="text-3xl text-gray-400">=</span>

                    {/* Encrypted Vector */}
                    {renderVector(step.encryptedVector, 'Encrypted Vector', 'green')}
                  </div>

                  {/* Calculation Steps */}
                  <div className="mt-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Matrix Multiplication:
                    </p>
                    <div className="space-y-1 font-mono text-sm text-gray-600 dark:text-gray-400">
                      {step.calculation && step.calculation.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>

                  {/* Character Mapping */}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plaintext</p>
                      <div className="flex gap-1">
                        {step.plainBlock.split('').map((char, i) => (
                          <span
                            key={i}
                            className="w-10 h-10 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold rounded-lg"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400" />

                    <div className="text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ciphertext</p>
                      <div className="flex gap-1">
                        {step.encryptedBlock.split('').map((char, i) => (
                          <span
                            key={i}
                            className="w-10 h-10 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold rounded-lg"
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!selectedBlock && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Info className="w-4 h-4" />
            <span>Click on any block to see detailed matrix multiplication steps</span>
          </div>
        )}
      </Card>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Padded Text</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {paddedText}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Matrix Size</p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {keyMatrix.length}×{keyMatrix[0].length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Number of Blocks</p>
            <p className="text-3xl font-bold text-green-700 dark:text-green-300">
              {steps.length}
            </p>
          </div>
        </div>
      </Card>

      {/* Formula Reference */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Hill Cipher Formula
        </h3>
        <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
          <p className="font-mono">
            <strong>Encryption:</strong> C = (K × P) mod 26
          </p>
          <p className="font-mono">
            <strong>Decryption:</strong> P = (K⁻¹ × C) mod 26
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            Where K is the key matrix, P is plaintext vector, C is ciphertext vector, and K⁻¹ is the inverse matrix
          </p>
        </div>
      </Card>
    </div>
  );
};

HillMatrixViz.propTypes = {
  visualization: PropTypes.shape({
    keyMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    inverseMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    validation: PropTypes.shape({
      valid: PropTypes.bool.isRequired,
      message: PropTypes.string.isRequired,
      determinant: PropTypes.number,
      determinantMod26: PropTypes.number,
      inverse: PropTypes.number,
    }),
    paddedText: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.shape({
      blockNumber: PropTypes.number.isRequired,
      plainBlock: PropTypes.string.isRequired,
      plainVector: PropTypes.arrayOf(PropTypes.number).isRequired,
      encryptedVector: PropTypes.arrayOf(PropTypes.number).isRequired,
      encryptedBlock: PropTypes.string.isRequired,
      calculation: PropTypes.string,
    })).isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default HillMatrixViz;