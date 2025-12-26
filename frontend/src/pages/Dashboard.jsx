// src/pages/Dashboard.jsx - FIXED VERSION

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  Activity,
  BarChart3,
  Award,
  Download,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import cipherService from '../utils/api/cipherService';

const Dashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentOperations, setRecentOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const statsResponse = await cipherService.getStatistics();
      setStatistics(statsResponse.data);

      const leaderboardResponse = await cipherService.getLeaderboard();
      setLeaderboard(leaderboardResponse.data);

      // Mock recent operations - replace with actual API call later
      setRecentOperations([]);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      // Fetch full history
      const historyResponse = await cipherService.getHistory({ limit: 1000 });
      
      const exportData = {
        user: user?.username,
        exported_at: new Date().toISOString(),
        statistics: statistics,
        history: historyResponse.data || [],
        total_records: historyResponse.count || 0
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crypto-suite-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleExportCSV = async () => {
    try {
      // Fetch full history
      const historyResponse = await cipherService.getHistory({ limit: 1000 });
      const history = historyResponse.data || [];
      
      if (history.length === 0) {
        alert('No data to export');
        return;
      }

      // CSV Headers
      const headers = [
        'Date',
        'Cipher Type',
        'Operation',
        'Input Text',
        'Output Text',
        'Key/Configuration',
        'Time Spent (s)',
        'Input Length',
        'Output Length'
      ];

      // CSV Rows
      const rows = history.map(item => [
        new Date(item.created_at).toLocaleString(),
        item.cipher_type,
        item.operation,
        `"${item.input_text.replace(/"/g, '""')}"`, // Escape quotes
        `"${item.output_text.replace(/"/g, '""')}"`,
        JSON.stringify(item.key_data).replace(/"/g, '""'),
        item.time_spent,
        item.input_length,
        item.output_length
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crypto-suite-history-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  
  // ✅ FIXED: Format time in SECONDS
const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return '0s';
  
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

  const getCipherIcon = (cipherType) => {
    const iconMap = {
      'Caesar Cipher': '🔐',
      'Vigenère Cipher': '🔑',
      'Beaufort Cipher': '⚓',
      'Autokey Cipher': '🗝️',
      'Playfair Cipher': '📊',
      'Hill Cipher': '📈'
    };
    return iconMap[cipherType] || '🔒';
  };

  // ✅ FIX: Safe number conversion helper
  const safeToFixed = (value, decimals = 2) => {
    if (value === null || value === undefined) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const { overall, ciphers } = statistics || {};
  const totalOperations = (overall?.total_encryptions || 0) + (overall?.total_decryptions || 0);
  const totalCiphersUsed = ciphers?.length || 0;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header with Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Welcome back, {user?.full_name || user?.username}! 👋
            </p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={loadDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Operations */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {totalOperations}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Total Operations</p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-green-400">{overall?.total_encryptions || 0} encrypts</span>
              <span className="text-gray-500">•</span>
              <span className="text-blue-400">{overall?.total_decryptions || 0} decrypts</span>
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {formatTime(overall?.total_time_spent || 0)}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Time Spent</p>
          </div>

          {/* Ciphers Used */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {totalCiphersUsed}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Ciphers Used</p>
          </div>

          {/* Favorite Cipher */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white truncate">
              {overall?.favorite_cipher || 'None yet'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Favorite Cipher</p>
          </div>
        </div>

        {/* Algorithm Performance Cards */}
        {ciphers && ciphers.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Algorithm Performance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ciphers.map((cipher, idx) => {
                // ✅ FIX: Safe calculations - time_spent is in SECONDS
                const attempts = cipher.attempts || 0;
                const timeSpent = cipher.time_spent || 0; // in seconds
                const avgTime = attempts > 0 ? timeSpent / attempts : 0; // in seconds
                const successRate = cipher.success_rate || 0;

                return (
                  <div 
                    key={idx}
                    className="bg-gray-700/50 rounded-lg p-5 border border-gray-600/50 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl">{getCipherIcon(cipher.cipher_type)}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {attempts} ops
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-3 text-lg">
                      {cipher.cipher_type}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Operations:</span>
                        <span className="font-semibold text-white">{attempts}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Avg Time:</span>
                        <span className="font-semibold text-blue-400">
                          {safeToFixed(avgTime, 2)}s
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Time:</span>
                        <span className="font-semibold text-purple-400">
                          {formatTime(timeSpent)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="font-semibold text-green-400">
                          {safeToFixed(successRate, 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Operations Table */}
        {recentOperations && recentOperations.length > 0 && (
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Recent Operations
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Algorithm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Operation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {recentOperations.slice(0, 10).map((op, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {op.cipher_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded text-xs ${
                          op.operation === 'encrypt' 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {op.operation}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {safeToFixed(op.duration, 2)} ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(op.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Global Leaderboard */}
        {leaderboard && leaderboard.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700/50">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </h2>
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                    entry.username === user?.username
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : 'bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50'
                  }`}
                >
                  <div className="flex-shrink-0 w-8 text-center">
                    {idx === 0 && <span className="text-2xl">🥇</span>}
                    {idx === 1 && <span className="text-2xl">🥈</span>}
                    {idx === 2 && <span className="text-2xl">🥉</span>}
                    {idx > 2 && <span className="text-gray-400 font-bold">#{idx + 1}</span>}
                  </div>

                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {entry.avatar_url ? (
                        <img 
                          src={entry.avatar_url} 
                          alt={entry.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {entry.username?.[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {entry.full_name || entry.username}
                      {entry.username === user?.username && (
                        <span className="ml-2 text-xs text-blue-400">(You)</span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">
                      {getCipherIcon(entry.favorite_cipher)} {entry.favorite_cipher || 'No favorite'}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {entry.total_operations}
                    </p>
                    <p className="text-xs text-gray-400">operations</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!ciphers || ciphers.length === 0) && (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700/50">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Activity Yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start using cipher tools to see your statistics here.
            </p>
            <a
              href="/caesar"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Try Caesar Cipher
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;