// src/pages/transposition/MyszkowskiPage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Grid3x3, Eye, EyeOff, BarChart3, Lightbulb, GitCompare } from 'lucide-react';

// Import algorithms directly from myszkowskiTransposition
import {
  myszkowskiEncrypt,
  myszkowskiDecrypt,
  getMyszkowskiVisualization,
  analyzeMyszkowski,
  compareWithColumnar
} from '../../utils/algorithms/transposition/myszkowskiTransposition.js';

const MyszkowskiPage = () => {
  const [inputText, setInputText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKeyword, setShowKeyword] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [showComparison, setShowComparison] = useState(false);

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
        output = myszkowskiEncrypt(inputText, keyword);
      } else {
        output = myszkowskiDecrypt(inputText, keyword);
      }
      
      setResult(output);
      setVisualization(getMyszkowskiVisualization(inputText, keyword));
      
      // Generate comparison with columnar
      const comp = compareWithColumnar(inputText, keyword);
      setComparison(comp);
      
      // Generate analysis for ciphertext
      if (mode === 'encrypt' && output.length >= 10) {
        const analysisData = analyzeMyszkowski(output);
        setAnalysis(analysisData);
      } else {
        setAnalysis(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Myszkowski transposition error:', err);
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
    setComparison(null);
    setShowComparison(false);
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

  const toggleComparison = () => {
    setShowComparison(!showComparison);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Grid3x3 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Myszkowski Transposition
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Advanced columnar transposition that groups columns with repeated key letters
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Myszkowski transposition is a variant of columnar transposition. 
            When the keyword has repeated letters, columns with the same letter are read together as a group, 
            making it slightly more secure than standard columnar transposition.
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
              {keyword.length > 0 && (
                <div className="mt-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    {new Set(keyword.toUpperCase().split('')).size < keyword.length ? (
                      <span>
                        <strong>✓ Has repeated letters</strong> - Will use Myszkowski grouping
                      </span>
                    ) : (
                      <span>
                        <strong>No repeated letters</strong> - Behaves like standard columnar transposition
                      </span>
                    )}
                  </p>
                </div>
              )}
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
            {(analysis || comparison) && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Advanced Tools
                </h3>
                <div className="space-y-2">
                  {analysis && (
                    <button
                      onClick={toggleAnalysis}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg transition text-sm"
                    >
                      <BarChart3 size={16} />
                      {showAnalysis ? 'Hide' : 'Show'} Analysis
                    </button>
                  )}
                  {comparison && (
                    <button
                      onClick={toggleComparison}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg transition text-sm"
                    >
                      <GitCompare size={16} />
                      {showComparison ? 'Hide' : 'Show'} Comparison with Columnar
                    </button>
                  )}
                </div>
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
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Rows:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {visualization.numRows}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Column Groups:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {visualization.columnGroups.length}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    Transposition
                  </span>
                </div>
                {visualization?.hasRepeatedLetters && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Behavior:</span>
                    <span className="font-mono text-purple-600 dark:text-purple-400">
                      Myszkowski Grouping
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Comparison Section */}
        {showComparison && comparison && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Comparison: Myszkowski vs Columnar Transposition
                </h2>
              </div>
              <button
                onClick={() => setShowComparison(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Keyword Analysis
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Keyword:</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {comparison.keyword}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Length:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {comparison.keyLength}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Unique Letters:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {comparison.uniqueLetters}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Column Groups:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {comparison.columnGroups}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Repeated Letters
                </h3>
                {comparison.repeatedLetters.length > 0 ? (
                  <div className="space-y-2">
                    {comparison.repeatedLetters.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                        <span className="font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400">
                          {item.char}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Appears {item.count} times
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No repeated letters in keyword
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Behavior:
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {comparison.behavior}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                <strong>Security Note:</strong> {comparison.securityNote}
              </p>
            </div>
          </div>
        )}

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
                <strong>Analysis Note:</strong> {analysis.note}
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
                      Myszkowski
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
                <strong>⚠️ Difference Note:</strong> {analysis.differenceFromColumnar}
              </p>
            </div>
          </div>
        )}

        {/* Myszkowski Grid Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Myszkowski Transposition Grid
            </h2>
            
            <div className="overflow-x-auto">
              {/* Column Groups Display */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Column Groups (Reading Order):
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {visualization.columnGroups.map((group, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg border-2 border-indigo-300 dark:border-indigo-600"
                    >
                      <div className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Group {group.order}</div>
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                          {group.character}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {group.columns.length > 1 ? (
                            `Columns: ${group.columns.map(c => c + 1).join(', ')}`
                          ) : (
                            `Column ${group.columns[0] + 1}`
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Table */}
              <table className="w-full border-collapse mb-4">
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
                            Col {idx + 1}
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

            {/* Reading Order Visualization */}
            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Reading Order (Group by Group)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {visualization.columnGroups.map((group, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-300 dark:border-indigo-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Group {group.order}
                      </span>
                      <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {group.character}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {group.content.split('').map((char, charIdx) => (
                        <div 
                          key={charIdx}
                          className="w-8 h-8 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold rounded text-sm"
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {group.columnCount > 1 ? (
                        <span>Columns {group.columns.map(c => c + 1).join(', ')}: {group.content}</span>
                      ) : (
                        <span>Column {group.columns[0] + 1}: {group.content}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Keyword:</strong> {visualization.keyword}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>How it works:</strong> Text is written row by row into the grid. 
                {visualization.hasRepeatedLetters ? (
                  <span> Columns with the same key letter are grouped and read together as a block, making it different from standard columnar transposition.</span>
                ) : (
                  <span> Since there are no repeated letters in the keyword, this behaves exactly like standard columnar transposition.</span>
                )}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>Reading Order:</strong> {visualization.columnGroups.map(group => 
                  `Group ${group.order}: ${group.character} (${group.columnCount > 1 ? `columns ${group.columns.map(c => c + 1).join(', ')}` : `column ${group.columns[0] + 1}`})`
                ).join(' → ')}
              </p>
            </div>
          </div>
        )}

        {/* About Myszkowski Transposition */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Myszkowski Transposition
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
                  <span>Group columns with same keyword letter together</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Read column groups in alphabetical order of keyword</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Within each group, read all columns together row by row</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Advanced:</span>
                  <span>Improved version of columnar transposition</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Grouping:</span>
                  <span>Groups repeated key letters uniquely</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Flexible:</span>
                  <span>Works with any keyword length</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Compatible:</span>
                  <span>Behaves like columnar when no repeated letters</span>
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
                  <span>Stronger than standard columnar transposition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Harder to break with frequency analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Can use keywords with repeated letters effectively</span>
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
                  <span>Still vulnerable to known plaintext attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Anagram techniques can still break it</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Slightly more complex to implement manually</span>
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
              <p><strong>Step 2:</strong> Identify columns with same keyword letter (e.g., two 'A' columns)</p>
              <p><strong>Step 3:</strong> Write plaintext row by row below the keyword</p>
              <p><strong>Step 4:</strong> Pad incomplete rows with 'X' if necessary</p>
              <p><strong>Step 5:</strong> Sort keyword letters alphabetically, keeping grouped columns together</p>
              <p><strong>Step 6:</strong> Read each group of columns together, row by row</p>
              <p><strong>Step 7:</strong> Concatenate all groups to form ciphertext</p>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                <strong>Example:</strong><br/>
                Keyword: "TOMATO" → Groups: A(columns 3,6), M(col 2), O(cols 2,5), T(cols 1,4)<br/>
                Reading order: A-group, M-group, O-group, T-group<br/>
                Columns 3&6 read together, then 2, then 2&5 together, then 1&4 together
              </p>
            </div>
          </div>

          {/* Difference from Columnar */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Difference from Standard Columnar Transposition
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p className="font-semibold text-purple-700 dark:text-purple-300">Standard Columnar:</p>
                <p>Keyword "TOMATO" → Read columns in order: T(1), O(2), M(3), A(4), T(5), O(6)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Each column read individually regardless of repeated letters</p>
              </div>
              <div>
                <p className="font-semibold text-purple-700 dark:text-purple-300">Myszkowski:</p>
                <p>Keyword "TOMATO" → Read groups: A(4), M(3), O(2,6 together), T(1,5 together)</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Columns with same letter grouped and read as a block</p>
              </div>
              <div className="pt-2 border-t border-purple-300 dark:border-purple-700">
                <p className="font-semibold">Security Benefit:</p>
                <p className="text-xs">The grouping makes pattern analysis harder, providing slightly better security than standard columnar transposition, especially with keywords containing multiple repeated letters.</p>
              </div>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Myszkowski transposition cipher was developed as an improvement to the standard columnar transposition. 
              By grouping columns with repeated keyword letters and reading them together, it adds an extra layer of complexity that makes cryptanalysis more difficult. 
              This variant was particularly useful when memorable keywords (which often contain repeated letters) were preferred over random letter sequences. 
              While still a classical cipher vulnerable to modern cryptanalysis, it demonstrates clever thinking in enhancing transposition cipher security through simple modifications to the reading pattern.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyszkowskiPage;