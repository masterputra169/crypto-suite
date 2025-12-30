// src/pages/advanced/SuperEncryptionPage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Shield, Eye, EyeOff, BarChart3, Lightbulb, ArrowRight, Lock } from 'lucide-react';
import { useCipherTracking } from '../../hooks/useCipherTracking';


// Import algorithms
import {
  superEncrypt,
  superDecrypt,
  getSuperEncryptionVisualization,
  analyzeSuperEncryption,
  compareWithSingleCipher
} from '../../utils/algorithms/advanced/superEncryption.js';

const SuperEncryptionPage = () => {
  const [inputText, setInputText] = useState('');
  const [substitutionKey, setSubstitutionKey] = useState('');
  const [transpositionKey, setTranspositionKey] = useState('');
  const [order, setOrder] = useState('sub-trans');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showSubKey, setShowSubKey] = useState(true);
  const [showTransKey, setShowTransKey] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const { trackOperation, isTracking } = useCipherTracking();

  const validateKeys = (subKey, transKey) => {
    if (!subKey || subKey.length < 3) {
      return 'Substitution key must be at least 3 characters long';
    }
    if (!transKey || transKey.length < 2) {
      return 'Transposition key must be at least 2 characters long';
    }
    if (!/^[A-Za-z]+$/.test(subKey)) {
      return 'Substitution key must contain only letters (A-Z)';
    }
    if (!/^[A-Za-z]+$/.test(transKey)) {
      return 'Transposition key must contain only letters (A-Z)';
    }
    return null;
  };

  const handleProcess = async () => {  // ✅ ADD async
  setError('');
  
  if (!inputText.trim()) {
    setError('Please enter text to process');
    return;
  }

  const keyError = validateKeys(substitutionKey, transpositionKey);
  if (keyError) {
    setError(keyError);
    return;
  }

  // ✅ START TIMING
  const startTime = performance.now();

  try {
    let output;
    if (mode === 'encrypt') {
      output = superEncrypt(inputText, substitutionKey, transpositionKey, order);
    } else {
      output = superDecrypt(inputText, substitutionKey, transpositionKey, order);
    }
    
    setResult(output);
    setVisualization(getSuperEncryptionVisualization(inputText, substitutionKey, transpositionKey, order));
    
    // Generate analysis for ciphertext
    if (mode === 'encrypt' && output.length >= 20) {
      const analysisData = analyzeSuperEncryption(output, {
        substitutionKey,
        transpositionKey,
        order
      });
      setAnalysis(analysisData);
    } else {
      setAnalysis(null);
    }

    // ✅ TRACK OPERATION (CORRECTED KEY_DATA)
    await trackOperation(
      'Super Encryption',
      mode,
      startTime,
      inputText,
      output,
      { 
        substitutionKey: substitutionKey,
        transpositionKey: transpositionKey,
        order: order,  // 'sub-trans' or 'trans-sub'
        layers: 2
      }
    );

  } catch (err) {
    setError(err.message);
    console.error('Super encryption error:', err);
  }
};

  const handleReset = () => {
    setInputText('');
    setSubstitutionKey('');
    setTranspositionKey('');
    setOrder('sub-trans');
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Super Encryption
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Product cipher combining substitution (Vigenère) and transposition (Columnar) for enhanced security
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Super encryption applies two different cipher types in sequence, 
            significantly increasing security by combining the strengths of both substitution and transposition.
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

            {/* Order Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cipher Order
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setOrder('sub-trans')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                    order === 'sub-trans'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300'
                  }`}
                >
                  Sub → Trans
                </button>
                <button
                  onClick={() => setOrder('trans-sub')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all text-sm ${
                    order === 'trans-sub'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300'
                  }`}
                >
                  Trans → Sub
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {order === 'sub-trans' 
                  ? 'First: Vigenère, Then: Columnar Transposition'
                  : 'First: Columnar Transposition, Then: Vigenère'}
              </p>
            </div>

            {/* Substitution Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Substitution Key (Vigenère)
              </label>
              <div className="relative">
                <input
                  type={showSubKey ? 'text' : 'password'}
                  value={substitutionKey}
                  onChange={(e) => setSubstitutionKey(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter substitution key (min 3 letters)..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                />
                <button
                  onClick={() => setShowSubKey(!showSubKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showSubKey ? 'Hide key' : 'Show key'}
                >
                  {showSubKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {substitutionKey.length} characters - Only letters A-Z allowed
              </p>
            </div>

            {/* Transposition Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transposition Key (Columnar)
              </label>
              <div className="relative">
                <input
                  type={showTransKey ? 'text' : 'password'}
                  value={transpositionKey}
                  onChange={(e) => setTranspositionKey(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter transposition key (min 2 letters)..."
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition"
                />
                <button
                  onClick={() => setShowTransKey(!showTransKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showTransKey ? 'Hide key' : 'Show key'}
                >
                  {showTransKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {transpositionKey.length} characters - Only letters A-Z allowed
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
              disabled={isTracking}  // ✅ ADD
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
                  <span className="text-gray-600 dark:text-gray-400">Substitution Key:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {substitutionKey.toUpperCase()} ({substitutionKey.length})
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Transposition Key:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {transpositionKey.toUpperCase()} ({transpositionKey.length})
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Order:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {order === 'sub-trans' ? 'Sub → Trans' : 'Trans → Sub'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    Product Cipher
                  </span>
                </div>
                {visualization && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Security Level:</span>
                    <span className={`font-semibold ${
                      visualization.securityLevel.score >= 80 
                        ? 'text-green-600 dark:text-green-400'
                        : visualization.securityLevel.score >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {visualization.securityLevel.level} ({visualization.securityLevel.score})
                    </span>
                  </div>
                )}
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
                <strong>Analysis Note:</strong> {analysis.note}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Text Statistics
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Text Length:</span>
                    <span className="font-mono text-gray-900 dark:text-white">{analysis.textLength}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Index of Coincidence
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Value:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {analysis.indexOfCoincidence.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {analysis.indexOfCoincidence.interpretation}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chi-Squared Test
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Value:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {analysis.chiSquared.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {analysis.chiSquared.interpretation}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Assessment */}
            {analysis.security && (
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Security Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Security Level:</p>
                    <p className={`text-2xl font-bold ${
                      analysis.security.score >= 80 
                        ? 'text-green-600 dark:text-green-400'
                        : analysis.security.score >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analysis.security.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Score:</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {analysis.security.score}/100
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {analysis.security.description}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>Recommendation:</strong> {analysis.security.recommendation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Two-Pass Visualization */}
        {visualization && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Two-Pass Encryption Process
            </h2>
            
            <div className="space-y-6">
              {/* Original Text */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Original Text
                </h3>
                <p className="font-mono text-lg text-gray-900 dark:text-white break-all">
                  {visualization.originalText}
                </p>
              </div>

              <ArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />

              {/* First Pass */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Pass 1: {visualization.firstPass.methodName}
                  </h3>
                  <span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full">
                    {visualization.firstPass.method === 'substitution' ? 'Substitution' : 'Transposition'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Key:</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {visualization.firstPass.key}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Output:</p>
                    <p className="font-mono text-lg text-blue-700 dark:text-blue-300 break-all">
                      {visualization.firstPass.output}
                    </p>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />

              {/* Second Pass */}
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Pass 2: {visualization.secondPass.methodName}
                  </h3>
                  <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                    {visualization.secondPass.method === 'substitution' ? 'Substitution' : 'Transposition'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Key:</p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white">
                      {visualization.secondPass.key}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Output:</p>
                    <p className="font-mono text-lg text-indigo-700 dark:text-indigo-300 break-all">
                      {visualization.secondPass.output}
                    </p>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />

              {/* Final Result */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-400 dark:border-green-600">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Final Encrypted Result
                  </h3>
                  <Lock className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="font-mono text-xl font-bold text-green-700 dark:text-green-300 break-all">
                  {visualization.finalResult}
                </p>
              </div>
            </div>

            {/* Security Info */}
            {visualization.securityLevel && (
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-l-4 border-indigo-600">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Security Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Security Level:</p>
                    <p className={`text-xl font-bold ${
                      visualization.securityLevel.score >= 80 
                        ? 'text-green-600 dark:text-green-400'
                        : visualization.securityLevel.score >= 60
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {visualization.securityLevel.level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Key Complexity:</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {visualization.securityLevel.complexity}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-3">
                  {visualization.securityLevel.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* About Super Encryption */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Super Encryption (Product Cipher)
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
                  <span>Apply first cipher (substitution or transposition)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Take output and apply second cipher</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Combines strengths of both cipher types</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Requires both keys for decryption</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Product:</span>
                  <span>Combines multiple cipher types</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Dual Keys:</span>
                  <span>Uses two independent keys</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Enhanced:</span>
                  <span>Stronger than single ciphers</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Flexible:</span>
                  <span>Configurable cipher order</span>
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
                  <span>Resistant to pattern detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Significantly harder to break</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Combines best of both worlds</span>
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
                  <span>More complex to implement</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Requires managing two keys</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Slower than single ciphers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Still vulnerable to modern attacks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Encryption Process */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Encryption Process
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Order: Substitution → Transposition</strong></p>
              <p><strong>Step 1:</strong> Apply Vigenère cipher with substitution key</p>
              <p><strong>Step 2:</strong> Take Vigenère output as input for Columnar Transposition</p>
              <p><strong>Step 3:</strong> Apply Columnar Transposition with transposition key</p>
              <p><strong>Result:</strong> Text is both substituted AND rearranged</p>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                <strong>Example:</strong><br/>
                Plaintext: "HELLO"<br/>
                After Vigenère (key="KEY"): "RIJVS"<br/>
                After Columnar (key="ZEBRA"): "JSRVI"<br/>
                → Much harder to decrypt!
              </p>
            </div>
          </div>

          {/* Decryption Process */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Decryption Process
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Important:</strong> Decryption happens in REVERSE order!</p>
              <p><strong>Step 1:</strong> Apply reverse Columnar Transposition first</p>
              <p><strong>Step 2:</strong> Apply reverse Vigenère cipher second</p>
              <p><strong>Step 3:</strong> Both keys must be correct to recover plaintext</p>
            </div>
          </div>

          {/* Security Analysis */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Analysis
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Frequency Analysis:</strong> Substitution obscures letter frequencies, transposition breaks patterns further.</p>
              <p><strong>Pattern Analysis:</strong> Transposition destroys linguistic patterns that survive substitution.</p>
              <p><strong>Key Space:</strong> Combined key space is much larger than either cipher alone.</p>
              <p><strong>Defense in Depth:</strong> Attacker must break both cipher types to decrypt.</p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> Product ciphers (super encryption) 
              were widely used by military and diplomatic services during World War II and the Cold War. The principle of combining 
              different cipher types significantly increases security and was a precursor to modern encryption algorithms. 
              The ADFGVX cipher used by Germany in WWI was a famous product cipher combining substitution and transposition. 
              Modern block ciphers like DES and AES also use the product cipher concept with multiple rounds of substitution 
              and permutation operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperEncryptionPage;