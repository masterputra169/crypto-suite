// src/pages/polygram/PlayfairPage.jsx - WITH COMPLETE TRACKING

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Grid3x3, Eye, EyeOff } from 'lucide-react';

// Import algorithms
import {
  playfairEncrypt,
  playfairDecrypt,
  getPlayfairVisualization
} from '../../utils/algorithms/index.js';

const PlayfairPage = () => {
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKeyword, setShowKeyword] = useState(true);
  const [error, setError] = useState('');

  // ✅ USE CIPHER TRACKING HOOK
  const { trackOperation, isTracking } = useCipherTracking();

  const validateKeyword = (key) => {
    if (!key || key.length < 3) {
      return 'Keyword must be at least 3 characters long';
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      return 'Keyword must contain only letters (A-Z)';
    }
    return null;
  };

  const handleProcess = async () => {  // ← ADD async
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const keywordError = validateKeyword(keyword);
    if (keywordError) {
      setError(keywordError);
      return;
    }

    // ✅ START TIMING
    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = playfairEncrypt(inputText, keyword);
      } else {
        output = playfairDecrypt(inputText, keyword);
      }
      
      setResult(output);
      setVisualization(getPlayfairVisualization(inputText, keyword));

      // ✅ TRACK OPERATION WITH FULL DATA
      await trackOperation(
        'Playfair Cipher',        // cipher type
        mode,                     // operation
        startTime,                // timing
        inputText,                // input
        output,                   // output
        { key: keyword }          // key data
      );

    } catch (err) {
      setError(err.message);
      console.error('Playfair cipher error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setKeyword('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Grid3x3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Playfair Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            5×5 grid cipher encrypting letter pairs (digraphs)
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> The Playfair cipher encrypts pairs of letters using a 5×5 grid. 
            I and J are combined into one cell. Double letters are separated with X.
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

            {/* Keyword Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Keyword
              </label>
              <div className="relative">
                <input
                  type={showKeyword ? 'text' : 'password'}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter keyword (letters only)..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                />
                <button
                  onClick={() => setShowKeyword(!showKeyword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showKeyword ? 'Hide keyword' : 'Show keyword'}
                >
                  {showKeyword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {keyword.length} characters - Only letters A-Z allowed
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
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
                  <span className="text-gray-600 dark:text-gray-400">Keyword:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {keyword.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Playfair Grid Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              5×5 Playfair Grid
            </h2>
            
            <div className="overflow-x-auto">
              <table className="mx-auto border-collapse">
                <tbody>
                  {visualization.grid.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className="w-16 h-16 border-2 border-indigo-300 dark:border-indigo-600 text-center text-2xl font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-gray-700"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Keyword:</strong> {visualization.keyword}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>How it works:</strong> The keyword is used to fill the 5×5 grid, with I and J sharing the same cell. 
                Text is encrypted in pairs (digraphs) using the grid positions.
              </p>
            </div>
          </div>
        )}

        {/* About Playfair Cipher */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Playfair Cipher
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
                  <span>Creates a 5×5 grid using the keyword</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Combines I and J into one cell</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Encrypts pairs of letters (digraphs)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Uses three rules based on letter positions</span>
                </li>
              </ul>
            </div>

            {/* Encryption Rules */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Encryption Rules
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Same Row:</span>
                  <span>Shift right (wrap around)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Same Column:</span>
                  <span>Shift down (wrap around)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Rectangle:</span>
                  <span>Swap column positions</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Doubles:</span>
                  <span>Insert X between same letters</span>
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
                  <span>Resistant to frequency analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Digraph-based security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Easy to memorize and use manually</span>
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
                  <span>Vulnerable to digraph frequency analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Known plaintext attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Limited by 5×5 grid size</span>
                </li>
              </ul>
            </div>
          </div>

                {/* Mathematical Formula */}
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Encryption Rules
        </h3>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">1. Same Row:</p>
            <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
              C₁ = Grid[row][(col₁ + 1) mod 5]<br/>
              C₂ = Grid[row][(col₂ + 1) mod 5]
            </p>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Replace each letter with the letter to its right (wrap around to the start of row)
            </p>
          </div>
          
          <div>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">2. Same Column:</p>
            <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
              C₁ = Grid[(row₁ + 1) mod 5][col]<br/>
              C₂ = Grid[(row₂ + 1) mod 5][col]
            </p>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Replace each letter with the letter below it (wrap around to the top of column)
            </p>
          </div>
          
          <div>
            <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">3. Rectangle (Different Row & Column):</p>
            <p className="font-mono bg-white dark:bg-gray-800 p-2 rounded">
              C₁ = Grid[row₁][col₂]<br/>
              C₂ = Grid[row₂][col₁]
            </p>
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
              Replace letters with those on the same row but in the other pair's column
            </p>
          </div>

    <div>
      <p className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">4. Preparation Rules:</p>
      <ul className="font-mono bg-white dark:bg-gray-800 p-2 rounded space-y-1">
        <li>• I and J are treated as the same letter</li>
        <li>• Duplicate letters in a pair are separated by 'X'</li>
        <li>• Odd-length text is padded with 'X' at the end</li>
      </ul>
    </div>
  </div>
</div>


          {/* Historical Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Playfair cipher was invented in 1854 by Charles Wheatstone, 
              but it bears the name of Lord Playfair who promoted its use. It was used by the British military in World War I 
              and by the Allies during World War II. The cipher provides better security than simple substitution ciphers 
              because it encrypts pairs of letters rather than single letters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayfairPage;