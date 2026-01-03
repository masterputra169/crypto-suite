// frontend/src/components/molecules/AdvancedLanguageToggle.jsx

import { useState } from 'react';
import { Globe, Settings, Zap, ChevronDown } from 'lucide-react';
import { useAITranslation } from '../../context/AITranslationContext';

const AdvancedLanguageToggle = ({ isOpen }) => {
  const { 
    language, 
    toggleLanguage, 
    translationMethod, 
    setTranslationMethod,
    translationStats,
    clearCache,
    isTranslating
  } = useAITranslation();
  
  const [showSettings, setShowSettings] = useState(false);

  const translationMethods = [
    { 
      id: 'claude', 
      name: 'Claude AI', 
      icon: '🤖',
      description: 'Best quality, context-aware',
      pro: true
    },
    { 
      id: 'google', 
      name: 'Google Translate', 
      icon: '🌐',
      description: 'Fast and reliable',
      pro: false
    },
    { 
      id: 'libre', 
      name: 'LibreTranslate', 
      icon: '🔓',
      description: 'Free and open source',
      pro: false
    },
    { 
      id: 'static', 
      name: 'Static', 
      icon: '📝',
      description: 'Pre-defined translations',
      pro: false
    }
  ];

  return (
    <div className="px-4 pb-4 border-b border-gray-700/50">
      {/* Main Toggle Button */}
      <button
        onClick={toggleLanguage}
        className={`
          group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
          transition-all duration-500 ease-out
          bg-gray-700/30 hover:bg-gray-700/50
          relative overflow-hidden
          ${!isOpen && 'justify-center'}
        `}
        title={isOpen ? '' : (language === 'en' ? 'English' : 'Indonesian')}
      >
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
        
        {/* Icon with translation indicator */}
        <div className="relative">
          <Globe 
            size={20} 
            className={`
              relative z-10 text-gray-300 group-hover:text-white 
              transition-all duration-500 ease-out group-hover:scale-110 
              flex-shrink-0
              ${isTranslating ? 'animate-spin' : ''}
            `}
          />
          {isTranslating && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          )}
        </div>
        
        {/* Text (when sidebar is open) */}
        {isOpen && (
          <div className="relative z-10 flex items-center justify-between flex-1">
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-all duration-500 ease-out">
                {language === 'en' ? 'English' : 'Bahasa Indonesia'}
              </span>
              {translationMethod !== 'static' && (
                <span className="text-xs text-gray-500">
                  {translationMethods.find(m => m.id === translationMethod)?.icon} {translationMethods.find(m => m.id === translationMethod)?.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Language Badges */}
              <div className="flex gap-1">
                <span className={`
                  px-2 py-0.5 rounded text-xs font-semibold transition-all duration-300
                  ${language === 'en' 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-gray-600/50 text-gray-400 scale-95'
                  }
                `}>
                  EN
                </span>
                <span className={`
                  px-2 py-0.5 rounded text-xs font-semibold transition-all duration-300
                  ${language === 'id' 
                    ? 'bg-blue-600 text-white scale-105' 
                    : 'bg-gray-600/50 text-gray-400 scale-95'
                  }
                `}>
                  ID
                </span>
              </div>
              
              {/* Settings Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSettings(!showSettings);
                }}
                className="p-1 hover:bg-gray-600/50 rounded transition-all duration-300"
              >
                <Settings 
                  size={14} 
                  className={`text-gray-400 hover:text-white transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Badge indicator when closed */}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">
              {language === 'en' ? 'EN' : 'ID'}
            </span>
          </div>
        )}
      </button>

      {/* Settings Panel */}
      {isOpen && showSettings && (
        <div className="mt-2 p-3 bg-gray-900/50 rounded-lg border border-gray-700/30 animate-slide-down">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
              Translation Engine
            </h4>
            {translationStats.totalTranslations > 0 && (
              <span className="text-xs text-gray-500">
                {translationStats.cacheHits}/{translationStats.totalTranslations} cached
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            {translationMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setTranslationMethod(method.id)}
                className={`
                  w-full px-2 py-1.5 rounded text-left transition-all duration-300
                  ${translationMethod === method.id
                    ? 'bg-blue-600/20 border border-blue-500/50'
                    : 'bg-gray-800/30 border border-transparent hover:bg-gray-700/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{method.icon}</span>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-gray-300">
                          {method.name}
                        </span>
                        {method.pro && (
                          <Zap size={10} className="text-yellow-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-500">
                        {method.description}
                      </span>
                    </div>
                  </div>
                  {translationMethod === method.id && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Cache Clear Button */}
          {translationStats.totalTranslations > 0 && (
            <button
              onClick={clearCache}
              className="w-full mt-2 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-800/30 hover:bg-gray-700/50 rounded transition-all duration-300"
            >
              Clear Translation Cache
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdvancedLanguageToggle;