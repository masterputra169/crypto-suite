// src/pages/advanced/OTPPage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Key, Eye, EyeOff, BarChart3, Lightbulb, AlertTriangle, Sparkles, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useCipherTracking } from '../../hooks/useCipherTracking';


// Import algorithms
import {
  otpEncrypt,
  otpDecrypt,
  getOTPVisualization,
  analyzeOTP,
  generateRandomKey,
  textToHex,
  textToBinary,
  checkKeyReuse
} from '../../utils/algorithms/advanced/oneTimePad.js';

const OTPPage = () => {
  const [inputText, setInputText] = useState('');
  const [otpKey, setOtpKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showKey, setShowKey] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [keyFormat, setKeyFormat] = useState('text');
  const { trackOperation, isTracking } = useCipherTracking();

  const validateKey = (key, textLength) => {
    if (!key) {
      return 'OTP key is required';
    }
    if (!/^[A-Za-z]+$/.test(key)) {
      return 'Key must contain only letters (A-Z)';
    }
    if (key.replace(/[^A-Z]/gi, '').length < textLength) {
      return `Key must be at least ${textLength} characters long (same as text length)`;
    }
    return null;
  };

  const handleGenerateKey = () => {
    const textLength = inputText.replace(/[^A-Z]/gi, '').length;
    
    if (textLength === 0) {
      setError('Please enter text first before generating key');
      return;
    }
    
    const randomKey = generateRandomKey(textLength);
    setOtpKey(randomKey);
    setError('');
  };

  const handleProcess = async () => {  // ✅ ADD async
  setError('');
  
  if (!inputText.trim()) {
    setError('Please enter text to process');
    return;
  }

  const cleanTextLength = inputText.replace(/[^A-Z]/gi, '').length;
  const keyError = validateKey(otpKey, cleanTextLength);
  if (keyError) {
    setError(keyError);
    return;
  }

  // ✅ START TIMING
  const startTime = performance.now();

  try {
    let output;
    if (mode === 'encrypt') {
      output = otpEncrypt(inputText, otpKey);
    } else {
      output = otpDecrypt(inputText, otpKey);
    }
    
    setResult(output);
    setVisualization(getOTPVisualization(inputText, otpKey));
    
    // Generate analysis for ciphertext
    if (mode === 'encrypt' && output.length >= 10) {
      const analysisData = analyzeOTP(output, otpKey);
      setAnalysis(analysisData);
    } else {
      setAnalysis(null);
    }

    // ✅ TRACK OPERATION
    await trackOperation(
      'One-Time Pad',
      mode,
      startTime,
      inputText,
      output,
      { 
        keyLength: otpKey.length,
        keyPreview: otpKey.substring(0, 20) + (otpKey.length > 20 ? '...' : '')
      }
    );

  } catch (err) {
    setError(err.message);
    console.error('OTP error:', err);
  }
};
  const handleReset = () => {
    setInputText('');
    setOtpKey('');
    setResult('');
    setVisualization(null);
    setError('');
    setAnalysis(null);
    setShowAnalysis(false);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
    }
  };

  const toggleAnalysis = () => {
    setShowAnalysis(!showAnalysis);
  };

  const getKeyInFormat = (key) => {
    if (!key) return '';
    
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    switch (keyFormat) {
      case 'hex':
        return textToHex(cleanKey);
      case 'binary':
        return textToBinary(cleanKey);
      default:
        return cleanKey;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-teal-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              One-Time Pad (OTP)
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Theoretically unbreakable cipher with perfect secrecy (Shannon's theorem)
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> One-Time Pad provides perfect secrecy when used correctly. 
            The key must be truly random, at least as long as the plaintext, and used only once. 
            Use the "Generate Random Key" button for cryptographically secure keys.
          </p>
        </div>


        {/* Warning Note */}
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                CRITICAL: OTP Security Requirements
              </p>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• Key must be <strong>truly random</strong></li>
                <li>• Key must be <strong>at least as long</strong> as the plaintext</li>
                <li>• Key must be <strong>used only once</strong> (never reuse!)</li>
                <li>• Key must be kept <strong>completely secret</strong></li>
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

            {/* Key Format Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Key Display Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setKeyFormat('text')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    keyFormat === 'text'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setKeyFormat('hex')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    keyFormat === 'hex'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Hex
                </button>
                <button
                  onClick={() => setKeyFormat('binary')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    keyFormat === 'binary'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Binary
                </button>
              </div>
            </div>

            {/* OTP Key Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                One-Time Pad Key
              </label>
              <div className="relative">
                <textarea
                  type={showKey ? 'text' : 'password'}
                  value={keyFormat === 'text' ? otpKey : getKeyInFormat(otpKey)}
                  onChange={(e) => keyFormat === 'text' && setOtpKey(e.target.value.replace(/[^A-Za-z]/g, ''))}
                  placeholder="Enter OTP key or generate random..."
                  readOnly={keyFormat !== 'text'}
                  className={`w-full h-24 px-4 py-3 pr-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition ${
                    keyFormat !== 'text' ? 'font-mono text-xs' : ''
                  }`}
                  style={{ resize: 'none' }}
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Key length: {otpKey.replace(/[^A-Z]/gi, '').length} | Required: {inputText.replace(/[^A-Z]/gi, '').length}
              </p>
            </div>

            {/* Generate Random Key Button */}
            <div className="mb-4">
              <button
                onClick={handleGenerateKey}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-teal-500 hover:from-indigo-600 hover:to-teal-600 text-white font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Generate Random Key
              </button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Generates cryptographically secure random key
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
                  <span className="text-gray-600 dark:text-gray-400">Text Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.textLength} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.keyLength} chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key Status:</span>
                  <span className={`font-semibold ${
                    visualization.keyIsRandom 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {visualization.keyIsRandom ? '✓ Random' : '⚠ Non-Random'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Cipher Type:</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    One-Time Pad
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Security:</span>
                  <span className={`font-semibold ${
                    visualization.securityLevel.isPerfect
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {visualization.securityLevel.isPerfect ? 'Perfect' : 'Compromised'}
                  </span>
                </div>
              </div>
            )}

            {/* Security Status */}
            {visualization && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                visualization.securityLevel.isPerfect
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {visualization.securityLevel.isPerfect ? (
                    <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
                  )}
                  <h3 className={`font-semibold ${
                    visualization.securityLevel.isPerfect
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {visualization.securityLevel.level}
                  </h3>
                </div>
                <p className={`text-sm ${
                  visualization.securityLevel.isPerfect
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {visualization.securityLevel.description}
                </p>
                
                {/* Security Issues */}
                {visualization.securityLevel.issues && visualization.securityLevel.issues.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {visualization.securityLevel.issues.map((issue, idx) => (
                      <div 
                        key={idx}
                        className={`text-xs p-2 rounded ${
                          issue.severity === 'critical' 
                            ? 'bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200'
                            : issue.severity === 'high'
                            ? 'bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200'
                            : 'bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-200'
                        }`}
                      >
                        {issue.message}
                      </div>
                    ))}
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

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Entropy
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Value:</span>
                    <span className="font-mono text-gray-900 dark:text-white">
                      {analysis.entropy.value}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {analysis.entropy.percentage} of maximum
                  </p>
                </div>
              </div>
            </div>

            {/* Security Assessment */}
            {analysis.security && (
              <div className={`p-4 rounded-lg border-2 ${
                analysis.security.isPerfect
                  ? 'bg-gradient-to-r from-green-50 to-indigo-50 dark:from-green-900/20 dark:to-indigo-900/20 border-green-400 dark:border-green-600'
                  : 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-400 dark:border-red-600'
              }`}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Security Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Security Level:</p>
                    <p className={`text-2xl font-bold ${
                      analysis.security.isPerfect
                        ? 'text-green-600 dark:text-green-400'
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
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {analysis.security.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Character Mapping Visualization */}
        {visualization && visualization.mapping && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Character-by-Character Encryption
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="border-2 border-indigo-700 px-3 py-2">#</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Plain</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Value</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Key</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Value</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Operation</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Cipher</th>
                    <th className="border-2 border-indigo-700 px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.mapping.slice(0, 20).map((item) => (
                    <tr key={item.position} className="hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-indigo-600 dark:text-indigo-400">
                        {item.position + 1}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-lg text-gray-900 dark:text-white">
                        {item.plainChar}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-600 dark:text-gray-400">
                        {item.plainValue}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-lg text-blue-600 dark:text-blue-400">
                        {item.keyChar}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-600 dark:text-gray-400">
                        {item.keyValue}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-xs text-gray-500 dark:text-gray-400">
                        {item.operation}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        {item.cipherChar}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-600 dark:text-gray-400">
                        {item.cipherValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visualization.mapping.length > 20 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing first 20 of {visualization.mapping.length} characters
              </p>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Formula:</strong> Ciphertext = (Plaintext + Key) mod 26
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Each character is encrypted independently using the corresponding key character.
                This is why the key must be truly random and never reused.
              </p>
            </div>
          </div>
        )}

        {/* About One-Time Pad */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About One-Time Pad (OTP)
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
                  <span>Generate truly random key equal to plaintext length</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Add each key character to corresponding plaintext character (mod 26)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Result is perfectly random ciphertext</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                  <span>Destroy key after single use</span>
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
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Perfect:</span>
                  <span>Theoretically unbreakable security</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Shannon:</span>
                  <span>Proven by Claude Shannon (1949)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Simple:</span>
                  <span>Easy to understand and implement</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 mr-2">Unique:</span>
                  <span>Each message requires unique key</span>
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
                  <span>Mathematically proven unbreakable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Perfect secrecy (Shannon's theorem)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>No computational attack can break it</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Immune to frequency analysis</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Weaknesses & Requirements
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Key must be truly random</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Key must be as long as message</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Key must never be reused</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Key distribution is challenging</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Perfect Secrecy Explanation */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg border-l-4 border-indigo-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Shannon's Perfect Secrecy
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Theorem:</strong> A cipher has perfect secrecy if the ciphertext reveals no information about the plaintext.</p>
              <p><strong>OTP Proof:</strong> For any given ciphertext, every possible plaintext is equally likely.</p>
              <p><strong>Example:</strong> Ciphertext "XYZ" could be "ABC" with key "XYZ", or "DEF" with key "TWV", etc.</p>
              <p><strong>Result:</strong> Even with infinite computing power, an attacker cannot determine which plaintext is correct.</p>
            </div>
          </div>

          {/* Why Key Reuse is Dangerous */}
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              ⚠️ Why Key Reuse is FATAL
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>If the same key is used twice:</strong></p>
              <p>C₁ = P₁ + K (message 1)</p>
              <p>C₂ = P₂ + K (message 2)</p>
              <p><strong>Attacker can compute:</strong></p>
              <p>C₁ ⊕ C₂ = (P₁ + K) ⊕ (P₂ + K) = P₁ ⊕ P₂</p>
              <p className="text-red-700 dark:text-red-300 font-bold">
                The key cancels out! Now attacker can use language statistics to recover both messages.
              </p>
            </div>
          </div>

          {/* Practical Usage */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Practical Usage
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Historical:</strong> Used in "Moscow-Washington hotline" during Cold War</p>
              <p><strong>Modern:</strong> Quantum Key Distribution (QKD) enables practical OTP</p>
              <p><strong>Limitations:</strong> Key distribution problem makes it impractical for most applications</p>
              <p><strong>Alternative:</strong> Modern ciphers (AES, ChaCha20) provide practical security with smaller keys</p>
            </div>
          </div>

          {/* Algorithm Steps */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Encryption Algorithm
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Step 1:</strong> Generate truly random key K with length = plaintext length</p>
              <p><strong>Step 2:</strong> For each character i: C[i] = (P[i] + K[i]) mod 26</p>
              <p><strong>Step 3:</strong> Output ciphertext C</p>
              <p><strong>Step 4:</strong> Securely transmit key K to recipient</p>
              <p><strong>Step 5:</strong> DESTROY key K after single use</p>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-xs font-mono text-gray-700 dark:text-gray-300">
                <strong>Example:</strong><br/>
                Plaintext:  HELLO (7, 4, 11, 11, 14)<br/>
                Random Key: XMCKL (23, 12, 2, 10, 11)<br/>
                Ciphertext: EQNVZ (4, 16, 13, 21, 25)<br/>
                → (7+23)%26=4, (4+12)%26=16, etc.
              </p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The One-Time Pad was invented in 1882 
              and proven to have perfect secrecy by Claude Shannon in 1949. It was famously used during World War II and the Cold War 
              for top-secret communications. The "Moscow-Washington hotline" between US and Soviet leaders used OTP. Despite being 
              theoretically perfect, OTP is rarely used today because the key distribution problem makes it impractical. Modern quantum 
              cryptography (QKD) attempts to solve this by using quantum mechanics to securely distribute keys, potentially making OTP 
              practical again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;