
// src/components/visualizations/RSAViz.jsx
// ============================================

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Key, Lock, Unlock, Shield } from 'lucide-react';

const RSAViz = ({ visualization, mode = 'encrypt' }) => {
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  if (!visualization) return null;

  const { 
    publicKey, 
    privateKey, 
    primes, 
    n, 
    phi, 
    message, 
    encrypted, 
    blocks 
  } = visualization;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg">
            <Key className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              RSA Encryption Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Asymmetric encryption using public/private key pairs
            </p>
          </div>
          <Badge variant="primary">Asymmetric</Badge>
        </div>
      </Card>

      {/* Key Generation */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Key Generation Parameters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prime Numbers */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Prime Selection
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Prime p:</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                  {primes?.p}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Prime q:</span>
                <span className="font-mono font-bold text-purple-700 dark:text-purple-300">
                  {primes?.q}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">n = p × q:</span>
                <span className="font-mono font-bold text-indigo-700 dark:text-indigo-300">
                  {n}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">φ(n):</span>
                <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                  {phi}
                </span>
              </div>
            </div>
          </div>

          {/* Keys */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated Keys
            </h4>
            
            {/* Public Key */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-green-600" />
                <h5 className="font-semibold text-green-900 dark:text-green-100">
                  Public Key
                </h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">e (exponent):</span>
                  <span className="font-mono font-bold text-green-700 dark:text-green-300">
                    {publicKey?.e}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">n (modulus):</span>
                  <span className="font-mono font-bold text-green-700 dark:text-green-300">
                    {publicKey?.n}
                  </span>
                </div>
              </div>
            </div>

            {/* Private Key */}
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Unlock className="w-4 h-4 text-red-600" />
                  <h5 className="font-semibold text-red-900 dark:text-red-100">
                    Private Key
                  </h5>
                </div>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded transition-colors"
                >
                  {showPrivateKey ? 'Hide' : 'Show'}
                </button>
              </div>
              {showPrivateKey ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">d (exponent):</span>
                    <span className="font-mono font-bold text-red-700 dark:text-red-300">
                      {privateKey?.d}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">n (modulus):</span>
                    <span className="font-mono font-bold text-red-700 dark:text-red-300">
                      {privateKey?.n}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-700 dark:text-red-300">
                  🔒 Private key hidden for security
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Encryption Process */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {mode === 'encrypt' ? 'Encryption' : 'Decryption'} Process
        </h3>

        <div className="space-y-4">
          {/* Message Blocks */}
          {blocks && blocks.map((block, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="primary" size="sm">Block {idx + 1}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Input (m)</p>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded font-mono">
                    {block.input}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Formula</p>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded font-mono text-xs">
                    c = m^{mode === 'encrypt' ? publicKey?.e : privateKey?.d} mod {n}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">Output (c)</p>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded font-mono">
                    {block.output}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Result */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Final Result
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Original Message</p>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded">
              <p className="font-mono text-sm text-blue-900 dark:text-blue-100 break-all">
                {message}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Encrypted</p>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded">
              <p className="font-mono text-sm text-green-900 dark:text-green-100 break-all">
                {encrypted}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-2">RSA Security:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Based on difficulty of factoring large numbers</li>
              <li>Public key can be shared freely</li>
              <li>Private key must be kept secret</li>
              <li>Recommended key size: 2048+ bits for modern security</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

RSAViz.propTypes = {
  visualization: PropTypes.shape({
    publicKey: PropTypes.shape({
      e: PropTypes.number,
      n: PropTypes.number,
    }),
    privateKey: PropTypes.shape({
      d: PropTypes.number,
      n: PropTypes.number,
    }),
    primes: PropTypes.shape({
      p: PropTypes.number,
      q: PropTypes.number,
    }),
    n: PropTypes.number,
    phi: PropTypes.number,
    message: PropTypes.string,
    encrypted: PropTypes.string,
    blocks: PropTypes.arrayOf(PropTypes.shape({
      input: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      output: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default RSAViz;