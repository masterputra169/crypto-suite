// src/pages/substitution/AutokeyPage.jsx - WITH COMPLETE TRACKING

import { useState } from 'react';
import { useCipherTracking } from '../../hooks/useCipherTracking';
import { Copy, RotateCcw, Lock, Eye, EyeOff, Grid3x3, BarChart3, Lightbulb, Key } from 'lucide-react';

// Import algorithms
import {
  autokeyEncrypt,
  autokeyDecrypt,
  getAutokeyVisualization,
  generateAutokeySquare,
  analyzeAutokey
} from '../../utils/algorithms/index.js';

const AutokeyPage = () => {
  const [inputText, setInputText] = useState('');
  const [initialKey, setInitialKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [error, setError] = useState('');
  
  // Advanced features state
  const [showSquare, setShowSquare] = useState(false);
  const [autokeySquare, setAutokeySquare] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // ✅ USE CIPHER TRACKING HOOK
  const { trackOperation, isTracking } = useCipherTracking();

  const validateKey = (key) => {
    if (!key || key.length < 3) {
      return 'Initial key must be at least 3 characters long';
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      return 'Initial key must contain only letters (A-Z)';
    }
    return null;
  };

  const handleProcess = async () => {  // ← ADD async
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const keyError = validateKey(initialKey);
    if (keyError) {
      setError(keyError);
      return;
    }

    // ✅ START TIMING
    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = autokeyEncrypt(inputText, initialKey);
      } else {
        output = autokeyDecrypt(inputText, initialKey);
      }
      
      setResult(output);
      setVisualization(getAutokeyVisualization(inputText, initialKey));
      
      // Generate analysis for ciphertext
      if (output.length >= 20) {
        const analysisData = analyzeAutokey(output);
        setAnalysis(analysisData);
      } else {
        setAnalysis(null);
      }

      // ✅ TRACK OPERATION WITH FULL DATA
      await trackOperation(
        'Autokey Cipher',         // cipher type
        mode,                     // operation
        startTime,                // timing
        inputText,                // input
        output,                   // output
        { key: initialKey }       // key data
      );

    } catch (err) {
      setError(err.message);
      console.error('Autokey cipher error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setInitialKey('');
    setResult('');
    setVisualization(null);
    setError('');
    setAnalysis(null);
    setShowAnalysis(false);
    setShowSquare(false);
    setAutokeySquare(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const handleGenerateSquare = () => {
    if (!showSquare) {
      const square = generateAutokeySquare();
      setAutokeySquare(square);
    }
    setShowSquare(!showSquare);
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Autokey Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Progressive polyalphabetic cipher where plaintext becomes the key
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> The Autokey cipher improves upon the Vigenère cipher by using the plaintext 
            itself as part of the key after an initial key. This eliminates the periodic key repetition, 
            making it more secure against frequency analysis attacks.
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

            {/* Initial Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Initial Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={initialKey}
                  onChange={(e) => setInitialKey(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter initial key (letters only)..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
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
                {initialKey.length} characters - Only letters A-Z allowed
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

            {/* Advanced Tools */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Advanced Tools
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleGenerateSquare}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg transition text-sm"
                >
                  <Grid3x3 size={16} />
                  {showSquare ? 'Hide' : 'Show'} Square
                </button>
                {analysis && (
                  <button
                    onClick={toggleAnalysis}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition text-sm"
                  >
                    <BarChart3 size={16} />
                    {showAnalysis ? 'Hide' : 'Show'} Analysis
                  </button>
                )}
              </div>
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
            {result && visualization && (
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
                  <span className="text-gray-600 dark:text-gray-400">Initial Key:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {initialKey.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Initial Key Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.keyLength}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Full Autokey Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.textLength}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    Progressive Key
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Autokey Square */}
        {showSquare && autokeySquare && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Grid3x3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Autokey Square (Tabula Recta)
                </h2>
              </div>
              <button
                onClick={() => setShowSquare(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-indigo-900 dark:text-indigo-200">
                <strong>How to use:</strong> Find the key letter in the leftmost column, 
                then find the plaintext letter in the top row. The intersection is the ciphertext letter.
                Formula: C = (P + K) mod 26 (same as Vigenère)
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="w-8 h-8 border border-gray-600 dark:border-gray-500 bg-indigo-900 dark:bg-indigo-800 text-xs font-bold"></th>
                      {Array.from({ length: 26 }, (_, i) => (
                        <th key={i} className="w-8 h-8 border border-gray-600 dark:border-gray-500 bg-indigo-900 dark:bg-indigo-800 text-xs font-bold text-indigo-100 dark:text-indigo-100">
                          {String.fromCharCode(65 + i)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {autokeySquare.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="w-8 h-8 border border-gray-600 dark:border-gray-500 bg-indigo-900 dark:bg-indigo-800 text-center text-xs font-bold text-indigo-100 dark:text-indigo-100">
                          {String.fromCharCode(65 + rowIndex)}
                        </td>
                        {row.map((cell, cellIndex) => (
                          <td 
                            key={cellIndex} 
                            className="w-8 h-8 border border-gray-600 dark:border-gray-500 bg-gray-800 dark:bg-gray-900 text-center text-xs font-mono text-gray-100 dark:text-gray-200 hover:bg-indigo-700 dark:hover:bg-indigo-600 transition cursor-pointer"
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

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                💡 <strong>Tip:</strong> The Autokey square is identical to the Vigenère square. 
                The difference is in how the key is generated: Autokey uses initial key + plaintext, 
                while Vigenère repeats the keyword.
              </p>
            </div>
          </div>
        )}

        {/* Cryptanalysis Section */}
        {showAnalysis && analysis && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Cryptanalysis
                </h2>
              </div>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Text Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Text Length:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{analysis.textLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Index of Coincidence:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{analysis.overallIC.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      {analysis.cipherType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  IC Interpretation
                </h3>
                <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <p>• IC ≈ 0.065: Monoalphabetic (correct key length)</p>
                  <p>• IC ≈ 0.038: Random/polyalphabetic</p>
                  <p>• Higher IC = More likely key length</p>
                  <p className="mt-2 text-indigo-600 dark:text-indigo-400">
                    <strong>Autokey:</strong> {analysis.note}
                  </p>
                </div>
              </div>
            </div>

            {/* Likely Key Lengths */}
            {analysis.likelyKeyLengths && analysis.likelyKeyLengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Probable Initial Key Lengths
                </h3>
                <div className="space-y-2">
                  {analysis.likelyKeyLengths.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${
                        idx === 0 
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-600' 
                          : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${
                            idx === 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Key Length: <span className="text-lg font-mono">{item.length}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Index of Coincidence: {item.ic.toFixed(4)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            idx === 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {item.confidence.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            confidence
                          </div>
                        </div>
                      </div>
                      {idx === 0 && (
                        <div className="mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                          <p className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                            <Lightbulb size={12} />
                            Most likely initial key length based on statistical analysis
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Note:</strong> Autokey cipher is more resistant to Kasiski examination than Vigenère 
                because the key doesn't repeat periodically. Analysis estimates the initial key length, 
                but results may be less accurate than with standard Vigenère cipher.
              </p>
            </div>
          </div>
        )}

        {/* Key Generation Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Autokey Generation & Character Mapping
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Plaintext:
                </h3>
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {visualization.plaintext.split('').map((char, idx) => (
                    <div key={idx} className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold rounded">
                      {char}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Autokey (Initial Key + Plaintext):
                </h3>
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {visualization.autokey.split('').map((char, idx) => {
                    const isFromInitialKey = idx < visualization.keyLength;
                    return (
                      <div 
                        key={idx} 
                        className={`w-8 h-8 flex items-center justify-center font-bold rounded ${
                          isFromInitialKey 
                            ? 'bg-indigo-200 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-200 border-2 border-indigo-400 dark:border-indigo-600' 
                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        }`}
                        title={isFromInitialKey ? 'From Initial Key' : 'From Plaintext'}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-200 dark:bg-indigo-800/50 border-2 border-indigo-400 dark:border-indigo-600 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">Initial Key</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-indigo-100 dark:bg-indigo-900/30 rounded"></div>
                    <span className="text-gray-600 dark:text-gray-400">From Plaintext</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Ciphertext:
                </h3>
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {visualization.ciphertext.split('').map((char, idx) => (
                    <div key={idx} className="w-8 h-8 flex items-center justify-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-bold rounded">
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Mapping */}
            {visualization.mapping && visualization.mapping.length <= 20 && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Detailed Character Mapping:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {visualization.mapping.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Position {item.position}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.isFromInitialKey 
                            ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200' 
                            : 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                        }`}>
                          {item.keySource}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-blue-600 dark:text-blue-400">P: {item.plainChar} ({item.plainValue})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-indigo-600 dark:text-indigo-400">K: {item.keyChar} ({item.keyValue})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600 dark:text-green-400">C: {item.cipherChar} ({item.cipherValue})</span>
                        </div>
                        <div className="pt-1 mt-1 border-t border-gray-300 dark:border-gray-600 text-xs text-gray-600 dark:text-gray-400">
                          {item.calculation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Initial Key:</strong> {visualization.initialKey}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Full Autokey:</strong> {visualization.autokey}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>How it works:</strong> {visualization.note}. 
                Each letter is encrypted using: <code className="px-1 bg-white dark:bg-gray-800 rounded">C = (P + K) mod 26</code>
              </p>
            </div>
          </div>
        )}

        {/* About Autokey Cipher */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Autokey Cipher
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
                  <span>Starts with a short initial key (primer)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Plaintext itself becomes part of the key after initial key</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>No periodic key repetition like in Vigenère</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Progressive key generation during encryption</span>
                </li>
              </ul>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Key Features
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Progressive:</span>
                  <span>Key evolves with the plaintext</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Non-periodic:</span>
                  <span>Eliminates repeating key pattern</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Self-synchronizing:</span>
                  <span>Key regenerates from plaintext</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Historical:</span>
                  <span>Invented by Girolamo Cardano (1550s)</span>
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
                  <span>More secure than standard Vigenère cipher</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>No periodic key repetition to exploit</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Resistant to Kasiski examination</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Simple to implement and use</span>
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
                  <span>Vulnerable to known plaintext attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Error propagation in decryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Initial key security is critical</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Not secure by modern cryptographic standards</span>
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
              <p><strong>Key Generation:</strong> K = K₀ || P (where || means concatenation)</p>
              <p><strong>Encryption:</strong> Cᵢ = (Pᵢ + Kᵢ) mod 26</p>
              <p><strong>Decryption:</strong> Pᵢ = (Cᵢ - Kᵢ + 26) mod 26</p>
              <p className="text-xs mt-2 font-sans">
                Where K₀ is the initial key (primer), P is the plaintext, Pᵢ is plaintext letter, 
                Kᵢ is the autokey letter at position i, and Cᵢ is ciphertext letter. 
                The key Kᵢ consists of: initial key for i &lt; |K₀|, and plaintext for i ≥ |K₀|.
              </p>
            </div>
          </div>

          {/* Example */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Example
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Plaintext:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">ATTACKATDAWN</code></p>
              <p><strong>Initial Key:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">KEY</code></p>
              <p><strong>Autokey:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">KEYATTACKATD</code> (KEY + plaintext)</p>
              <p><strong>Ciphertext:</strong> <code className="bg-white dark:bg-gray-800 px-2 py-1 rounded">KFAEMKAQAKXP</code></p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Notice how the autokey is formed by the initial key "KEY" followed by the plaintext itself.
              </p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Autokey cipher was invented 
              by the Italian polymath Girolamo Cardano in the 1550s, and later reinvented by Blaise de Vigenère in 1586. 
              It was an important improvement over the standard Vigenère cipher because it eliminated the weakness of 
              periodic key repetition. By using the plaintext itself as part of the key, the Autokey cipher made 
              Kasiski examination (used to break Vigenère) much less effective. However, it remained vulnerable to 
              known plaintext attacks, where knowledge of some plaintext-ciphertext pairs could reveal the key. 
              The cipher saw practical use in diplomatic communications until the early 20th century.
            </p>
          </div> 
        </div>
      </div>
    </div>
  );
};

export default AutokeyPage;