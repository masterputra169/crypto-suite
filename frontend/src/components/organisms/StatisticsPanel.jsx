// src/components/organisms/StatisticsPanel.jsx

import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import { 
  FileText, 
  Lock, 
  Unlock, 
  Hash, 
  BarChart2, 
  Clock,
  Zap,
  Shield,
  TrendingUp
} from 'lucide-react';

const StatisticsPanel = ({ data }) => {
  // Calculate statistics
  const calculateStats = () => {
    if (!data || !data.original) {
      return null;
    }

    const original = data.original;
    const encrypted = data.encrypted || '';
    
    // Character counts
    const originalLength = original.length;
    const encryptedLength = encrypted.length;
    const originalUnique = new Set(original.toUpperCase().replace(/[^A-Z]/g, '')).size;
    const encryptedUnique = new Set(encrypted.toUpperCase().replace(/[^A-Z]/g, '')).size;

    // Calculate entropy
    const calculateEntropy = (text) => {
      const freq = {};
      const cleanText = text.toUpperCase().replace(/[^A-Z]/g, '');
      
      for (let char of cleanText) {
        freq[char] = (freq[char] || 0) + 1;
      }

      let entropy = 0;
      const len = cleanText.length;
      
      for (let count of Object.values(freq)) {
        const p = count / len;
        entropy -= p * Math.log2(p);
      }

      return entropy.toFixed(3);
    };

    const originalEntropy = calculateEntropy(original);
    const encryptedEntropy = encrypted ? calculateEntropy(encrypted) : 0;

    // Performance metrics
    const encryptTime = data.metrics?.encryptTime || 0;
    const decryptTime = data.metrics?.decryptTime || 0;
    const throughput = data.metrics?.throughput || 
      (encryptTime > 0 ? ((originalLength / 1024) / (encryptTime / 1000)).toFixed(2) : 0);

    return {
      originalLength,
      encryptedLength,
      originalUnique,
      encryptedUnique,
      originalEntropy,
      encryptedEntropy,
      encryptTime,
      decryptTime,
      throughput,
      compressionRatio: ((encryptedLength / originalLength) * 100).toFixed(1)
    };
  };

  const stats = calculateStats();

  if (!stats) {
    return (
      <Card className="w-full">
        <div className="text-center py-8 text-gray-400">
          <BarChart2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No statistics available</p>
          <p className="text-sm">Process some text to see statistics</p>
        </div>
      </Card>
    );
  }

  const StatItem = ({ icon: Icon, label, value, unit, color = 'gray' }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
      <div className={`p-2 bg-${color}-100 dark:bg-${color}-900/30 rounded-lg`}>
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {value} {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Statistics & Analysis
          </h3>
          <Badge variant="primary">
            Live Data
          </Badge>
        </div>

        {/* Text Statistics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Text Metrics
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatItem
              icon={FileText}
              label="Original Length"
              value={stats.originalLength}
              unit="chars"
              color="blue"
            />
            <StatItem
              icon={Lock}
              label="Encrypted Length"
              value={stats.encryptedLength}
              unit="chars"
              color="purple"
            />
            <StatItem
              icon={Hash}
              label="Unique (Original)"
              value={stats.originalUnique}
              unit="chars"
              color="green"
            />
            <StatItem
              icon={Hash}
              label="Unique (Encrypted)"
              value={stats.encryptedUnique}
              unit="chars"
              color="orange"
            />
          </div>
        </div>

        {/* Entropy Analysis */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Entropy Analysis
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatItem
              icon={BarChart2}
              label="Original Entropy"
              value={stats.originalEntropy}
              unit="bits"
              color="indigo"
            />
            <StatItem
              icon={Shield}
              label="Encrypted Entropy"
              value={stats.encryptedEntropy}
              unit="bits"
              color="pink"
            />
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              <strong>Info:</strong> Higher entropy indicates better randomness. 
              Maximum entropy for English text ≈ 4.7 bits. Encrypted text should approach log₂(26) ≈ 4.7 bits.
            </p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Performance
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <StatItem
              icon={Clock}
              label="Encryption Time"
              value={stats.encryptTime}
              unit="ms"
              color="cyan"
            />
            <StatItem
              icon={Unlock}
              label="Decryption Time"
              value={stats.decryptTime}
              unit="ms"
              color="teal"
            />
            <StatItem
              icon={Zap}
              label="Throughput"
              value={stats.throughput}
              unit="KB/s"
              color="yellow"
            />
            <StatItem
              icon={TrendingUp}
              label="Size Ratio"
              value={stats.compressionRatio}
              unit="%"
              color="red"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Analysis Quality:
            </span>
            <Badge variant={stats.encryptedEntropy > 4.0 ? 'success' : 'warning'}>
              {stats.encryptedEntropy > 4.0 ? 'Good Randomness' : 'Low Randomness'}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

// PropTypes
StatisticsPanel.propTypes = {
  data: PropTypes.shape({
    original: PropTypes.string,
    encrypted: PropTypes.string,
    metrics: PropTypes.shape({
      encryptTime: PropTypes.number,
      decryptTime: PropTypes.number,
      throughput: PropTypes.number,
    }),
  }),
};

export default StatisticsPanel;