// src/components/molecules/ResultDisplay.jsx

import PropTypes from 'prop-types';
import { useState } from 'react';
import { Copy, Check, Download, Eye, EyeOff, Share2 } from 'lucide-react';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

/**
 * ResultDisplay Component - Molecule
 * Display encrypted/decrypted results with copy, download, and share features
 */
const ResultDisplay = ({ 
  result,
  label = 'Result',
  mode = 'encrypt', // encrypt or decrypt
  
  // Visual
  variant = 'default', // default, gradient, minimal
  showStats = true,
  
  // Features
  showCopy = true,
  showDownload = false,
  showShare = false,
  showVisibilityToggle = false,
  
  // Formatting
  formatting = 'none', // none, spaces, blocks
  blockSize = 5,
  
  // Callbacks
  onCopy,
  onDownload,
  onShare,
  
  className = '',
  ...props 
}) => {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(true);

  // Handle copy
  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      
      if (onCopy) {
        onCopy(result);
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (!result) return;

    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}-result-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    if (onDownload) {
      onDownload(result);
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!result) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} Text`,
          text: result,
        });

        if (onShare) {
          onShare(result);
        }
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopy();
    }
  };

  // Format result
  const formatResult = (text) => {
    if (!text || formatting === 'none') return text;

    if (formatting === 'spaces') {
      return text.match(new RegExp(`.{1,${blockSize}}`, 'g'))?.join(' ') || text;
    }

    if (formatting === 'blocks') {
      const blocks = text.match(new RegExp(`.{1,${blockSize}}`, 'g')) || [];
      return blocks.join('\n');
    }

    return text;
  };

  const displayResult = formatResult(result);

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800';
      case 'minimal':
        return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800';
    }
  };

  // Empty state
  if (!result) {
    return (
      <div className={className}>
        {label && <Label>{label}</Label>}
        <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-400 dark:text-gray-500">
            Results will appear here...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Label with Badge */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <Label>{label}</Label>
          <Badge 
            variant={mode === 'encrypt' ? 'success' : 'primary'}
            size="sm"
          >
            {mode === 'encrypt' ? 'Encrypted' : 'Decrypted'}
          </Badge>
        </div>
      )}

      {/* Result Display */}
      <div className={`p-4 rounded-lg ${getVariantStyles()}`}>
        {visible ? (
          <p className="text-lg font-mono text-gray-800 dark:text-gray-100 break-all leading-relaxed whitespace-pre-wrap">
            {displayResult}
          </p>
        ) : (
          <p className="text-lg font-mono text-gray-400 dark:text-gray-600 select-none">
            {'•'.repeat(Math.min(result.length, 50))}
            {result.length > 50 && '...'}
          </p>
        )}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>
            <span className="font-medium">{result.length}</span> characters
          </span>
          {result.replace(/\s/g, '').length !== result.length && (
            <span>
              <span className="font-medium">{result.replace(/\s/g, '').length}</span> without spaces
            </span>
          )}
          <span>
            <span className="font-medium">
              {new Set(result.toUpperCase().replace(/[^A-Z]/g, '')).size}
            </span> unique letters
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-3 flex flex-wrap gap-2">
        {showCopy && (
          <Button
            variant={copied ? 'success' : 'primary'}
            size="sm"
            onClick={handleCopy}
            icon={copied ? <Check size={16} /> : <Copy size={16} />}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}

        {showDownload && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            icon={<Download size={16} />}
          >
            Download
          </Button>
        )}

        {showShare && navigator.share && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={<Share2 size={16} />}
          >
            Share
          </Button>
        )}

        {showVisibilityToggle && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisible(!visible)}
            icon={visible ? <EyeOff size={16} /> : <Eye size={16} />}
          >
            {visible ? 'Hide' : 'Show'}
          </Button>
        )}
      </div>
    </div>
  );
};

// PropTypes
ResultDisplay.propTypes = {
  result: PropTypes.string,
  label: PropTypes.string,
  mode: PropTypes.oneOf(['encrypt', 'decrypt']),
  
  variant: PropTypes.oneOf(['default', 'gradient', 'minimal']),
  showStats: PropTypes.bool,
  
  showCopy: PropTypes.bool,
  showDownload: PropTypes.bool,
  showShare: PropTypes.bool,
  showVisibilityToggle: PropTypes.bool,
  
  formatting: PropTypes.oneOf(['none', 'spaces', 'blocks']),
  blockSize: PropTypes.number,
  
  onCopy: PropTypes.func,
  onDownload: PropTypes.func,
  onShare: PropTypes.func,
  
  className: PropTypes.string,
};

export default ResultDisplay;