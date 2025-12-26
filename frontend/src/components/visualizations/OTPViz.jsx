// src/components/visualizations/OTPViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Key, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * OTPViz Component
 * Visualizes One-Time Pad encryption process
 */
const OTPViz = ({ visualization, mode = 'encrypt' }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  if (!visualization) return null;

  const { 
    plaintext, 
    key, 
    ciphertext, 
    xorOperations, 
    keyValidation,
    entropy 
  } = visualization;

  // Convert char to binary
  const charToBinary = (char) => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              One-Time Pad Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Theoretically unbreakable cipher using random key equal to message length
            </p>
          </div>
          <Badge variant="success">
            Perfect Security
          </Badge>
        </div>
      </Card>

      {/* Key Validation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Requirements & Validation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Length Check */}
          <div className={`p-4 rounded-lg border-2 ${
            keyValidation.lengthMatch
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {keyValidation.lengthMatch ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Length Match
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Key length must equal message length
            </p>
            <div className="mt-2 flex justify-between text-xs">
              <span>Message: {plaintext.length}</span>
              <span>Key: {key.length}</span>
            </div>
          </div>

          {/* Randomness Check */}
          <div className={`p-4 rounded-lg border-2 ${
            keyValidation.isRandom
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {keyValidation.isRandom ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Randomness
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Key should be truly random
            </p>
            {entropy && (
              <div className="mt-2 text-xs">
                Entropy: {entropy.toFixed(2)} bits
              </div>
            )}
          </div>

          {/* One-Time Use */}
          <div className={`p-4 rounded-lg border-2 ${
            keyValidation.oneTimeUse
              ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
              : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {keyValidation.oneTimeUse ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                One-Time Use
              </h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Key must NEVER be reused
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Critical for security!
            </p>
          </div>
        </div>

        {/* Warning */}
        {!keyValidation.lengthMatch && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">
                  Security Warning
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  For perfect security, the key must be exactly the same length as the message, 
                  truly random, and never reused.
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* XOR Operations */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          XOR Encryption Process
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
              <div className="flex items-center gap-4 mb-3">
                <span className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white font-bold rounded-full text-sm">
                  {idx}
                </span>
                
                {/* Plaintext Char */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plain</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-bold text-xl rounded-lg">
                    {op.plainChar}
                  </span>
                </div>

                <span className="text-2xl text-gray-400">⊕</span>

                {/* Key Char */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold text-xl rounded-lg">
                    {op.keyChar}
                  </span>
                </div>

                <span className="text-2xl text-gray-400">=</span>

                {/* Cipher Char */}
                <div className="flex flex-col items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cipher</span>
                  <span className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-mono font-bold text-xl rounded-lg">
                    {op.cipherChar}
                  </span>
                </div>
              </div>

              {/* Binary Representation */}
              {hoveredIndex === idx && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-center font-mono text-sm">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Plain Binary</p>
                      <p className="text-blue-700 dark:text-blue-300">{charToBinary(op.plainChar)}</p>
                      <p className="text-xs text-gray-500 mt-1">({op.plainChar.charCodeAt(0)})</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Key Binary</p>
                      <p className="text-purple-700 dark:text-purple-300">{charToBinary(op.keyChar)}</p>
                      <p className="text-xs text-gray-500 mt-1">({op.keyChar.charCodeAt(0)})</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Cipher Binary</p>
                      <p className="text-green-700 dark:text-green-300">{charToBinary(op.cipherChar)}</p>
                      <p className="text-xs text-gray-500 mt-1">({op.cipherChar.charCodeAt(0)})</p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      <strong>XOR Operation:</strong> Each bit position is XORed: 
                      0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0
                    </p>
                  </div>
                </div>
              )}
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">One-Time Key</p>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded">
              <p className="font-mono text-sm text-purple-900 dark:text-purple-100 break-all">
                {key}
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

      {/* Security Information */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Key className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Perfect Security (Shannon's Theorem)
            </h4>
            <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <p>
                When used correctly, OTP provides <strong>perfect secrecy</strong>: 
                the ciphertext reveals absolutely no information about the plaintext.
              </p>
              <p className="font-semibold">Critical Requirements:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Key must be truly random (not pseudo-random)</li>
                <li>Key must be at least as long as the message</li>
                <li>Key must be used only once (NEVER reuse)</li>
                <li>Key must be kept completely secret</li>
              </ul>
              <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                ⚠️ Breaking any of these rules compromises security completely!
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
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Key Length</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {key.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">XOR Operations</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {xorOperations.length}
            </p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Security Level</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {keyValidation.lengthMatch && keyValidation.oneTimeUse ? 'Perfect' : 'Compromised'}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

OTPViz.propTypes = {
  visualization: PropTypes.shape({
    plaintext: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    ciphertext: PropTypes.string.isRequired,
    xorOperations: PropTypes.arrayOf(PropTypes.shape({
      plainChar: PropTypes.string.isRequired,
      keyChar: PropTypes.string.isRequired,
      cipherChar: PropTypes.string.isRequired,
    })).isRequired,
    keyValidation: PropTypes.shape({
      lengthMatch: PropTypes.bool.isRequired,
      isRandom: PropTypes.bool,
      oneTimeUse: PropTypes.bool.isRequired,
    }).isRequired,
    entropy: PropTypes.number,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default OTPViz;