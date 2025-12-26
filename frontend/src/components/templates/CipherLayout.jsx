// src/components/templates/CipherLayout.jsx

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '../atoms/Card';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { 
  Info, 
  BookOpen, 
  History, 
  Settings,
  ChevronRight,
  ChevronDown,
  Save,
  Share2,
  Download,
  Clock
} from 'lucide-react';

/**
 * CipherLayout Component - Template
 * Specialized layout for cipher algorithm pages
 * Provides consistent structure for all cipher implementations
 */
const CipherLayout = ({
  // Algorithm Info
  algorithmName,
  algorithmType, // substitution, polygram, transposition
  algorithmCategory,
  description,
  difficulty, // easy, medium, hard
  securityLevel, // low, medium, high
  
  // Main Content
  children,
  
  // Side Panel Content
  cipherPanel,
  visualizationPanel,
  statisticsPanel,
  
  // Features
  showInfo = true,
  showHistory = true,
  showSettings = true,
  
  // Layout Options
  layoutMode = 'standard', // standard, split, full
  
  // Callbacks
  onSave,
  onShare,
  onExport,
  onReset,
  
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('cipher');
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [recentHistory, setRecentHistory] = useState([]);
  const [savedConfigs, setSavedConfigs] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem(`${algorithmName}_history`) || '[]');
    setRecentHistory(history.slice(0, 5));
    
    const configs = JSON.parse(localStorage.getItem(`${algorithmName}_configs`) || '[]');
    setSavedConfigs(configs);
  }, [algorithmName]);

  // Get difficulty badge color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  // Get security level badge color
  const getSecurityColor = () => {
    switch (securityLevel) {
      case 'low': return 'danger';
      case 'medium': return 'warning';
      case 'high': return 'success';
      default: return 'secondary';
    }
  };

  // Algorithm Info Panel
  const InfoPanel = () => (
    <Card className="mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
            <Info className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Algorithm Information
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {algorithmType} • {algorithmCategory}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={getDifficultyColor()} size="sm">
            {difficulty}
          </Badge>
          <Badge variant={getSecurityColor()} size="sm">
            Security: {securityLevel}
          </Badge>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-gray-700 dark:text-gray-300">
          {description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Type</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {algorithmType}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Category</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {algorithmCategory}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Difficulty</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {difficulty}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Security</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
            {securityLevel}
          </p>
        </div>
      </div>
    </Card>
  );

  // History Panel
  const HistoryPanel = () => (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Operations
          </h3>
        </div>
        <button 
          onClick={() => setShowHistoryPanel(!showHistoryPanel)}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          {showHistoryPanel ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {showHistoryPanel && (
        <>
          {recentHistory.length > 0 ? (
            <div className="space-y-2">
              {recentHistory.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.input?.slice(0, 40)}...
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.mode} • {item.timestamp}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-gray-400 ml-2" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No recent operations
            </p>
          )}
        </>
      )}
    </Card>
  );

  // Saved Configurations Panel
  const ConfigsPanel = () => (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Save className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Saved Configurations
          </h3>
        </div>
        <Badge variant="primary" size="sm">
          {savedConfigs.length}
        </Badge>
      </div>

      {savedConfigs.length > 0 ? (
        <div className="space-y-2">
          {savedConfigs.map((config, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {config.name || `Config ${index + 1}`}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Saved on {config.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Load
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No saved configurations
        </p>
      )}
    </Card>
  );

  // Action Bar
  const ActionBar = () => (
    <div className="flex items-center gap-2 flex-wrap">
      {onSave && (
        <Button
          variant="outline"
          size="sm"
          icon={<Save size={16} />}
          onClick={onSave}
        >
          Save
        </Button>
      )}
      {onShare && (
        <Button
          variant="outline"
          size="sm"
          icon={<Share2 size={16} />}
          onClick={onShare}
        >
          Share
        </Button>
      )}
      {onExport && (
        <Button
          variant="outline"
          size="sm"
          icon={<Download size={16} />}
          onClick={onExport}
        >
          Export
        </Button>
      )}
      {showInfo && (
        <Button
          variant="ghost"
          size="sm"
          icon={<Info size={16} />}
          onClick={() => setShowInfoPanel(!showInfoPanel)}
        >
          Info
        </Button>
      )}
      {showSettings && (
        <Button
          variant="ghost"
          size="sm"
          icon={<Settings size={16} />}
        >
          Settings
        </Button>
      )}
    </div>
  );

  // Tab Navigation
  const TabNavigation = () => (
    <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
      <nav className="flex gap-4">
        <button
          onClick={() => setActiveTab('cipher')}
          className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'cipher'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Cipher Tool
        </button>
        {visualizationPanel && (
          <button
            onClick={() => setActiveTab('visualization')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'visualization'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Visualization
          </button>
        )}
        {statisticsPanel && (
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'statistics'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Statistics
          </button>
        )}
      </nav>
    </div>
  );

  // Render layout based on mode
  const renderLayout = () => {
    switch (layoutMode) {
      case 'split':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {cipherPanel || children}
            </div>
            <div className="space-y-6">
              {visualizationPanel}
              {statisticsPanel}
            </div>
          </div>
        );

      case 'full':
        return (
          <div className="space-y-6">
            {cipherPanel || children}
            {visualizationPanel}
            {statisticsPanel}
          </div>
        );

      case 'standard':
      default:
        return (
          <>
            <TabNavigation />
            <div className="space-y-6">
              {activeTab === 'cipher' && (cipherPanel || children)}
              {activeTab === 'visualization' && visualizationPanel}
              {activeTab === 'statistics' && statisticsPanel}
            </div>
          </>
        );
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {algorithmName}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {algorithmType} Cipher • {algorithmCategory}
          </p>
        </div>

        <ActionBar />
      </div>

      {/* Info Panel (collapsible) */}
      {showInfo && showInfoPanel && <InfoPanel />}

      {/* History Panel */}
      {showHistory && <HistoryPanel />}

      {/* Saved Configs */}
      {savedConfigs.length > 0 && <ConfigsPanel />}

      {/* Main Content */}
      {renderLayout()}

      {/* Documentation Link */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-600 rounded-lg">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read the documentation to learn more about {algorithmName}
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm">
            View Docs
          </Button>
        </div>
      </Card>
    </div>
  );
};

// PropTypes
CipherLayout.propTypes = {
  algorithmName: PropTypes.string.isRequired,
  algorithmType: PropTypes.oneOf(['substitution', 'polygram', 'transposition']).isRequired,
  algorithmCategory: PropTypes.string,
  description: PropTypes.string,
  difficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
  securityLevel: PropTypes.oneOf(['low', 'medium', 'high']),
  
  children: PropTypes.node,
  cipherPanel: PropTypes.node,
  visualizationPanel: PropTypes.node,
  statisticsPanel: PropTypes.node,
  
  showInfo: PropTypes.bool,
  showHistory: PropTypes.bool,
  showSettings: PropTypes.bool,
  
  layoutMode: PropTypes.oneOf(['standard', 'split', 'full']),
  
  onSave: PropTypes.func,
  onShare: PropTypes.func,
  onExport: PropTypes.func,
  onReset: PropTypes.func,
  
  className: PropTypes.string,
};

export default CipherLayout;