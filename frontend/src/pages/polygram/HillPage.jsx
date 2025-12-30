// src/pages/polygram/HillPage.jsx - WITH COMPLETE TRACKING

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Grid3x3, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { 
  hillEncrypt, 
  hillDecrypt, 
  validateHillKey, 
  getHillVisualization,
  generateRandomHillKey 
} from '../../utils/algorithms/polygram/hillCipher';

const HillPage = () => {
  const [inputText, setInputText] = useState('');
  const [keyMatrix, setKeyMatrix] = useState('6,24,1,13,16,10,20,17,15'); // Example 3x3 key
  const [matrixSize, setMatrixSize] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [error, setError] = useState('');

  // ✅ USE CIPHER TRACKING HOOK
  const { trackOperation, isTracking } = useCipherTracking();

  // Update key matrix when size changes
  const handleMatrixSizeChange = (size) => {
    setMatrixSize(size);
    // Auto-generate valid key for new size
    try {
      const randomMatrix = generateRandomHillKey(size);
      const flatMatrix = randomMatrix.flat().join(',');
      setKeyMatrix(flatMatrix);
    } catch (err) {
      console.error('Failed to generate key for size', size);
    }
  };

  const parseKeyMatrix = (keyStr) => {
    const numbers = keyStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const size = Math.sqrt(numbers.length);
    if (size !== Math.floor(size)) return null;
    
    const matrix = [];
    for (let i = 0; i < size; i++) {
      matrix.push(numbers.slice(i * size, (i + 1) * size));
    }
    return matrix;
  };

  const handleProcess = async () => {  // ← ADD async
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const matrix = parseKeyMatrix(keyMatrix);
    if (!matrix) {
      setError('Invalid key matrix format. Use comma-separated numbers.');
      return;
    }

    if (matrix.length !== matrixSize) {
      setError(`Matrix size mismatch. Expected ${matrixSize}x${matrixSize} matrix.`);
      return;
    }

    // Validate matrix
    const validation = validateHillKey(matrix);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // ✅ START TIMING
    const startTime = performance.now();

    try {
      let output;
      
      if (mode === 'encrypt') {
        output = hillEncrypt(inputText, matrix);
      } else {
        output = hillDecrypt(inputText, matrix);
      }
      
      setResult(output);
      
      // Create visualization
      const viz = getHillVisualization(inputText, matrix);
      setVisualization(viz);

      // ✅ TRACK OPERATION WITH FULL DATA
      await trackOperation(
        'Hill Cipher',            // cipher type
        mode,                     // operation
        startTime,                // timing
        inputText,                // input
        output,                   // output
        { 
          matrix: keyMatrix,      // store matrix as string
          size: matrixSize        // store matrix size
        }
      );
      
    } catch (err) {
      setError(err.message);
      console.error('Hill cipher error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setResult('');
    setVisualization(null);
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const handleGenerateRandomKey = () => {
    try {
      const randomMatrix = generateRandomHillKey(matrixSize);
      const flatMatrix = randomMatrix.flat().join(',');
      setKeyMatrix(flatMatrix);
    } catch (err) {
      setError('Failed to generate random key');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Grid3x3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Hill Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Matrix-based polygraphic substitution cipher
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> The Hill cipher uses matrix multiplication to encrypt blocks of letters. 
            Matrix must be square (2×2, 3×3, or 4×4) and invertible mod 26 for decryption to work.
          </p>
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
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300'
                  }`}
                >
                  Decrypt
                </button>
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encrypt' ? 'Enter text to encrypt...' : 'Enter text to decrypt...'}
                className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {inputText.replace(/[^A-Z]/gi, '').length} characters (letters only)
              </p>
            </div>

            {/* Matrix Size Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Matrix Size
              </label>
              <div className="flex gap-3">
                {[2, 3, 4].map(size => (
                  <button
                    key={size}
                    onClick={() => handleMatrixSizeChange(size)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      matrixSize === size
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300'
                    }`}
                  >
                    {size}×{size}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Matrix Input */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Key Matrix ({matrixSize}×{matrixSize})
                </label>
                <button
                  onClick={handleGenerateRandomKey}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Generate Random
                </button>
              </div>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={keyMatrix}
                  onChange={(e) => setKeyMatrix(e.target.value)}
                  placeholder="Enter comma-separated numbers (e.g., 6,24,1,13,16,10,20,17,15)"
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Requires {matrixSize * matrixSize} numbers separated by commas
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Buttons - ✅ WITH TRACKING STATE */}
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
                {mode === 'encrypt' ? 'Ciphertext' : 'Plaintext'}
              </label>
              <div className="relative">
                <textarea
                  value={result}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                />
                {result && (
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Statistics */}
            {result && (
              <div className="space-y-3 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Statistics
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Input Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {inputText.replace(/[^A-Z]/gi, '').length} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Output Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {result.length} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Matrix Size:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {matrixSize}×{matrixSize}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Blocks Processed:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization?.steps?.length || 0}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Key Matrix Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Key Matrix ({matrixSize}×{matrixSize})
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Encryption Key Matrix */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Encryption Matrix
                </h3>
                <div className="overflow-x-auto flex justify-center">
                  <table className="border-collapse">
                    <tbody>
                      {visualization.keyMatrix.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {row.map((cell, colIdx) => (
                            <td
                              key={colIdx}
                              className="w-20 h-20 border-2 border-indigo-300 dark:border-indigo-600 text-center text-xl font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Decryption Key Matrix (Inverse) */}
              {visualization.inverseMatrix && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Decryption Matrix (Inverse)
                  </h3>
                  <div className="overflow-x-auto flex justify-center">
                    <table className="border-collapse">
                      <tbody>
                        {visualization.inverseMatrix.map((row, rowIdx) => (
                          <tr key={rowIdx}>
                            {row.map((cell, colIdx) => (
                              <td
                                key={colIdx}
                                className="w-20 h-20 border-2 border-green-300 dark:border-green-600 text-center text-xl font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-gray-700"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Matrix:</strong> This {matrixSize}×{matrixSize} matrix is used to multiply each block of {matrixSize} letters.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Formula:</strong> C = (K × P) mod 26, where K is the key matrix and P is the plaintext vector.
              </p>
              {visualization.validation && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  <strong>Validation:</strong> {visualization.validation.message}
                  {visualization.validation.determinant && (
                    <span> (det = {visualization.validation.determinant}, det⁻¹ = {visualization.validation.inverse})</span>
                  )}
                </p>
              )}
            </div>
          </div>
        )}

        {/* About Hill Cipher */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Hill Cipher
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How it Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Treats letters as numbers (A=0, B=1, ..., Z=25)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Groups plaintext into blocks (size = matrix size)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Multiplies each block by the key matrix</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Takes result modulo 26 to get ciphertext</span>
                </li>
              </ul>
            </div>

            {/* Matrix Requirements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Matrix Requirements
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Square:</span>
                  <span>Matrix must be square (n×n)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Non-zero:</span>
                  <span>Determinant must be non-zero</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Coprime:</span>
                  <span>Determinant must be coprime with 26</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Invertible:</span>
                  <span>Matrix must be invertible mod 26</span>
                </li>
              </ul>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Strengths
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Completely hides single-letter frequencies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Resistant to frequency analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Based on solid mathematical foundation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Scalable key size (larger matrices = more secure)</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Weaknesses
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Vulnerable to known-plaintext attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Linear structure can be exploited</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Key management complexity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Requires careful matrix selection</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mathematical Formula */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Mathematical Formula
            </h3>
            <div className="space-y-2 font-mono text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Encryption:</strong> C = (K × P) mod 26</p>
              <p><strong>Decryption:</strong> P = (K⁻¹ × C) mod 26</p>
              <p className="text-xs mt-2 font-sans">
                Where K is the key matrix, P is plaintext vector, C is ciphertext vector, and K⁻¹ is the modular inverse of the key matrix.
              </p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Hill cipher was invented by Lester S. Hill in 1929. 
              It was the first polygraphic cipher that was practical to operate on more than three symbols at once. 
              Hill's cipher was a breakthrough because it could encrypt blocks of letters simultaneously using linear algebra. 
              While vulnerable to known-plaintext attacks, it paved the way for modern block ciphers and demonstrated the power of mathematical cryptography.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HillPage;