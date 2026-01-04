// src/pages/modern/RSAPage.jsx

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Key, Lock, Unlock, Eye, EyeOff, Sparkles, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

// Import RSA algorithms
import {
  generateRSAKeyPair,
  rsaEncrypt,
  rsaDecrypt,
  getRSAVisualization,
  validateRSAParams,
  calculateKeyStrength,
  formatLargeNumber,
  exportKeyToPEM,
} from '../../utils/algorithms/modern/rsa.js';

const RSAPage = () => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [error, setError] = useState('');
  
  // Keys
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [keySize, setKeySize] = useState(512);
  const [useSmallPrimes, setUseSmallPrimes] = useState(true);
  
  // UI state
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(true);
  const [keysGenerated, setKeysGenerated] = useState(false);

  const { trackOperation, isTracking } = useCipherTracking();

  const handleGenerateKeys = () => {
    setError('');
    try {
      const keyPair = generateRSAKeyPair(keySize, useSmallPrimes);
      setPublicKey(keyPair.publicKey);
      setPrivateKey(keyPair.privateKey);
      setKeysGenerated(true);
      setResult('');
      setVisualization(null);
      
      // Show success message
      setTimeout(() => {
        alert(`Keys generated successfully!\nKey size: ${keyPair.keySize} bits`);
      }, 100);
    } catch (err) {
      setError(err.message);
      console.error('Key generation error:', err);
    }
  };

  const handleProcess = async () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    if (!keysGenerated) {
      setError('Please generate keys first');
      return;
    }

    const validation = validateRSAParams(
      inputText, 
      publicKey, 
      privateKey, 
      mode === 'encrypt'
    );
    
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = rsaEncrypt(inputText, publicKey);
        const viz = getRSAVisualization(inputText, publicKey, privateKey);
        setVisualization(viz);
      } else {
        output = rsaDecrypt(inputText, privateKey);
        setVisualization(null);
      }
      
      setResult(output);

      await trackOperation(
        'RSA',
        mode,
        startTime,
        inputText,
        output,
        { 
          keySize: privateKey?.keySize || keySize,
          publicExponent: publicKey?.e,
        }
      );

    } catch (err) {
      setError(err.message);
      console.error('RSA error:', err);
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

  const handleExportKeys = () => {
    const publicPEM = exportKeyToPEM(publicKey, true);
    const privatePEM = exportKeyToPEM(privateKey, false);
    
    const exportData = `RSA Key Pair Export
Generated: ${new Date().toISOString()}
Key Size: ${privateKey?.keySize || keySize} bits

${publicPEM}

${privatePEM}`;
    
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rsa-keys.pem';
    a.click();
    URL.revokeObjectURL(url);
  };

  const keyStrength = publicKey ? calculateKeyStrength(privateKey?.keySize || keySize) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              RSA Encryption
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Rivest-Shamir-Adleman - Asymmetric Public Key Cryptography
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Asymmetric Encryption:</strong> RSA uses two different keys - a public key for encryption 
            and a private key for decryption. The public key can be shared openly, while the private key must be kept secret.
          </p>
        </div>

        {/* Key Generation Panel */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Key Generation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Key Size Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Size (bits)
              </label>
              <select
                value={keySize}
                onChange={(e) => setKeySize(Number(e.target.value))}
                disabled={keysGenerated}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 disabled:opacity-50"
              >
                <option value={16}>16 bits (Demo - Very Fast)</option>
                <option value={512}>512 bits (Educational)</option>
                <option value={1024}>1024 bits (Weak)</option>
                <option value={2048}>2048 bits (Standard - Slow)</option>
              </select>
            </div>

            {/* Small Primes Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prime Generation
              </label>
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="checkbox"
                  checked={useSmallPrimes}
                  onChange={(e) => setUseSmallPrimes(e.target.checked)}
                  disabled={keysGenerated || keySize > 16}
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Use small primes (16-bit only, faster)
                </span>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex gap-3">
            <button
              onClick={handleGenerateKeys}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              {keysGenerated ? 'Regenerate Keys' : 'Generate Key Pair'}
            </button>
            
            {keysGenerated && (
              <button
                onClick={handleExportKeys}
                className="px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                title="Export Keys"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            )}
          </div>

          {/* Key Strength Indicator */}
          {keyStrength && keysGenerated && (
            <div className={`mt-4 p-3 rounded-lg border-2 bg-${keyStrength.color}-50 dark:bg-${keyStrength.color}-900/20 border-${keyStrength.color}-400 dark:border-${keyStrength.color}-600`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-5 h-5 text-${keyStrength.color}-600 dark:text-${keyStrength.color}-400`} />
                  <span className={`font-semibold text-${keyStrength.color}-800 dark:text-${keyStrength.color}-200`}>
                    Key Strength: {keyStrength.level}
                  </span>
                </div>
                <span className={`text-sm text-${keyStrength.color}-700 dark:text-${keyStrength.color}-300`}>
                  {keyStrength.score}/100
                </span>
              </div>
              <p className={`text-sm text-${keyStrength.color}-700 dark:text-${keyStrength.color}-300 mt-1`}>
                {keyStrength.description}
              </p>
            </div>
          )}

          {/* Display Keys */}
          {keysGenerated && (
            <div className="mt-6 space-y-4">
              {/* Public Key */}
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-300 dark:border-green-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Unlock className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Public Key (Share Freely)
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPublicKey(!showPublicKey)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPublicKey ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {showPublicKey && (
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">n (modulus): </span>
                      <span className="text-green-700 dark:text-green-300 break-all">
                        {formatLargeNumber(publicKey.n)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">e (exponent): </span>
                      <span className="text-green-700 dark:text-green-300">{publicKey.e}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Private Key */}
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Private Key (Keep Secret!)
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowPrivateKey(!showPrivateKey)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPrivateKey ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {showPrivateKey && (
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">n (modulus): </span>
                      <span className="text-red-700 dark:text-red-300 break-all">
                        {formatLargeNumber(privateKey.n)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">d (exponent): </span>
                      <span className="text-red-700 dark:text-red-300 break-all">
                        {formatLargeNumber(privateKey.d.substring(0, 100))}
                        {privateKey.d.length > 100 && '...'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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
                  className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    mode === 'encrypt'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  <Lock size={18} />
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    mode === 'decrypt'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                  }`}
                >
                  <Unlock size={18} />
                  Decrypt
                </button>
              </div>
            </div>

            {/* Key Used Notice */}
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-300 dark:border-indigo-700">
              <p className="text-xs text-indigo-900 dark:text-indigo-200">
                <strong>Using:</strong> {mode === 'encrypt' ? '🔓 Public Key (encrypt)' : '🔒 Private Key (decrypt)'}
              </p>
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

            {/* Warning for large messages */}
            {mode === 'encrypt' && inputText.length > 50 && (
              <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-600">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Long messages may fail with small keys. RSA encrypts limited data. 
                    Use hybrid encryption (RSA + AES) for large files.
                  </p>
                </div>
              </div>
            )}

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
                disabled={isTracking || !keysGenerated}
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

            {!keysGenerated && (
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-3 text-center">
                ⚠️ Generate keys first before encrypting/decrypting
              </p>
            )}
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
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm break-all"
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
                  <span className="text-gray-600 dark:text-gray-400">Plaintext Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.plaintext.length} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Plaintext Number:</span>
                  <span className="font-mono text-gray-900 dark:text-white text-xs break-all">
                    {visualization.plaintextNumber.substring(0, 30)}...
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ciphertext Hex:</span>
                  <span className="font-mono text-gray-900 dark:text-white text-xs">
                    {visualization.ciphertext.length} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key Size:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {visualization.keyInfo.keySize} bits
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Encryption Steps Visualization */}
        {visualization && visualization.steps && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              RSA Encryption Process
            </h2>
            
            <div className="space-y-3">
              {visualization.steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-50 dark:from-indigo-900/20 dark:to-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
                        {step.step}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {step.description}
                      </p>
                      {step.formula && (
                        <p className="text-xs font-mono text-indigo-700 dark:text-indigo-300 bg-white dark:bg-gray-800 p-2 rounded mb-2">
                          {step.formula}
                        </p>
                      )}
                      {step.value && (
                        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">
                          {step.value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About RSA */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About RSA Encryption
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How RSA Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How RSA Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Generate two large prime numbers (p and q)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Calculate n = p × q (modulus)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Calculate φ(n) = (p-1)(q-1)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Choose public exponent e (usually 65537)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Calculate private exponent d = e⁻¹ mod φ(n)</span>
                </li>
              </ul>
            </div>

            {/* Key Properties */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Key Properties
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Public Key:</span>
                  <span>(n, e) - Can be shared openly</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Private Key:</span>
                  <span>(n, d) - Must be kept secret</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Encryption:</span>
                  <span>c = mᵉ mod n</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Decryption:</span>
                  <span>m = cᵈ mod n</span>
                </li>
              </ul>
            </div>

            {/* Advantages */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Advantages
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>No need to share secret keys securely</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Enables digital signatures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Based on hard mathematical problem (factorization)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Foundation for PKI (Public Key Infrastructure)</span>
                </li>
              </ul>
            </div>

            {/* Limitations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Limitations
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Much slower than symmetric encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Can only encrypt limited data (key size)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Requires larger keys for equivalent security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Vulnerable to quantum computing (future threat)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RSA Formulas */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              RSA Mathematical Formulas
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">1. Key Generation:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  n = p × q<br/>
                  φ(n) = (p-1) × (q-1)<br/>
                  e: gcd(e, φ(n)) = 1<br/>
                  d: d × e ≡ 1 (mod φ(n))
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">2. Encryption:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  c = m<sup>e</sup> mod n
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Where c is ciphertext, m is plaintext message, e is public exponent, n is modulus
                </p>
              </div>
              
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">3. Decryption:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  m = c<sup>d</sup> mod n
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Where d is private exponent
                </p>
              </div>

              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">4. Correctness:</p>
                <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
                  (m<sup>e</sup>)<sup>d</sup> ≡ m (mod n)
                </p>
                <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                  Proof based on Euler's theorem
                </p>
              </div>
            </div>
          </div>

          {/* Security Considerations */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Considerations
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <strong className="text-yellow-700 dark:text-yellow-300">Key Size Recommendations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>16-512 bits: Educational only (easily broken)</li>
                  <li>1024 bits: Deprecated (factored in practice)</li>
                  <li>2048 bits: Minimum for production use</li>
                  <li>3072-4096 bits: Recommended for high security</li>
                </ul>
              </div>
              <div className="mt-3">
                <strong className="text-yellow-700 dark:text-yellow-300">Common Attacks:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Factorization:</strong> Finding p and q from n</li>
                  <li><strong>Timing attacks:</strong> Analyzing decryption time</li>
                  <li><strong>Small message attacks:</strong> When m<sup>e</sup> {'<'} n</li>
                  <li><strong>Common modulus:</strong> Using same n for multiple keys</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Real-World Use Cases
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <strong className="text-green-700 dark:text-green-300">1. Hybrid Encryption:</strong>
                <p>Use RSA to encrypt symmetric key (AES), then use AES for data</p>
              </div>
              <div>
                <strong className="text-green-700 dark:text-green-300">2. Digital Signatures:</strong>
                <p>Sign documents with private key, verify with public key</p>
              </div>
              <div>
                <strong className="text-green-700 dark:text-green-300">3. SSL/TLS:</strong>
                <p>Secure web connections (HTTPS) use RSA for key exchange</p>
              </div>
              <div>
                <strong className="text-green-700 dark:text-green-300">4. Email Encryption:</strong>
                <p>PGP/GPG use RSA for secure email communication</p>
              </div>
              <div>
                <strong className="text-green-700 dark:text-green-300">5. Cryptocurrency:</strong>
                <p>Bitcoin and blockchain use asymmetric cryptography principles</p>
              </div>
            </div>
          </div>

         {/* Comparison Table */}
<div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
    RSA vs Symmetric Encryption
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-purple-300 dark:border-purple-700">
          <th className="text-left p-2 text-gray-800 dark:text-white">Feature</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">RSA (Asymmetric)</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">AES/DES (Symmetric)</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Keys</td>
          <td className="p-2 text-gray-800 dark:text-white">Public + Private (2 keys)</td>
          <td className="p-2 text-gray-800 dark:text-white">Single shared key</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Speed</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Slow (100-1000x slower)</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Very fast</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Key Exchange</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Easy (share public key)</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Difficult (secure channel needed)</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Data Size</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Limited ({'<'} key size)</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Unlimited</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Key Size</td>
          <td className="p-2 text-gray-800 dark:text-white">2048-4096 bits</td>
          <td className="p-2 text-gray-800 dark:text-white">128-256 bits</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Use Case</td>
          <td className="p-2 text-gray-800 dark:text-white">Key exchange, signatures</td>
          <td className="p-2 text-gray-800 dark:text-white">Bulk data encryption</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Best Practice</td>
          <td className="p-2 text-green-600 dark:text-green-400" colSpan={2}>
            ✓ Use BOTH: RSA for key exchange + AES for data (Hybrid Encryption)
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

            {/* Historical Note */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> RSA was invented in 1977 
              by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT. It was one of the first practical public-key 
              cryptosystems and revolutionized secure communication. The algorithm's security relies on the computational 
              difficulty of factoring large integers. RSA became the foundation for modern public key infrastructure (PKI) 
              and secure internet communications. However, with the advent of quantum computing, researchers are developing 
              post-quantum cryptography alternatives like lattice-based and hash-based schemes.
            </p>
          </div>



        </div>
      </div>
    </div>
  );
};

export default RSAPage;