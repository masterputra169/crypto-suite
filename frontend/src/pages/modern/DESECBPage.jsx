// src/pages/modern/DESECBPage.jsx

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Shield, Eye, EyeOff, Sparkles, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

// Import DES ECB algorithms
import {
  desECBEncrypt,
  desECBDecrypt,
  getDESECBVisualization,
  generateRandomKey,
  validateDESECBParams,
  compareECBvsCBC,
} from '../../utils/algorithms/modern/desECB.js';

const DESECBPage = () => {
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('133457799BBCDFF1');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [error, setError] = useState('');
  const [comparison, setComparison] = useState(null);

  const { trackOperation, isTracking } = useCipherTracking();

  const handleGenerateKey = () => {
    const newKey = generateRandomKey();
    setKey(newKey);
    setError('');
  };

  const handleProcess = async () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const validation = validateDESECBParams(inputText, key);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = desECBEncrypt(inputText, key);
        const viz = getDESECBVisualization(inputText, key);
        setVisualization(viz);
        
        // Generate comparison
        const comp = compareECBvsCBC(inputText);
        setComparison(comp);
      } else {
        output = desECBDecrypt(inputText, key);
        setVisualization(null);
        setComparison(null);
      }
      
      setResult(output);

      await trackOperation(
        'DES ECB',
        mode,
        startTime,
        inputText,
        output,
        { key, mode: 'ECB', blockSize: 64 }
      );

    } catch (err) {
      setError(err.message);
      console.error('DES ECB error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult('');
    setVisualization(null);
    setComparison(null);
    setError('');
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              DES ECB Mode
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Data Encryption Standard - Electronic Codebook Mode
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>ECB Mode:</strong> Simplest block cipher mode where each block is encrypted independently. 
            No IV needed, but identical plaintext blocks produce identical ciphertext blocks.
          </p>
        </div>

        {/* CRITICAL Security Warning */}
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 rounded-lg border-2 border-red-500 dark:border-red-600">
          <div className="flex items-start gap-3">
            <XCircle className="w-7 h-7 text-red-700 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-900 dark:text-red-100 mb-2">
                🚨 CRITICAL: ECB Mode is NOT Secure!
              </p>
              <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
                <li>• <strong>NEVER use ECB in production!</strong> Patterns in plaintext leak into ciphertext</li>
                <li>• Same plaintext block → Same ciphertext block (serious vulnerability!)</li>
                <li>• Famous "ECB Penguin" demonstrates visual pattern leakage</li>
                <li>• <strong>Use CBC, CTR, or GCM modes instead</strong></li>
                <li>• Educational purposes only - understand why ECB fails</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Input Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Input
            </h2>

            {/* Mode Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode('encrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'encrypt'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext (Hex)'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter hex string to decrypt...'}
                className={`w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition ${
                  mode === 'decrypt' ? 'font-mono text-sm' : ''
                }`}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {mode === 'encrypt' 
                  ? `${inputText.length} characters`
                  : `${inputText.length} hex characters`
                }
              </p>
            </div>

            {/* Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key (16 hex chars = 64 bits)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').substr(0, 16))}
                    placeholder="133457799BBCDFF1"
                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  onClick={handleGenerateKey}
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2"
                  title="Generate Random Key"
                >
                  <Sparkles size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {key.length}/16 characters
              </p>
            </div>

            {/* ECB Notice */}
            <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-300 dark:border-orange-600">
              <p className="text-xs text-orange-900 dark:text-orange-200">
                <strong>Note:</strong> ECB mode does NOT use an IV (Initialization Vector). 
                Each block is encrypted independently, which is why it's insecure.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleProcess}
                disabled={isTracking}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTracking ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt' : 'Decrypt')}
              </button>
              <button
                onClick={handleReset}
                className="px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Output
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'encrypt' ? 'Ciphertext (Hex)' : 'Plaintext'}
              </label>
              <div className="relative">
                <textarea
                  value={result}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                {result && (
                  <button
                    onClick={() => handleCopy(result)}
                    className="absolute top-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Statistics */}
            {result && visualization && (
              <div className="space-y-3 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Statistics
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Original Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.plaintext.length} bytes
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Padded Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.paddedText.length} bytes
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Total Blocks:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.totalBlocks} blocks
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Unique Plain Blocks:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.statistics.uniquePlainBlocks}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pattern Leakage:</span>
                  <span className={`font-semibold ${
                    visualization.statistics.patternLeakage > 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-green-600 dark:text-green-400'
                  }`}>
                    {visualization.statistics.patternLeakage} blocks ({visualization.statistics.leakagePercentage}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    ECB (Insecure!)
                  </span>
                </div>
              </div>
            )}

            {/* Pattern Warning */}
            {visualization && visualization.statistics.patternLeakage > 0 && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-400 dark:border-red-600">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <strong>Pattern Detected!</strong> {visualization.statistics.patternLeakage} duplicate blocks found. 
                    In ECB mode, identical plaintext produces identical ciphertext, revealing patterns!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Block Processing Visualization */}
        {visualization && visualization.blocks && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                ECB Block Processing (Independent Blocks)
              </h2>
            </div>
            
            <div className="mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm text-orange-900 dark:text-orange-200">
                <strong>ECB Weakness:</strong> Each block is encrypted independently. 
                Watch for duplicate plaintext blocks producing identical ciphertext blocks!
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border-2 border-indigo-700 px-3 py-2">Block</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Plaintext</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Plain Hex</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Cipher Hex</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.blocks.map((block) => (
                    <tr 
                      key={block.blockNumber} 
                      className={`${
                        block.isDuplicate 
                          ? 'bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30' 
                          : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                      }`}
                    >
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {block.blockNumber}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-900 dark:text-white">
                        {block.plainBlock.split('').map((c, i) => (
                          <span key={i} className="inline-block">
                            {c === ' ' ? '·' : c}
                          </span>
                        ))}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-blue-600 dark:text-blue-400">
                        {block.plainHex}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-green-600 dark:text-green-400">
                        {block.cipherBlock}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center">
                        {block.isDuplicate ? (
                          <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                            <XCircle size={14} />
                            Duplicate of #{block.duplicateOf}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle size={14} />
                            Unique
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visualization.totalBlocks > 20 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing first 20 of {visualization.totalBlocks} blocks
              </p>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>ECB Encryption Process:</strong>
              </p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>Split plaintext into 64-bit (8-byte) blocks</li>
                <li>Encrypt each block independently with DES</li>
                <li>Concatenate all ciphertext blocks</li>
                <li><strong className="text-red-600 dark:text-red-400">NO chaining or IV - each block is independent!</strong></li>
              </ol>
            </div>
          </div>
        )}

        {/* ECB vs CBC Comparison */}
        {comparison && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Pattern Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Blocks</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {comparison.totalBlocks}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Unique Blocks</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {comparison.uniqueBlocks}
                </p>
              </div>
              
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Duplicate Blocks</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {comparison.duplicateBlocks}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-600">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                ECB Weakness Analysis:
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {comparison.ecbWeakness}
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-2">
                <strong>Recommendation:</strong> {comparison.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* About DES ECB */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About DES ECB Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How ECB Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How ECB Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Each plaintext block encrypted independently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>No chaining between blocks (unlike CBC)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>No Initialization Vector (IV) needed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Simplest block cipher mode to implement</span>
                </li>
              </ul>
            </div>

            {/* Advantages */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Advantages (Limited!)
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Simple to implement - no IV management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Parallelizable - blocks can be encrypted simultaneously</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Random access - can decrypt any block independently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>No error propagation between blocks</span>
                </li>
              </ul>
            </div>

            {/* Critical Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Critical Weaknesses
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span><strong>Identical blocks reveal patterns</strong> - major flaw!</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Visual patterns leak (ECB Penguin problem)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Vulnerable to substitution attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Not semantically secure</span>
                </li>
              </ul>
            </div>

            {/* When to Use (NEVER!) */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                When to Use ECB?
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span><strong>NEVER for general encryption!</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 dark:text-orange-400 mr-2">⚠</span>
                  <span>Only for random keys (one-time use)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 dark:text-orange-400 mr-2">⚠</span>
                  <span>Only for educational/demonstration purposes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Use CBC, CTR, or GCM modes instead!</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ECB Formula */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              ECB Mode Formula
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Encryption:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  Cᵢ = E<sub>K</sub>(Pᵢ)
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Each ciphertext block is simply the encryption of the corresponding plaintext block
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Decryption:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  Pᵢ = D<sub>K</sub>(Cᵢ)
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Each plaintext block is the decryption of the corresponding ciphertext block
                </p>
              </div>

              <div>
                <p className="font-semibold text-red-600 dark:text-red-400 mb-1">Critical Problem:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  If P₁ = P₂, then C₁ = C₂
                </p>
                <p className="text-xs mt-1 text-red-600 dark:text-red-400">
                  Identical plaintext blocks produce identical ciphertext blocks - revealing patterns!
                </p>
              </div>
            </div>
          </div>

          {/* ECB Penguin Example */}
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Famous Example: The ECB Penguin
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              When encrypting images with ECB mode, the visual patterns remain visible in the ciphertext! 
              The famous "ECB Penguin" demonstrates this:
            </p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
              <li>Original image: Clear penguin</li>
              <li>ECB encrypted: Penguin shape still visible! (patterns leak)</li>
              <li>CBC encrypted: Complete noise (patterns hidden)</li>
            </ul>
            <p className="text-sm text-red-700 dark:text-red-300 mt-3 font-semibold">
              This is why ECB should NEVER be used for encrypting structured data!
            </p>
          </div>

         {/* Comparison Table */}
<div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
    ECB vs CBC Comparison
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-purple-300 dark:border-purple-700">
          <th className="text-left p-2 text-gray-800 dark:text-white">Feature</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">ECB Mode</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">CBC Mode</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Block Independence</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Yes (each block separate)</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ No (chained blocks)</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">IV Required</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ No</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Yes</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Pattern Leakage</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Yes (MAJOR flaw!)</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ No</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Parallelizable</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Yes</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ No (sequential)</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Error Propagation</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ None (isolated blocks)</td>
          <td className="p-2 text-yellow-600 dark:text-yellow-400">⚠ Yes (2 blocks affected)</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Security</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Weak (NOT recommended)</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Strong (recommended)</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Use Case</td>
          <td className="p-2 text-gray-800 dark:text-white">Educational only</td>
          <td className="p-2 text-gray-800 dark:text-white">Production (with strong cipher)</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>


          {/* Security Recommendation */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              ✅ Use These Instead of ECB:
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div>
                <strong className="text-green-600 dark:text-green-400">CBC (Cipher Block Chaining):</strong>
                <p>Chains blocks together with XOR, uses IV - secure for most applications</p>
              </div>
              <div>
                <strong className="text-green-600 dark:text-green-400">CTR (Counter Mode):</strong>
                <p>Turns block cipher into stream cipher - parallelizable and secure</p>
              </div>
              <div>
                <strong className="text-green-600 dark:text-green-400">GCM (Galois/Counter Mode):</strong>
                <p>Provides both encryption and authentication - modern standard</p>
              </div>
              <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600">
                <p className="font-bold text-green-700 dark:text-green-300">
                  💡 Best Practice: Use AES-256 with GCM mode for modern applications!
                </p>
              </div>
            </div>
          </div>


            {/* Historical Note */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> ECB was the first and simplest 
              block cipher mode defined. While it has legitimate uses for encrypting random data (like keys), its weakness 
              with structured data was recognized early. The famous "ECB Penguin" image demonstration made this weakness 
              visually clear to everyone. Today, ECB is primarily used for educational purposes to teach <em>why</em> proper 
              cipher modes (like CBC, CTR, GCM) are necessary.
            </p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default DESECBPage;