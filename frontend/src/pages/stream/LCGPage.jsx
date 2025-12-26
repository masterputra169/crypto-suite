// src/pages/stream/LCGPage.jsx

import { useState } from 'react';
import { Copy, RotateCcw, Zap, Eye, EyeOff, BarChart3, Lightbulb, AlertTriangle, Sparkles, TrendingUp, Activity } from 'lucide-react';

// Import algorithms
import {
  lcgEncrypt,
  lcgDecrypt,
  getLCGVisualization,
  analyzeLCGParameters,
  generateRandomSeed,
  textToHex,
  hexToText,
  LCG_PRESETS,
} from '../../utils/algorithms/stream/lcg.js';

const LCGPage = () => {
  const [inputText, setInputText] = useState('');
  const [seed, setSeed] = useState(12345);
  const [multiplier, setMultiplier] = useState(1664525);
  const [increment, setIncrement] = useState(1013904223);
  const [modulus, setModulus] = useState(4294967296);
  const [mode, setMode] = useState('encrypt');
  const [result, setResult] = useState('');
  const [visualization, setVisualization] = useState(null);
  const [showParams, setShowParams] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('NUMERICAL_RECIPES');

  const handlePresetChange = (presetName) => {
    setSelectedPreset(presetName);
    const preset = LCG_PRESETS[presetName];
    if (preset) {
      setMultiplier(preset.multiplier);
      setIncrement(preset.increment);
      setModulus(preset.modulus);
      setError('');
    }
  };

  const handleGenerateRandomSeed = () => {
    const randomSeed = generateRandomSeed(modulus);
    setSeed(randomSeed);
    setError('');
  };

  const handleProcess = () => {
    setError('');
    
    if (!inputText.trim()) {
      setError('Please enter text to process');
      return;
    }

    try {
      let output;
      if (mode === 'encrypt') {
        output = lcgEncrypt(inputText, seed, multiplier, increment, modulus);
      } else {
        output = lcgDecrypt(inputText, seed, multiplier, increment, modulus);
      }
      
      setResult(output);
      
      // Generate visualization for encryption
      if (mode === 'encrypt') {
        const viz = getLCGVisualization(inputText, seed, multiplier, increment, modulus);
        setVisualization(viz);
        
        // Generate analysis
        const analysisData = analyzeLCGParameters(seed, multiplier, increment, modulus);
        setAnalysis(analysisData);
      } else {
        setVisualization(null);
        setAnalysis(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('LCG error:', err);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              LCG Stream Cipher
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Linear Congruential Generator - Pseudorandom keystream cipher
          </p>
        </div>

        {/* Info Note */}
        <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-lg border border-blue-300 dark:border-blue-700">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> LCG generates pseudorandom keystream using formula: X(n+1) = (a × X(n) + c) mod m.
            The keystream is XORed with plaintext for encryption. Educational purposes only - not cryptographically secure!
          </p>
        </div>

        {/* Warning Note */}
        <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-yellow-900 dark:text-yellow-100 mb-1">
                WARNING: Not Cryptographically Secure
              </p>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                <li>• LCG is <strong>predictable</strong> - attackers can reconstruct the keystream</li>
                <li>• <strong>Short period</strong> - keystream repeats after m values</li>
                <li>• For <strong>educational purposes only</strong> - never use in production</li>
                <li>• Use modern ciphers (AES, ChaCha20) for real security</li>
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
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300'
                  }`}
                >
                  Encrypt
                </button>
                <button
                  onClick={() => setMode('decrypt')}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    mode === 'decrypt'
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-700 dark:hover:text-purple-300'
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
                className="w-full h-32 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 transition font-mono text-sm"
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
                Preset Parameters
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 transition"
              >
                {Object.entries(LCG_PRESETS).map(([key, preset]) => (
                  <option key={key} value={key}>
                    {preset.name} - {preset.description}
                  </option>
                ))}
              </select>
            </div>

            {/* LCG Parameters */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  LCG Parameters
                </label>
                <button
                  onClick={() => setShowParams(!showParams)}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
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
                      Seed (X₀)
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
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition text-xs flex items-center gap-1"
                        title="Generate Random Seed"
                      >
                        <Sparkles size={14} />
                        Random
                      </button>
                    </div>
                  </div>

                  {/* Multiplier */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Multiplier (a)
                    </label>
                    <input
                      type="number"
                      value={multiplier}
                      onChange={(e) => setMultiplier(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Increment */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Increment (c)
                    </label>
                    <input
                      type="number"
                      value={increment}
                      onChange={(e) => setIncrement(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  {/* Modulus */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Modulus (m)
                    </label>
                    <input
                      type="number"
                      value={modulus}
                      onChange={(e) => setModulus(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    />
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Formula: X(n+1) = (a × X(n) + c) mod m
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
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition shadow-lg hover:shadow-xl"
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
                    className="absolute top-2 right-2 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Statistics */}
            {result && visualization && (
              <div className="space-y-3 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
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
                {visualization.period && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Period Detected:</span>
                    <span className="font-mono text-yellow-600 dark:text-yellow-400">
                      {visualization.period}
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

        {/* Analysis Section */}
        {showAnalysis && analysis && analysis.valid && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  Quality Analysis
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
                <strong>Analysis Note:</strong> These tests evaluate the statistical quality of the LCG generator.
                Higher scores indicate better randomness properties.
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
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-400 dark:border-purple-600">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Overall Quality Score
                </h3>
                <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {analysis.quality.overallScore}/100
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Grade: <strong>{analysis.quality.grade}</strong>
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
                  <tr className="bg-purple-600 text-white">
                    <th className="border-2 border-purple-700 px-3 py-2">Step</th>
                    <th className="border-2 border-purple-700 px-3 py-2">LCG Value</th>
                    <th className="border-2 border-purple-700 px-3 py-2">Key Byte</th>
                    <th className="border-2 border-purple-700 px-3 py-2">Hex</th>
                    <th className="border-2 border-purple-700 px-3 py-2">Binary</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.keystream.slice(0, 20).map((item, idx) => (
                    <tr key={idx} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-3 py-2 text-center font-bold text-purple-600 dark:text-purple-400">
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
                <strong>Formula:</strong> X(n+1) = ({multiplier} × X(n) + {increment}) mod {modulus}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Key Byte = LCG Value mod 256
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
                  <tr className="bg-purple-600 text-white">
                    <th className="border-2 border-purple-700 px-2 py-2">#</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Plain</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Byte</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Binary</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Key</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Binary</th>
                    <th className="border-2 border-purple-700 px-2 py-2">XOR</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Cipher</th>
                    <th className="border-2 border-purple-700 px-2 py-2">Hex</th>
                  </tr>
                </thead>
                <tbody>
                  {visualization.mapping.slice(0, 20).map((item) => (
                    <tr key={item.position} className="hover:bg-purple-50 dark:hover:bg-purple-900/20">
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-bold text-purple-600 dark:text-purple-400">
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
                      <td className="border-2 border-gray-300 dark:border-gray-600 px-2 py-2 text-center font-mono text-purple-600 dark:text-purple-400">
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
                XOR (⊕) is reversible: (A ⊕ B) ⊕ B = A, which allows decryption with the same keystream.
              </p>
            </div>
          </div>
        )}

        {/* About LCG */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            About Linear Congruential Generator (LCG)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it Works */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                How it Works
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span>Generate pseudorandom numbers using formula: X(n+1) = (a × X(n) + c) mod m</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span>Convert each LCG value to byte (0-255) using modulo 256</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span>XOR each plaintext byte with corresponding key byte</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                  <span>Result is encrypted ciphertext (usually represented as hex)</span>
                </li>
              </ul>
            </div>

            {/* Parameters */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                LCG Parameters
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">X₀:</span>
                  <span>Seed - initial value (must be secret)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">a:</span>
                  <span>Multiplier - determines period and quality</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">c:</span>
                  <span>Increment - can be zero (multiplicative LCG)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold text-purple-600 dark:text-purple-400 mr-2">m:</span>
                  <span>Modulus - defines maximum period (usually 2³¹ or 2³²)</span>
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
                  <span>Very fast - only multiplication and addition</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Memory efficient - only stores current state</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Simple to implement and understand</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  <span>Suitable for educational purposes</span>
                </li>
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                Weaknesses & Limitations
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Predictable - not cryptographically secure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Short period - repeats after at most m values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Lower bits have shorter periods</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                  <span>Can be broken with known plaintext attack</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Warning */}
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              ⚠️ Security Warning
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>LCG is NOT cryptographically secure.</strong> Never use it for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encrypting sensitive data</li>
                <li>Generating cryptographic keys</li>
                <li>Password protection</li>
                <li>Any real-world security application</li>
              </ul>
              <p className="mt-3 font-bold text-red-700 dark:text-red-300">
                Use modern cryptographic algorithms like AES-256, ChaCha20, or XSalsa20 for real encryption needs.
              </p>
            </div>
          </div>

          {/* Attack Vulnerability */}
          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Known Plaintext Attack
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>If an attacker knows just a few plaintext-ciphertext pairs:</strong></p>
              <p>1. They can calculate key bytes: K = P ⊕ C</p>
              <p>2. With 3+ consecutive key bytes, they can reconstruct LCG parameters (a, c, m)</p>
              <p>3. Once parameters are known, entire keystream can be regenerated</p>
              <p>4. All encrypted messages become readable</p>
              <p className="mt-3 font-bold">
                This is why LCG is only suitable for demonstrations and learning!
              </p>
            </div>
          </div>

          {/* Historical Context */}
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-l-4 border-indigo-600">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-indigo-600 dark:text-indigo-400">Historical Note:</strong> LCG was developed by 
              D. H. Lehmer in 1949 for Monte Carlo simulations. It was widely used in early programming languages 
              (rand() function in C, Java's Random class in early versions) for general random number generation. 
              While excellent for simulations and games, LCG should never be used for cryptographic purposes. Modern 
              systems use cryptographically secure PRNGs like Fortuna, Yarrow, or hardware RNGs for security applications.
            </p>
          </div>

          {/* Common Presets */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-600">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
              Common LCG Implementations
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              {Object.entries(LCG_PRESETS).map(([key, preset]) => (
                <div key={key}>
                  <p className="font-bold text-purple-700 dark:text-purple-300">{preset.name}</p>
                  <p className="text-xs">
                    a={preset.multiplier}, c={preset.increment}, m={preset.modulus}
                  </p>
                  <p className="text-xs italic">{preset.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCGPage;