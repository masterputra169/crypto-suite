// src/pages/stream/BBSPage.jsx - COMPLETE FULL VERSION WITH BACKEND INTEGRATION

import { useState } from 'react';
import { Copy, RotateCcw, Shield, Eye, EyeOff, BarChart3, Lightbulb, AlertTriangle, Sparkles, Lock, Activity, TrendingUp } from 'lucide-react';
import { useCipherTracking } from '../../hooks/useCipherTracking';

// Import algorithms
import {
  bbsEncrypt,
  bbsDecrypt,
  getBBSVisualization,
  analyzeBBSParameters,
  generateRandomSeed,
  getRandomBlumPrime,
  textToHex,
  hexToText,
  BBS_PRESETS,
  BLUM_PRIMES,
} from '../../utils/algorithms/stream/bbs.js';

const BBSPage = () => {
  const [inputText, setInputText] = useState('');
  const [seed, setSeed] = useState(12345);
  const [p, setP] = useState(499);
  const [q, setQ] = useState(547);
  const [M, setM] = useState(499 * 547);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showParams, setShowParams] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('SMALL');

  // ✅ USE CIPHER TRACKING HOOK
  const { trackOperation, isTracking } = useCipherTracking();

  const handlePresetChange = (presetName) => {
    setSelectedPreset(presetName);
    const preset = BBS_PRESETS[presetName];
    if (preset) {
      setP(preset.p);
      setQ(preset.q);
      setM(preset.M);
      setError('');
    }
  };

  const handleGenerateRandomSeed = () => {
    const randomSeed = generateRandomSeed(M);
    setSeed(randomSeed);
    setError('');
  };

  const handleGenerateRandomPrimes = (size = 'MEDIUM') => {
    const prime1 = getRandomBlumPrime(size);
    const prime2 = getRandomBlumPrime(size);
    setP(prime1);
    setQ(prime2);
    setM(prime1 * prime2);
    setError('');
  };

  const handleProcess = async () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    // ✅ START TIMING
    const startTime = performance.now();

    try {
      let output;
      if (mode === 'encrypt') {
        output = bbsEncrypt(inputText, seed, p, q, M);
      } else {
        output = bbsDecrypt(inputText, seed, p, q, M);
      }
      
      setResult(output);
      
      // Generate visualization for encryption
      if (mode === 'encrypt') {
        const viz = getBBSVisualization(inputText, seed, p, q, M);
        setVisualization(viz);
        
        // Generate analysis
        const analysisData = analyzeBBSParameters(seed, p, q, M);
        setAnalysis(analysisData);
      } else {
        setVisualization(null);
        setAnalysis(null);
      }

      // ✅ TRACK OPERATION WITH BACKEND
      await trackOperation(
        'BBS Stream Cipher',
        mode,
        startTime,
        inputText,
        output,
        { 
          seed: seed,
          p: p,
          q: q,
          M: M,
          securityLevel: BBS_PRESETS[selectedPreset]?.securityLevel || 'Custom'
        }
      );

    } catch (err) {
      setError(err.message);
      console.error('BBS error:', err);
    }
  };

  const handleReset = () => {
    setInputText('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              BBS Stream Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Blum Blum Shub - Cryptographically Secure Pseudorandom Number Generator
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> BBS generates cryptographically secure keystream using formula: X(n+1) = X(n)² mod M,
            where M = p × q (Blum primes). More secure than LCG but slower. Suitable for educational cryptography!
          </p>
        </div>

        {/* Security Note */}
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 rounded-lg border-2 border-green-400 dark:border-green-600">
          <div className="flex items-start gap-3">
            <Lock className="w-6 h-6 text-green-700 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-green-900 dark:text-green-100 mb-1">
                ✓ Cryptographically Secure (with proper parameters)
              </p>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• <strong>Provably secure</strong> - based on difficulty of factoring</li>
                <li>• <strong>Unpredictable</strong> - cannot be reconstructed from output</li>
                <li>• Use <strong>large primes</strong> (p, q &gt; 1000) for real security</li>
                <li>• Still for <strong>educational purposes</strong> - use modern ciphers in production</li>
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
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300'
                  }`}
                >
                  Decrypt
                </button>
              </div>
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
              className={`w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition ${
                mode === 'decrypt' ? 'font-mono text-sm' : ''
              }`}
            />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {mode === 'encrypt' 
                  ? `${inputText.length} characters`
                  : `${inputText.length} hex characters (${inputText.length / 2} bytes)`
                }
              </p>
            </div>

            {/* Preset Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Security Preset
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 transition"
              >
                {Object.entries(BBS_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name} - {preset.description}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Security Level: <span className="font-semibold">{BBS_PRESETS[selectedPreset]?.securityLevel}</span>
              </p>
            </div>

            {/* BBS Parameters */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  BBS Parameters
                </label>
                <button
                  onClick={() => setShowParams(!showParams)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {showParams ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showParams ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showParams && (
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {/* Seed */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Seed (X₀) - must be coprime with M
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={seed}
                        onChange={(e) => setSeed(Number(e.target.value))}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                      />
                      <button
                        onClick={handleGenerateRandomSeed}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-xs flex items-center gap-1"
                        title="Generate Random Seed"
                      >
                        <Sparkles size={14} />
                        Random
                      </button>
                    </div>
                  </div>

                  {/* Prime p */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Blum Prime p (p ≡ 3 mod 4)
                    </label>
                    <input
                      type="number"
                      value={p}
                      onChange={(e) => {
                        const newP = Number(e.target.value);
                        setP(newP);
                        setM(newP * q);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Prime q */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Blum Prime q (q ≡ 3 mod 4)
                    </label>
                    <input
                      type="number"
                      value={q}
                      onChange={(e) => {
                        const newQ = Number(e.target.value);
                        setQ(newQ);
                        setM(p * newQ);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Generate Random Primes Button */}
                  <button
                    onClick={() => handleGenerateRandomPrimes('MEDIUM')}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Generate Random Blum Primes
                  </button>

                  {/* Modulus M (read-only) */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Modulus M = p × q
                    </label>
                    <input
                      type="number"
                      value={M}
                      readOnly
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-mono"
                    />
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Formula: X(n+1) = X(n)² mod M
                  </div>
                </div>
              )}
            </div>

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
                disabled={isTracking}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
                {mode === 'encrypt' ? 'Ciphertext (Hex)' : 'Plaintext'}
              </label>
              <div className="relative">
                <textarea
                  value={result}
                  readOnly
                  placeholder="Result will appear here..."
                  className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                {result && (
                  <button
                    onClick={() => handleCopy(result)}
                    className="absolute top-2 right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Statistics */}
            {result && visualization && (
              <div className="space-y-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Statistics
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Text Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.textLength} bytes
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Keystream Length:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.keystream.length} values
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ciphertext Size:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.ciphertext.length} hex chars
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Modulus (M):</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {visualization.config.M.toLocaleString()}
                  </span>
                </div>
                {visualization.period && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Period Detected:</span>
                    <span className="font-mono text-yellow-600 dark:text-yellow-400">
                      {visualization.period.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Quality Grade:</span>
                  <span className={`font-semibold ${
                    visualization.quality.overallScore >= 80 
                      ? 'text-green-600 dark:text-green-400' 
                      : visualization.quality.overallScore >= 60
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {visualization.quality.grade} ({visualization.quality.overallScore}/100)
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Security Level:</span>
                  <span className={`font-semibold ${
                    visualization.quality.securityLevel === 'High' 
                      ? 'text-green-600 dark:text-green-400' 
                      : visualization.quality.securityLevel === 'Medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {visualization.quality.securityLevel}
                  </span>
                </div>
              </div>
            )}

            {/* Quality Assessment */}
            {visualization && visualization.quality && (
              <div className={`mt-4 p-4 rounded-lg border-2 ${
                visualization.quality.overallScore >= 80
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                  : visualization.quality.overallScore >= 60
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400 dark:border-yellow-600'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className={`w-5 h-5 ${
                    visualization.quality.overallScore >= 80
                      ? 'text-green-600 dark:text-green-400'
                      : visualization.quality.overallScore >= 60
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                  <h3 className={`font-semibold ${
                    visualization.quality.overallScore >= 80
                      ? 'text-green-800 dark:text-green-200'
                      : visualization.quality.overallScore >= 60
                      ? 'text-yellow-800 dark:text-yellow-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    Quality: {visualization.quality.grade}
                  </h3>
                </div>
                <p className={`text-sm ${
                  visualization.quality.overallScore >= 80
                    ? 'text-green-700 dark:text-green-300'
                    : visualization.quality.overallScore >= 60
                    ? 'text-yellow-700 dark:text-yellow-300'
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {visualization.quality.recommendation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Security Analysis Section */}
        {showAnalysis && analysis && analysis.valid && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
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

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                <strong>Analysis Note:</strong> These tests evaluate the cryptographic quality of the BBS generator.
                BBS is provably secure when using large Blum primes.
              </p>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              {analysis.quality.scores.map((test, idx) => (
                <div 
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    test.passed
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${
                      test.passed
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {test.test}
                    </h3>
                    <span className={`font-mono text-sm ${
                      test.passed
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {test.score}/100
                    </span>
                  </div>
                  <p className={`text-sm ${
                    test.passed
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {test.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Overall Score */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border-2 border-blue-400 dark:border-blue-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Overall Security Score
                </h3>
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {analysis.quality.overallScore}/100
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                Grade: <strong>{analysis.quality.grade}</strong> | 
                Security Level: <strong>{analysis.quality.securityLevel}</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {analysis.quality.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* Keystream Visualization */}
        {visualization && visualization.keystream && visualization.keystream.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Keystream Generation
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border-2 border-blue-700 px-3 py-2">Step</th>
                    <th className="border-2 border-blue-700 px-3 py-2">BBS Value</th>
                    <th className="border-2 border-blue-700 px-3 py-2">Key Byte</th>
                    <th className="border-2 border-blue-700 px-3 py-2">Hex</th>
                    <th className="border-2 border-blue-700 px-3 py-2">Binary</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.keystream.slice(0, 20).map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-blue-600 dark:text-blue-400">
                        {item.step}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-gray-900 dark:text-white">
                        {item.value}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-blue-600 dark:text-blue-400">
                        {item.keyByte}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-green-600 dark:text-green-400">
                        {item.keyByte.toString(16).padStart(2, '0').toUpperCase()}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-mono text-xs text-gray-600 dark:text-gray-400">
                        {item.keyByte.toString(2).padStart(8, '0')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visualization.keystream.length > 20 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing first 20 of {visualization.keystream.length} keystream values
              </p>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Formula:</strong> X(n+1) = X(n)² mod {M}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Key Byte = Extracted from BBS value (8 bits accumulated)
              </p>
            </div>
          </div>
        )}

        {/* Encryption Mapping */}
        {visualization && visualization.mapping && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Byte-by-Byte Encryption
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="border-2 border-blue-700 px-2 py-2">#</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Plain</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Byte</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Binary</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Key</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Binary</th>
                    <th className="border-2 border-blue-700 px-2 py-2">XOR</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Cipher</th>
                    <th className="border-2 border-blue-700 px-2 py-2">Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.mapping.slice(0, 20).map((item) => (
                    <tr key={item.position} className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-bold text-blue-600 dark:text-blue-400">
                        {item.position + 1}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-bold text-gray-900 dark:text-white">
                        {item.plainChar}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-gray-600 dark:text-gray-400">
                        {item.plainByte}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-xs text-gray-500 dark:text-gray-400">
                        {item.plainBinary}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-blue-600 dark:text-blue-400">
                        {item.keyByte}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-xs text-blue-500 dark:text-blue-400">
                        {item.keyBinary}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-xs text-gray-500 dark:text-gray-400">
                        ⊕
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-blue-600 dark:text-blue-400">
                        {item.cipherByte}
                      </td>
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-green-600 dark:text-green-400">
                        {item.cipherHex}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visualization.mapping.length > 20 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Showing first 20 of {visualization.mapping.length} bytes
              </p>
            )}

            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Operation:</strong> Ciphertext Byte = Plaintext Byte ⊕ Key Byte
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                XOR (⊕) is reversible: (A ⊕ B) ⊕ B = A, enabling decryption with same keystream.
              </p>
            </div>
          </div>
        )}

        {/* About BBS */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Blum Blum Shub (BBS)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How it Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Select two large Blum primes p and q (p, q ≡ 3 mod 4)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Calculate modulus M = p × q</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Choose seed X₀ coprime with M (gcd(X₀, M) = 1)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Generate sequence: X(n+1) = X(n)² mod M</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>Extract bits from each value to form key bytes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                  <span>XOR plaintext bytes with key bytes</span>
                </li>
              </ul>
            </div>

            {/* Security */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Security Properties
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Provably Secure:</span>
                  <span>Based on difficulty of integer factorization</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Unpredictable:</span>
                  <span>Cannot reconstruct sequence from output</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">Long Period:</span>
                  <span>Period up to λ(M)/2 where λ is Carmichael function</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">CSPRNG:</span>
                  <span>Cryptographically Secure Pseudorandom Number Generator</span>
                </li>
              </ul>
            </div>

            {/* Strengths */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Advantages
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Cryptographically secure with proper parameters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Provable security reduction to factoring</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Resistant to known cryptanalysis attacks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Simple mathematical foundation</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Limitations
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Slower than modern stream ciphers (AES, ChaCha20)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Requires large primes for real security</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>If p, q are known, entire sequence can be predicted</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Lower bit extraction rate than other PRNGs</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Requirements */}
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Security Requirements
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>1. Blum Primes:</strong> Both p and q must be congruent to 3 modulo 4</p>
              <p><strong>2. Large Primes:</strong> For real security, use p, q &gt; 512 bits (150+ digits)</p>
              <p><strong>3. Coprime Seed:</strong> gcd(X₀, M) = 1 (seed must be coprime with M)</p>
              <p><strong>4. Secret Factorization:</strong> Keep p and q secret - if known, security breaks</p>
              <p><strong>5. One-Time Seed:</strong> Never reuse the same seed for different messages</p>
            </div>
          </div>

          {/* Comparison with LCG */}
<div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
    BBS vs LCG Comparison
  </h3>
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-purple-300 dark:border-purple-700">
          <th className="text-left p-2 text-gray-800 dark:text-white">Property</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">LCG</th>
          <th className="text-left p-2 text-gray-800 dark:text-white">BBS</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Security</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Not secure</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Cryptographically secure</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Speed</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Very fast</td>
          <td className="p-2 text-yellow-600 dark:text-yellow-400">⚠ Slower</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Predictability</td>
          <td className="p-2 text-red-600 dark:text-red-400">❌ Predictable</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Unpredictable</td>
        </tr>
        <tr className="border-b border-purple-200 dark:border-purple-800">
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Setup</td>
          <td className="p-2 text-green-600 dark:text-green-400">✓ Simple</td>
          <td className="p-2 text-yellow-600 dark:text-yellow-400">⚠ Needs Blum primes</td>
        </tr>
        <tr>
          <td className="p-2 font-semibold text-gray-800 dark:text-white">Use Case</td>
          <td className="p-2 text-gray-800 dark:text-white">Education, simulations</td>
          <td className="p-2 text-gray-800 dark:text-white">Education, secure PRNG</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

          

          {/* Mathematical Foundation */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Mathematical Foundation
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Recurrence:</strong> X(n+1) = X(n)² mod M</p>
              <p><strong>Modulus:</strong> M = p × q where p, q are Blum primes</p>
              <p><strong>Blum Prime:</strong> A prime p is a Blum prime if p ≡ 3 (mod 4)</p>
              <p><strong>Security Basis:</strong> Quadratic Residuosity Problem (QRP)</p>
              <p><strong>Period:</strong> Maximum period is λ(M)/2 where λ is Carmichael function</p>
              <p className="mt-3 italic">
                For M = p × q with Blum primes: λ(M) = lcm(p-1, q-1)
              </p>
            </div>
          </div>

          {/* Practical Usage */}
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              ⚠️ Practical Considerations
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Educational Use:</strong> BBS is excellent for learning about provable security and stream ciphers.</p>
              <p><strong>Production Use:</strong> For real applications, use modern alternatives:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>AES-256-CTR:</strong> Fast, hardware-accelerated, widely trusted</li>
                <li><strong>ChaCha20:</strong> Fast software implementation, used in TLS 1.3</li>
                <li><strong>XSalsa20:</strong> Extended nonce version of Salsa20</li>
                <li><strong>/dev/urandom:</strong> System CSPRNG for key generation</li>
              </ul>
              <p className="mt-3 font-bold text-orange-700 dark:text-orange-300">
                This implementation uses small primes for speed - not suitable for real security!
              </p>
            </div>
          </div>

          {/* Historical Note */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> The Blum Blum Shub generator 
              was proposed by Lenore Blum, Manuel Blum, and Michael Shub in 1986. It was one of the first PRNGs with provable 
              security based on the computational hardness of integer factorization (specifically the quadratic residuosity problem). 
              The security proof shows that predicting BBS output is as hard as factoring M = p × q. While BBS is theoretically 
              elegant and provably secure, its slowness compared to modern alternatives (AES-CTR, ChaCha20) limits practical use. 
              However, it remains valuable for educational purposes and in scenarios where provable security guarantees are paramount.
            </p>
          </div>


        </div>
      </div>
    </div>
  );
};

export default BBSPage;