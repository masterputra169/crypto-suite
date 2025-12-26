// src/pages/transposition/ColumnarPage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Table2, Eye, EyeOff, BarChart3, Lightbulb } from 'lucide-react';

// Import algorithms
import {
  columnarEncrypt,
  columnarDecrypt,
  getColumnarVisualization,
  analyzeColumnarKey
} from '../../utils/algorithms/index.js';

const ColumnarPage = () => {
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKeyword, setShowKeyword] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const validateKeyword = (key) => {
    if (!key || key.length < 2) {
      return 'Keyword must be at least 2 characters long';
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      return 'Keyword must contain only letters (A-Z)';
    }
    return null;
  };

  const handleProcess = () => {
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

    try {
      let output;
      if (mode === 'encrypt') {
        output = columnarEncrypt(inputText, keyword);
      } else {
        output = columnarDecrypt(inputText, keyword);
      }
      
      setResult(output);
      setVisualization(getColumnarVisualization(inputText, keyword));
      
      // Generate analysis for ciphertext
      if (mode === 'encrypt' && output.length >= 10) {
        const analysisData = analyzeColumnarKey(output);
        setAnalysis(analysisData);
      } else {
        setAnalysis(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Columnar transposition error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
    setKeyword('');
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
            <Table2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Columnar Transposition
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Transposition cipher using column-based rearrangement with keyword ordering
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Columnar transposition writes text in rows, then reads columns in alphabetical order of the keyword.
            Text is padded with 'X' if needed to fill the grid.
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
                  <span className="text-gray-600 dark:text-gray-400">Keyword:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {keyword.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Columns:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {keyword.length}
                  </span>
                </div>
                {visualization && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rows:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {visualization.numRows}
                    </span>
                  </div>
                )}
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

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                <strong>Analysis Note:</strong> The key length determination is based on factors of the ciphertext length.
                Exact factors are more likely to be correct key lengths.
              </p>
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
                      Transposition
                    </span>
                  </div>
                </div>
              </div>

              {analysis.mostLikely && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Most Likely Key Length
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Length:</span>
                      <span className="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {analysis.mostLikely.keywordLength}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Estimated Rows:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {analysis.mostLikely.estimatedRows}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className={`font-semibold ${
                        analysis.mostLikely.confidence === 'High' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {analysis.mostLikely.confidence}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Possible Key Lengths */}
            {analysis.possibleKeyLengths && analysis.possibleKeyLengths.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Possible Key Lengths
                </h3>
                <div className="space-y-2">
                  {analysis.possibleKeyLengths.slice(0, 8).map((item, idx) => (
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
                              Key Length: <span className="text-lg font-mono">{item.keywordLength}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Rows: {item.estimatedRows} | Padding: {item.paddingAmount} chars
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${
                            idx === 0 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {item.confidence}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.isExactFactor ? '✓ Exact Factor' : 'Approximate'}
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

        {/* Columnar Grid Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Columnar Transposition Grid
            </h2>
            
            <div className="overflow-x-auto">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Keyword Column Order:
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {visualization.orderedColumns.map((col, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg"
                    >
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Order {col.order}</div>
                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {col.character}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Column {col.originalIndex + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-900 dark:bg-indigo-800 text-white px-4 py-2 text-sm">
                      Row
                    </th>
                    {visualization.keyword.split('').map((char, idx) => (
                      <th 
                        key={idx}
                        className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-900 dark:bg-indigo-800 text-white px-4 py-2"
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">{char}</div>
                          <div className="text-xs opacity-75">
                            Order: {visualization.columnOrder.indexOf(idx) + 1}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visualization.grid.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className="border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 text-center font-bold text-indigo-600 dark:text-indigo-400 px-4 py-2">
                        {rowIdx + 1}
                      </td>
                      {row.map((cell, colIdx) => (
                        <td
                          key={colIdx}
                          className="border-2 border-indigo-300 dark:border-indigo-600 text-center text-xl font-mono font-bold text-gray-900 dark:text-white bg-indigo-50 dark:bg-gray-700 px-4 py-3"
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
                <strong>How it works:</strong> Text is written row by row into the grid. 
                Columns are then read in alphabetical order of the keyword letters to produce the ciphertext.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Reading Order:</strong> {visualization.orderedColumns.map(col => 
                  `${col.character} (col ${col.originalIndex + 1})`
                ).join(' → ')}
              </p>
            </div>

            {/* Column Reading Visualization */}
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Reading Order (Column by Column)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visualization.orderedColumns.map((col, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-300 dark:border-indigo-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Step {idx + 1}
                      </span>
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {col.character}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {col.content.map((char, charIdx) => (
                        <div 
                          key={charIdx}
                          className="w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded text-sm"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Column {col.originalIndex + 1}: {col.contentString}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* About Columnar Transposition */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Columnar Transposition
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
                  <span>Write plaintext in rows under keyword</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Number columns by alphabetical order of keyword</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Read columns in numerical order</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Pad with 'X' to fill incomplete rows</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Transposition:</span>
                  <span>Rearranges character positions</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Grid-Based:</span>
                  <span>Uses rectangular grid structure</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Keyword:</span>
                  <span>Determines column reading order</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Classical:</span>
                  <span>Used historically in military communications</span>
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
                  <span>Preserves character frequency</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Simple to implement manually</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Can be combined with substitution ciphers</span>
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
                  <span>Anagram techniques can break it</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Weak against frequency analysis patterns</span>
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
              <p><strong>Step 1:</strong> Write keyword across the top of a grid</p>
              <p><strong>Step 2:</strong> Number columns by alphabetical order of keyword letters</p>
              <p><strong>Step 3:</strong> Write plaintext row by row below the keyword</p>
              <p><strong>Step 4:</strong> Pad incomplete rows with 'X' if necessary</p>
              <p><strong>Step 5:</strong> Read columns in numerical order (1, 2, 3, ...)</p>
              <p><strong>Step 6:</strong> Concatenate column contents to form ciphertext</p>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                <strong>Example:</strong><br/>
                Keyword: "ZEBRA" → Alphabetical order: A(5), B(2), E(1), R(3), Z(4)<br/>
                Column reading order: 1(E), 2(B), 3(R), 4(Z), 5(A)<br/>
                Text written in rows → Read columns in order E, B, R, Z, A
              </p>
            </div>
          </div>

          {/* Decryption Process */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Decryption Process
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Step 1:</strong> Calculate grid dimensions (rows = ceiling(length ÷ key length))</p>
              <p><strong>Step 2:</strong> Create empty grid with calculated dimensions</p>
              <p><strong>Step 3:</strong> Fill columns in the order they were read during encryption</p>
              <p><strong>Step 4:</strong> Read grid row by row to recover plaintext</p>
              <p><strong>Step 5:</strong> Remove padding 'X' characters from the end</p>
            </div>
          </div>

            {/* Security Analysis */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Analysis
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Frequency Preservation:</strong> Unlike substitution ciphers, columnar transposition preserves the frequency of letters, making it vulnerable to frequency analysis when used alone.</p>
              <p><strong>Anagram Attack:</strong> Since it's just rearranging letters, knowing common words can help reconstruct the plaintext through anagram solving.</p>
              <p><strong>Known Plaintext:</strong> If an attacker knows part of the plaintext, they can deduce the column order and decrypt the entire message.</p>
              <p><strong>Strengthening:</strong> Columnar transposition is much stronger when combined with substitution ciphers (creating a product cipher).</p>
            </div>
            </div>

            {/* Historical Note */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> Columnar transposition was widely used during World War I and World War II for military communications. 
              It was often combined with substitution ciphers to create stronger encryption systems. 
              The Germans used a variant called "double transposition" which applied the process twice with different keywords for enhanced security.
              Despite its historical importance, modern cryptanalysis techniques can break columnar transposition relatively easily, especially with known plaintext attacks or by analyzing the factors of the ciphertext length.
            </p>
          </div>
          </div>
        </div>
      </div>
  );
};

export default ColumnarPage;