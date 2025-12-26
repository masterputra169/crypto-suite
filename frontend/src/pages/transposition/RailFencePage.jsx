// src/pages/transposition/RailFencePage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Waves, BarChart3, TrendingDown } from 'lucide-react';

// Import algorithms
import {
  railFenceEncrypt,
  railFenceDecrypt,
  getRailFenceVisualization,
  analyzeRailFence
} from '../../utils/algorithms/index.js';

const RailFencePage = () => {
  const [inputText, setInputText] = useState('');
  const [rails, setRails] = useState(3);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const validateRails = (railCount, textLength) => {
    if (!railCount || railCount < 2) {
      return 'Number of rails must be at least 2';
    }
    if (textLength && railCount >= textLength) {
      return 'Number of rails must be less than text length';
    }
    return null;
  };

  const handleProcess = () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    const cleanTextLength = inputText.replace(/[^A-Z]/gi, '').length;
    const railsError = validateRails(rails, cleanTextLength);
    if (railsError) {
      setError(railsError);
      return;
    }

    try {
      let output;
      if (mode === 'encrypt') {
        output = railFenceEncrypt(inputText, rails);
      } else {
        output = railFenceDecrypt(inputText, rails);
      }
      
      setResult(output);
      setVisualization(getRailFenceVisualization(inputText, rails));
      
      // Generate analysis for ciphertext
      if (mode === 'encrypt' && output.length >= 6) {
        const analysisData = analyzeRailFence(output);
        setAnalysis(analysisData);
      } else {
        setAnalysis(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Rail fence cipher error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setRails(3);
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
            <Waves className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Rail Fence Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Zigzag transposition cipher writing text diagonally across rails
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Rail Fence cipher writes text in a zigzag pattern across multiple rails,
            then reads each rail from left to right to create the ciphertext.
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

            {/* Rails Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number of Rails
              </label>
              <input
                type="number"
                value={rails}
                onChange={(e) => setRails(parseInt(e.target.value) || 2)}
                min="2"
                max="20"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Must be between 2 and {Math.min(20, inputText.replace(/[^A-Z]/gi, '').length - 1 || 20)}
              </p>
            </div>

            {/* Rails Visualization Preview */}
            <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                <strong>Zigzag Pattern Preview ({rails} rails):</strong>
              </p>
              <div className="flex items-center gap-1">
                {Array.from({ length: rails }).map((_, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <TrendingDown 
                      className={`w-6 h-6 ${
                        idx % 2 === 0 ? 'text-indigo-600' : 'text-purple-600'
                      }`}
                      style={{ 
                        transform: idx % 2 === 0 ? 'rotate(0deg)' : 'rotate(180deg) scaleX(-1)' 
                      }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Rail {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl"
              >
                {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
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
                  {showAnalysis ? 'Hide' : 'Show'} Analysis
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
                  <span className="text-gray-600 dark:text-gray-400">Number of Rails:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {rails}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Zigzag Cycle:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {2 * (rails - 1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    Transposition
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cryptanalysis Section */}
        {showAnalysis && analysis && !analysis.error && (
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
                    <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      Rail Fence
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Most Likely Rails
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Estimated:</span>
                    <span className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {analysis.mostLikely}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Based on statistical analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Possible Rail Counts */}
            {analysis.possibleRails && analysis.possibleRails.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Possible Rail Counts
                </h3>
                <div className="space-y-2">
                  {analysis.possibleRails.slice(0, 10).map((item, idx) => (
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
                              Rails: <span className="text-lg font-mono">{item.rails}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Avg chars per rail: {item.avgRailLength}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            item.confidence === 'High' ? 'text-green-600 dark:text-green-400' :
                            item.confidence === 'Medium' ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {item.confidence}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Score: {item.score}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-300 dark:border-yellow-700">
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Note:</strong> {analysis.note}
              </p>
            </div>
          </div>
        )}

        {/* Rail Fence Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Rail Fence Zigzag Pattern
            </h2>
            
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-900 dark:bg-indigo-800 text-white px-3 py-2 text-sm">
                        Rail
                      </th>
                      {Array.from({ length: visualization.plaintext.length }).map((_, idx) => (
                        <th 
                          key={idx}
                          className="border-2 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 text-xs"
                        >
                          {idx}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {visualization.grid.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        <td className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 text-center font-bold text-indigo-600 dark:text-indigo-400 px-3 py-2">
                          {rowIdx + 1}
                        </td>
                        {row.map((cell, colIdx) => (
                          <td
                            key={colIdx}
                            className={`border-2 border-gray-300 dark:border-gray-600 text-center text-lg font-mono font-bold px-3 py-3 ${
                              cell 
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600'
                            }`}
                          >
                            {cell || '·'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Reading Order */}
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Reading Order (Rail by Rail)
              </h3>
              <div className="space-y-2">
                {Array.from({ length: rails }).map((_, railIdx) => {
                  const railChars = visualization.readingOrder
                    .filter(item => item.rail === railIdx)
                    .map(item => item.char);
                  
                  return (
                    <div key={railIdx} className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-16">
                        Rail {railIdx + 1}:
                      </span>
                      <div className="flex gap-1">
                        {railChars.map((char, idx) => (
                          <div 
                            key={idx}
                            className="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white font-bold rounded text-sm"
                          >
                            {char}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        ({railChars.length} chars)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>How it works:</strong> Text is written in a zigzag pattern going down and up across the rails.
                The ciphertext is created by reading each rail from left to right.
              </p>
            </div>
          </div>
        )}

        {/* About Rail Fence Cipher */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Rail Fence Cipher
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
                  <span>Write text diagonally downward across rails</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>When reaching bottom, bounce back upward</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Continue zigzag pattern until end of text</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Read each rail from left to right</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Zigzag:</span>
                  <span>Uses diagonal writing pattern</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Simple:</span>
                  <span>Easy to implement manually</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Variable:</span>
                  <span>Security depends on rail count</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Periodic:</span>
                  <span>Pattern repeats every cycle</span>
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
                  <span>Very simple to use manually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>No key required (just rail count)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Preserves letter frequency</span>
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
                  <span>Very weak encryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Limited key space (only rail count varies)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Vulnerable to brute force attack</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Encryption Algorithm */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Encryption Algorithm
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Step 1:</strong> Create N rails (rows) based on key</p>
              <p><strong>Step 2:</strong> Start at rail 0, direction = down</p>
              <p><strong>Step 3:</strong> Write each character on current rail</p>
              <p><strong>Step 4:</strong> Move diagonally (down or up based on direction)</p>
              <p><strong>Step 5:</strong> At rail 0 or N-1, reverse direction</p>
              <p><strong>Step 6:</strong> Repeat until all characters placed</p>
              <p><strong>Step 7:</strong> Read each rail left-to-right for ciphertext</p>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                <strong>Example (3 rails):</strong><br/>
                W . . . E . . . C . . . R . . .<br/>
                . E . R . D . E . R . E . T . E<br/>
                . . A . . . R . . . A . . . E .<br/>
                → Result: WECREERDERETORAEE
              </p>
            </div>
          </div>

          {/* Decryption Process */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Decryption Process
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Step 1:</strong> Create zigzag pattern markers for text length</p>
              <p><strong>Step 2:</strong> Count characters per rail from pattern</p>
              <p><strong>Step 3:</strong> Fill rails with ciphertext sequentially</p>
              <p><strong>Step 4:</strong> Read zigzag pattern to recover plaintext</p>
            </div>
          </div>

          {/* Security Analysis */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Analysis
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Key Space:</strong> Very limited - only depends on rail count (typically 2-10)</p>
              <p><strong>Brute Force:</strong> Extremely vulnerable - try all possible rail counts</p>
              <p><strong>Pattern Analysis:</strong> Zigzag pattern is easily recognizable</p>
              <p><strong>Recommendation:</strong> Only use for educational purposes or combine with stronger ciphers</p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Rail Fence cipher is one of the oldest and simplest transposition ciphers, 
              dating back to ancient times. It was named after the visual resemblance of the zigzag pattern to a rail fence. 
              While it provides minimal security by modern standards, it demonstrates the basic principle of transposition ciphers 
              and is often used as an introductory example in cryptography education. The cipher was occasionally used in combination 
              with other encryption methods to provide an additional layer of obfuscation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RailFencePage;