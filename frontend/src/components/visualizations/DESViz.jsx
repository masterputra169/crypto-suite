// ============================================
// src/components/visualizations/DESViz.jsx
// ============================================

import { useState } from 'prop-types';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Lock, Shuffle, Key as KeyIcon, Layers } from 'lucide-react';

const DESViz = ({ visualization, mode = 'encrypt' }) => {
  const [selectedRound, setSelectedRound] = useState(null);

  if (!visualization) return null;

  const { rounds, keys, initialPermutation, finalPermutation, plaintext, ciphertext } = visualization;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              DES Algorithm Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data Encryption Standard - 16 rounds of Feistel network
            </p>
          </div>
          <Badge variant="warning">56-bit Key</Badge>
        </div>
      </Card>

      {/* Initial Permutation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Initial Permutation (IP)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Input (64-bit)</p>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded font-mono text-xs break-all">
              {plaintext}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">After IP</p>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded font-mono text-xs break-all">
              {initialPermutation}
            </div>
          </div>
        </div>
      </Card>

      {/* 16 Rounds */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          16 Feistel Rounds
        </h3>
        <div className="space-y-3">
          {rounds && rounds.map((round, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                selectedRound === idx
                  ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-400 ring-2 ring-orange-300'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedRound(selectedRound === idx ? null : idx)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center bg-orange-500 text-white font-bold rounded-full">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Round {idx + 1}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Key: {keys[idx]?.substring(0, 16)}...
                    </p>
                  </div>
                </div>
                <Badge variant="primary" size="sm">
                  {selectedRound === idx ? 'Collapse' : 'Expand'}
                </Badge>
              </div>

              {selectedRound === idx && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Left Half (L)</p>
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded font-mono text-xs">
                        {round.leftHalf}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-1">Right Half (R)</p>
                      <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded font-mono text-xs">
                        {round.rightHalf}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1 text-sm">F-Function Output</p>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded font-mono text-xs">
                      {round.fOutput}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Final Result */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Final Output
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">After Rounds</p>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded font-mono text-sm">
              {finalPermutation}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Ciphertext (64-bit)</p>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded font-mono text-sm font-bold">
              {ciphertext}
            </div>
          </div>
        </div>
      </Card>

      {/* Info */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">DES Process:</p>
            <p>1. Initial Permutation (IP)</p>
            <p>2. 16 Feistel Rounds with subkeys</p>
            <p>3. Final Permutation (FP = IP⁻¹)</p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
              Note: DES is now considered insecure due to 56-bit key size
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

DESViz.propTypes = {
  visualization: PropTypes.shape({
    rounds: PropTypes.arrayOf(PropTypes.shape({
      leftHalf: PropTypes.string,
      rightHalf: PropTypes.string,
      fOutput: PropTypes.string,
    })),
    keys: PropTypes.arrayOf(PropTypes.string),
    initialPermutation: PropTypes.string,
    finalPermutation: PropTypes.string,
    plaintext: PropTypes.string,
    ciphertext: PropTypes.string,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default DESViz;