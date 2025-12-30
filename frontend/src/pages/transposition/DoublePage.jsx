// src/pages/transposition/DoublePage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Layers, Eye, EyeOff, BarChart3, Shield, ArrowRight } from 'lucide-react';
import { useCipherTracking } from '../../hooks/useCipherTracking';

// Import algorithms
import {
  doubleTranspositionEncrypt,
  doubleTranspositionDecrypt,
  getDoubleTranspositionVisualization,
  analyzeDoubleTransposition
} from '../../utils/algorithms/index.js';

const DoublePage = () => {
  const [inputText, setInputText] = useState('');
  const [key1, setKey1] = useState('');
  const [key2, setKey2] = useState('');
  const [useSameKey, setUseSameKey] = useState(false);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey1, setShowKey1] = useState(true);
  const [showKey2, setShowKey2] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { trackOperation, isTracking } = useCipherTracking();

  const validateKey = (key, keyName) => {
    if (!key || key.length < 2) {
      return `${keyName} must be at least 2 characters long`;
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      return `${keyName} must contain only letters (A-Z)`;
    }
    return null;
  };

  const handleProcess = async () => {
  setError('');
  
  if (!inputText.trim()) {
    setError('Please enter text to process');
    return;
  }

  const key1Error = validateKey(key1, 'Key 1');
  if (key1Error) {
    setError(key1Error);
    return;
  }

  if (!useSameKey) {
    const key2Error = validateKey(key2, 'Key 2');
    if (key2Error) {
      setError(key2Error);
      return;
    }
  }

  // ✅ START TIMING
  const startTime = performance.now();

  try {
    const effectiveKey2 = useSameKey ? key1 : key2;
    let output;
    
    if (mode === 'encrypt') {
      output = doubleTranspositionEncrypt(inputText, key1, effectiveKey2);
    } else {
      output = doubleTranspositionDecrypt(inputText, key1, effectiveKey2);
    }
    
    setResult(output);
    setVisualization(getDoubleTranspositionVisualization(inputText, key1, effectiveKey2));
    
    // Generate analysis for ciphertext
    if (mode === 'encrypt' && output.length >= 20) {
      const analysisData = analyzeDoubleTransposition(output);
      setAnalysis(analysisData);
    } else {
      setAnalysis(null);
    }

    // ✅ TRACK OPERATION WITH BACKEND
    await trackOperation(
      'Double Transposition',
      mode,
      startTime,
      inputText,
      output,
      { 
        key1: key1, 
        key2: effectiveKey2,
        useSameKey: useSameKey 
      }
    );

  } catch (err) {
    setError(err.message);
    console.error('Double transposition error:', err);
  }
};

  const handleReset = () => {
    setInputText('');
    setKey1('');
    setKey2('');
    setResult('');
    setVisualization(null);
    setError('');
    setAnalysis(null);
    setShowAnalysis(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Double Transposition
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enhanced security with two-pass columnar transposition using dual keys
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Double transposition applies columnar transposition twice.
            Using different keys for each pass significantly increases security.
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

            {/* Key 1 Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key 1 (First Pass)
              </label>
              <div className="relative">
                <input
                  type={showKey1 ? 'text' : 'password'}
                  value={key1}
                  onChange={(e) => setKey1(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter first key..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                />
                <button
                  onClick={() => setShowKey1(!showKey1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showKey1 ? 'Hide key' : 'Show key'}
                >
                  {showKey1 ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {key1.length} characters
              </p>
            </div>

            {/* Same Key Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSameKey}
                  onChange={(e) => setUseSameKey(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Use same key for both passes
                </span>
              </label>
            </div>

            {/* Key 2 Input */}
            {!useSameKey && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Key 2 (Second Pass)
                </label>
                <div className="relative">
                  <input
                    type={showKey2 ? 'text' : 'password'}
                    value={key2}
                    onChange={(e) => setKey2(e.target.value.replace(/[^A-Za-z]/g, ''))}
                    placeholder="Enter second key..."
                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                  />
                  <button
                    onClick={() => setShowKey2(!showKey2)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    title={showKey2 ? 'Hide key' : 'Show key'}
                  >
                    {showKey2 ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {key2.length} characters
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
                          <button
              onClick={handleProcess}
              disabled={isTracking}  // ✅ ADD THIS
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"  // ✅ ADD disabled classes
            >
              {isTracking ? 'Processing...' : (mode === 'encrypt' ? 'Encrypt' : 'Decrypt')}  {/* ✅ UPDATE TEXT */}
            </button>
              <button
                onClick={handleReset}
                className="px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Advanced Tools */}
            {analysis && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Advanced Tools
                </h3>
                <button
                  onClick={toggleAnalysis}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition text-sm"
                >
                  <BarChart3 size={16} />
                  {showAnalysis ? 'Hide' : 'Show'} Security Analysis
                </button>
              </div>
            )}
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
                  <span className="text-gray-600 dark:text-gray-400">Key 1:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {key1.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key 2:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {useSameKey ? key1.toUpperCase() : key2.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key Mode:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {useSameKey ? 'Single Key' : 'Dual Key'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    Double Transposition
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Analysis */}
        {showAnalysis && analysis && !analysis.error && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Security Analysis
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
                    <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      Double Transposition
                    </span>
                  </div>
                </div>
              </div>

              {analysis.securityLevel && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Security Level
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Level:</span>
                      <span className={`font-bold text-lg ${
                        analysis.securityLevel.level === 'Very High' ? 'text-green-600 dark:text-green-400' :
                        analysis.securityLevel.level === 'High' ? 'text-blue-600 dark:text-blue-400' :
                        analysis.securityLevel.level === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {analysis.securityLevel.level}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Score:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {analysis.securityLevel.score}/100
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {analysis.securityLevel.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Possible Key Combinations */}
            {analysis.possibleCombinations && analysis.possibleCombinations.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Possible Key Combinations (Top 10)
                </h3>
                <div className="space-y-2">
                  {analysis.possibleCombinations.slice(0, 10).map((combo, idx) => (
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
                              Key1: <span className="text-lg font-mono">{combo.key1Length}</span>
                              <ArrowRight className="w-4 h-4 inline mx-2" />
                              Key2: <span className="text-lg font-mono">{combo.key2Length}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Pass 1: {combo.estimatedFirstPassRows} rows | 
                              Pass 2: {combo.estimatedSecondPassRows} rows
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            idx === 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            Complexity: {combo.totalComplexity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-300 dark:border-blue-700">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>💡 Note:</strong> {analysis.note}
              </p>
            </div>
          </div>
        )}

        {/* Double Grid Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Double Transposition Process
            </h2>

            {/* Process Flow Indicator */}
            <div className="mb-6 flex items-center justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Original</div>
                <div className="font-bold text-blue-600 dark:text-blue-400">Plaintext</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">First Pass</div>
                <div className="font-bold text-indigo-600 dark:text-indigo-400">Key 1</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Second Pass</div>
                <div className="font-bold text-purple-600 dark:text-purple-400">Key 2</div>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400" />
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Final</div>
                <div className="font-bold text-green-600 dark:text-green-400">Ciphertext</div>
              </div>
            </div>

            {/* First Pass Grid */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  First Pass - Key: {visualization.firstPass.key}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-900 dark:bg-indigo-800 text-white px-4 py-2 text-sm">
                        Row
                      </th>
                      {visualization.firstPass.key.split('').map((char, idx) => (
                        <th 
                          key={idx}
                          className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-900 dark:bg-indigo-800 text-white px-4 py-2"
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold">{char}</div>
                            <div className="text-xs opacity-75">
                              {visualization.firstPass.columnOrder.indexOf(idx) + 1}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visualization.firstPass.grid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 text-center font-bold text-indigo-600 dark:text-indigo-400 px-4 py-2">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className="border-2 border-indigo-300 dark:border-indigo-600 text-center text-lg font-mono font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-gray-700 px-4 py-3"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>First Pass Result:</strong> <span className="font-mono">{visualization.firstPass.result}</span>
                </p>
              </div>
            </div>

            {/* Second Pass Grid */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Second Pass - Key: {visualization.secondPass.key}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-purple-300 dark:border-purple-600 bg-purple-900 dark:bg-purple-800 text-white px-4 py-2 text-sm">
                        Row
                      </th>
                      {visualization.secondPass.key.split('').map((char, idx) => (
                        <th 
                          key={idx}
                          className="border-2 border-purple-300 dark:border-purple-600 bg-purple-900 dark:bg-purple-800 text-white px-4 py-2"
                        >
                          <div className="text-center">
                            <div className="text-lg font-bold">{char}</div>
                            <div className="text-xs opacity-75">
                              {visualization.secondPass.columnOrder.indexOf(idx) + 1}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visualization.secondPass.grid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="border-2 border-purple-300 dark:border-purple-600 bg-purple-100 dark:bg-purple-900/20 text-center font-bold text-purple-600 dark:text-purple-400 px-4 py-2">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className="border-2 border-purple-300 dark:border-purple-600 text-center text-lg font-mono font-bold text-gray-900 dark:text-white bg-purple-50 dark:bg-gray-700 px-4 py-3"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Final Ciphertext:</strong> <span className="font-mono">{visualization.finalEncrypted}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* About Double Transposition */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Double Transposition
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
                  <span>Apply columnar transposition with first key</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Take output and apply second transposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Can use same key or different keys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Significantly increases cryptographic strength</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Two-Pass:</span>
                  <span>Applies transposition twice</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Dual Keys:</span>
                  <span>Can use different keys for each pass</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Enhanced Security:</span>
                  <span>Much stronger than single transposition</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Historical:</span>
                  <span>Used in World War II communications</span>
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
                  <span>Much more secure than single transposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Resistant to simple cryptanalysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Key space significantly larger with dual keys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Still preserves letter frequency (for combination with substitution)</span>
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
                  <span>Still vulnerable with sufficient ciphertext</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Known plaintext attacks remain effective</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Modern computers can break it with brute force</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Algorithm Steps */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Encryption Algorithm
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Step 1:</strong> Apply columnar transposition using Key 1</p>
              <p className="ml-4">→ Write plaintext in rows, read columns by Key 1 order</p>
              <p><strong>Step 2:</strong> Take result from Step 1 as new input</p>
              <p><strong>Step 3:</strong> Apply columnar transposition using Key 2</p>
              <p className="ml-4">→ Write intermediate text in rows, read columns by Key 2 order</p>
              <p><strong>Step 4:</strong> Final result is the doubly-transposed ciphertext</p>
            </div>
          </div>

          {/* Decryption Process */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Decryption Process
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Important:</strong> Decryption reverses the process in opposite order</p>
              <p><strong>Step 1:</strong> Decrypt with Key 2 first (reverse second transposition)</p>
              <p><strong>Step 2:</strong> Take result and decrypt with Key 1 (reverse first transposition)</p>
              <p><strong>Step 3:</strong> Remove padding 'X' characters to get original plaintext</p>
            </div>
          </div>

          {/* Security Comparison */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Comparison
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-semibold text-gray-600 dark:text-gray-400">Single Transposition</p>
                  <p className="text-xs">Key Space: ~10-20</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Security: Low</p>
                </div>
                <div>
                  <p className="font-semibold text-yellow-600 dark:text-yellow-400">Double (Same Key)</p>
                  <p className="text-xs">Key Space: ~10-20</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">Security: Medium</p>
                </div>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">Double (Different Keys)</p>
                  <p className="text-xs">Key Space: ~100-400</p>
                  <p className="text-xs text-green-600 dark:text-green-400">Security: High</p>
                </div>
              </div>
              <p className="text-xs mt-2">
                <strong>Recommendation:</strong> Always use different keys for maximum security.
                The security improvement is exponential, not linear.
              </p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> Double transposition was extensively used during World War II, 
              particularly by German forces. The Germans often combined it with other ciphers for added security. 
              British codebreakers at Bletchley Park developed techniques to break double transposition, 
              but it remained one of the more secure manual cipher systems of the era when used correctly with long, random keys. 
              The cipher's strength comes from the fact that two layers of scrambling make pattern recognition extremely difficult without knowing both keys.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoublePage;