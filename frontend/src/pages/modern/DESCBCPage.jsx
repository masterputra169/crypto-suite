// src/pages/modern/DESCBCPage.jsx

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Shield, Eye, EyeOff, Sparkles, Link2, AlertTriangle } from 'lucide-react';

// Import DES CBC algorithms
import {
  desCBCEncrypt,
  desCBCDecrypt,
  getDESCBCVisualization,
  generateRandomKey,
  generateRandomIV,
  validateDESCBCParams,
} from '../../utils/algorithms/modern/desCBC.js';

const DESCBCPage = () => {
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('133457799BBCDFF1');
  const [iv, setIV] = useState('0123456789ABCDEF');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [showIV, setShowIV] = useState(true);
  const [error, setError] = useState('');

  const { trackOperation, isTracking } = useCipherTracking();

  const handleGenerateKey = () => {
    const newKey = generateRandomKey();
    setKey(newKey);
    setError('');
  };

  const handleGenerateIV = () => {
    const newIV = generateRandomIV();
    setIV(newIV);
    setError('');
  };

  const handleProcess = async () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const validation = validateDESCBCParams(inputText, key, iv);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = desCBCEncrypt(inputText, key, iv);
        const viz = getDESCBCVisualization(inputText, key, iv);
        setVisualization(viz);
      } else {
        output = desCBCDecrypt(inputText, key, iv);
        setVisualization(null);
      }
      
      setResult(output);

      await trackOperation(
        'DES CBC',
        mode,
        startTime,
        inputText,
        output,
        { key, iv, mode: 'CBC', blockSize: 64 }
      );

    } catch (err) {
      setError(err.message);
      console.error('DES CBC error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult('');
    setVisualization(null);
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
              DES CBC Mode
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Data Encryption Standard - Cipher Block Chaining Mode
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>CBC Mode:</strong> Each plaintext block is XORed with the previous ciphertext block before encryption. 
            Uses an Initialization Vector (IV) for the first block. Provides better security than ECB mode.
          </p>
        </div>

        {/* Security Warning */}
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                ⚠️ Security Warning: DES is Deprecated
              </p>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• DES uses only 56-bit effective key length - vulnerable to brute force</li>
                <li>• Consider <strong>broken by modern standards</strong> - cracked in hours</li>
                <li>• Use <strong>AES-256</strong> for production systems</li>
                <li>• For educational purposes only - understand block cipher modes</li>
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

            {/* IV Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                IV - Initialization Vector (16 hex chars)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showIV ? 'text' : 'password'}
                    value={iv}
                    onChange={(e) => setIV(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').substr(0, 16))}
                    placeholder="0123456789ABCDEF"
                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                  />
                  <button
                    onClick={() => setShowIV(!showIV)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showIV ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <button
                  onClick={handleGenerateIV}
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition flex items-center gap-2"
                  title="Generate Random IV"
                >
                  <Sparkles size={18} />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {iv.length}/16 characters
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
                  <span className="text-gray-600 dark:text-gray-400">Block Size:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    64 bits (8 bytes)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    CBC (Cipher Block Chaining)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Block Processing Visualization */}
        {visualization && visualization.blocks && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                CBC Block Processing
              </h2>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                In CBC mode, each plaintext block is XORed with the previous ciphertext block before encryption. 
                The first block uses the IV (Initialization Vector).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border-2 border-indigo-700 px-3 py-2">Block</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Plaintext</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Plain Hex</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Previous Cipher/IV</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">XOR Result</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Cipher Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.blocks.map((block) => (
                    <tr key={block.blockNumber} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {block.blockNumber}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-900 dark:text-white">
                        {block.plainBlock.split('').map((c, i) => (
                          <span key={i} className="inline-block" title={`Byte ${i + 1}`}>
                            {c === ' ' ? '·' : c}
                          </span>
                        ))}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-blue-600 dark:text-blue-400">
                        {block.plainHex}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-indigo-600 dark:text-indigo-400">
                        {block.previousCipher}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-orange-600 dark:text-orange-400">
                        {block.xorResult}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-green-600 dark:text-green-400">
                        {block.cipherBlock}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visualization.totalBlocks > 10 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing first 10 of {visualization.totalBlocks} blocks
              </p>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <strong>CBC Encryption Process:</strong>
              </p>
              <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                <li>XOR plaintext block with previous ciphertext (or IV for first block)</li>
                <li>Encrypt the XOR result using DES algorithm</li>
                <li>Output becomes the ciphertext block and is used for next block</li>
              </ol>
            </div>
          </div>
        )}

        {/* About DES CBC */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About DES CBC Mode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How CBC Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Each plaintext block is XORed with previous ciphertext</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Uses Initialization Vector (IV) for first block</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Creates dependency chain between blocks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Same plaintext produces different ciphertext with different IV</span>
                </li>
              </ul>
            </div>

            {/* DES Specifications */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                DES Specifications
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Block Size:</span>
                  <span>64 bits (8 bytes)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Key Size:</span>
                  <span>56 bits effective (64 bits with parity)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Rounds:</span>
                  <span>16 Feistel rounds</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Structure:</span>
                  <span>Feistel network with S-boxes and permutations</span>
                </li>
              </ul>
            </div>

            {/* Advantages of CBC */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                CBC Advantages
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Identical plaintext blocks produce different ciphertext</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>More secure than ECB mode</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Self-synchronizing (error recovery)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Widely supported and understood</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Weaknesses & Limitations
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>DES key too short (56 bits) - vulnerable to brute force</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Cannot be parallelized (sequential encryption)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Error propagation - one bit error affects two blocks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Padding oracle attacks possible if not implemented carefully</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CBC Formula */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              CBC Mode Formulas
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Encryption:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  C₀ = IV<br/>
                  Cᵢ = E<sub>K</sub>(Pᵢ ⊕ Cᵢ₋₁)
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Where D<sub>K</sub> is DES decryption with key K
                </p>
              </div>
            </div>
          </div>


          {/* Modern Alternatives */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Modern Alternatives (Use These Instead!)
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div>
                <strong className="text-green-600 dark:text-green-400">AES-256 (CBC or GCM):</strong>
                <p>Industry standard with 256-bit keys - secure and efficient</p>
              </div>
              <div>
                <strong className="text-green-600 dark:text-green-400">ChaCha20-Poly1305:</strong>
                <p>Modern stream cipher with authentication - fast on mobile devices</p>
              </div>
              <div>
                <strong className="text-green-600 dark:text-green-400">AES-GCM:</strong>
                <p>Authenticated encryption mode - prevents tampering</p>
              </div>
            </div>
          </div>

              {/* Historical Context */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> DES was adopted as a federal standard in 1977 
              and was widely used for decades. CBC mode was introduced to address ECB's weaknesses. However, DES was officially 
              retired by NIST in 2005 due to its small key size. Triple DES (3DES) was used as a transitional solution, 
              but AES has become the modern standard since 2001.
            </p>
          </div>



        </div>
      </div>
    </div>
  );
};

export default DESCBCPage;