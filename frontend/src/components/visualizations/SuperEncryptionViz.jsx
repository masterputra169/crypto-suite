// src/components/visualizations/SuperEncryptionViz.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { Layers, ArrowRight, Lock, Shield, CheckCircle } from 'lucide-react';

/**
 * SuperEncryptionViz Component
 * Visualizes Super Encryption (multiple cipher layers)
 */
const SuperEncryptionViz = ({ visualization, mode = 'encrypt' }) => {
  const [selectedLayer, setSelectedLayer] = useState(null);

  if (!visualization) return null;

  const { layers, finalResult, originalText } = visualization;

  // Get color for each cipher layer
  const getLayerColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-orange-500 to-orange-600',
      'from-green-500 to-green-600',
    ];
    return colors[index % colors.length];
  };

  const getBorderColor = (index) => {
    const colors = [
      'border-blue-500',
      'border-purple-500',
      'border-pink-500',
      'border-orange-500',
      'border-green-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Super Encryption Visualization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Multiple encryption layers applied sequentially
            </p>
          </div>
          <Badge variant="primary">
            {layers.length} Layers
          </Badge>
        </div>
      </Card>

      {/* Encryption Flow */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Encryption Flow
        </h3>

        <div className="space-y-4">
          {/* Original Text */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Original Text
              </span>
            </div>
            <p className="font-mono text-lg text-gray-900 dark:text-white break-all">
              {originalText}
            </p>
          </div>

          {/* Arrow Down */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
          </div>

          {/* Encryption Layers */}
          {layers.map((layer, index) => (
            <div key={index}>
              {/* Layer Card */}
              <div
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedLayer === index
                    ? `ring-4 ring-yellow-400 scale-105 ${getBorderColor(index)}`
                    : `${getBorderColor(index)} hover:scale-102`
                }`}
                onClick={() => setSelectedLayer(selectedLayer === index ? null : index)}
              >
                {/* Layer Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-gradient-to-br ${getLayerColor(index)} rounded-lg`}>
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Layer {index + 1}: {layer.algorithm}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Key: {layer.key}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Applied
                  </Badge>
                </div>

                {/* Input/Output Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Input</p>
                    <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700">
                      <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                        {layer.input.substring(0, 50)}
                        {layer.input.length > 50 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Output</p>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="font-mono text-sm text-green-700 dark:text-green-300 break-all">
                        {layer.output.substring(0, 50)}
                        {layer.output.length > 50 ? '...' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedLayer === index && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {/* Full Text Display */}
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Complete Input:
                      </p>
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <p className="font-mono text-sm text-blue-900 dark:text-blue-100 break-all">
                          {layer.input}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Complete Output:
                      </p>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded">
                        <p className="font-mono text-sm text-green-900 dark:text-green-100 break-all">
                          {layer.output}
                        </p>
                      </div>
                    </div>

                    {/* Algorithm Details */}
                    {layer.details && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Algorithm Details:
                        </p>
                        <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                          {Object.entries(layer.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-mono font-bold text-gray-900 dark:text-white">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Arrow Down (if not last layer) */}
              {index < layers.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                </div>
              )}
            </div>
          ))}

          {/* Arrow Down to Final Result */}
          <div className="flex justify-center">
            <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
          </div>

          {/* Final Result */}
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-400 dark:border-green-700">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Final Encrypted Result
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-green-800 dark:text-green-200 break-all">
              {finalResult}
            </p>
          </div>
        </div>
      </Card>

      {/* Layer Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Encryption Layers Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layers.map((layer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getBorderColor(index)} hover:shadow-lg transition-all cursor-pointer`}
              onClick={() => setSelectedLayer(index)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 bg-gradient-to-br ${getLayerColor(index)} rounded-lg`}>
                  <span className="text-white font-bold">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                    {layer.algorithm}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Key: {layer.key}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Input Length:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {layer.input.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Output Length:</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {layer.output.length}
                  </span>
                </div>
                {layer.executionTime && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time:</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {layer.executionTime}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Statistics */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Encryption Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Layers</p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {layers.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Original Length</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {originalText.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Final Length</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {finalResult.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Time</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {layers.reduce((sum, layer) => sum + (layer.executionTime || 0), 0)}ms
            </p>
          </div>
        </div>
      </Card>

      {/* Security Info */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Enhanced Security
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Super encryption combines multiple cipher algorithms, significantly increasing security. 
              Each layer adds complexity, making cryptanalysis exponentially more difficult. Even if one 
              cipher is compromised, the others protect the data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

SuperEncryptionViz.propTypes = {
  visualization: PropTypes.shape({
    layers: PropTypes.arrayOf(PropTypes.shape({
      algorithm: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      input: PropTypes.string.isRequired,
      output: PropTypes.string.isRequired,
      executionTime: PropTypes.number,
      details: PropTypes.object,
    })).isRequired,
    finalResult: PropTypes.string.isRequired,
    originalText: PropTypes.string.isRequired,
  }),
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
};

export default SuperEncryptionViz;