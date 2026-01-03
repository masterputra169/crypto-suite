// frontend/src/context/AITranslationContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AITranslationContext = createContext();

export const useAITranslation = () => {
  const context = useContext(AITranslationContext);
  if (!context) {
    throw new Error('useAITranslation must be used within AITranslationProvider');
  }
  return context;
};

// Translation cache untuk menghindari API calls berulang
const translationCache = new Map();

export const AITranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  
  const [translationMethod, setTranslationMethod] = useState(() => {
    return localStorage.getItem('translationMethod') || 'claude'; // claude, google, libre, static
  });
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationStats, setTranslationStats] = useState({
    totalTranslations: 0,
    cacheHits: 0,
    apiCalls: 0
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
    localStorage.setItem('translationMethod', translationMethod);
    document.documentElement.lang = language;
  }, [language, translationMethod]);

  // ==================== CLAUDE API TRANSLATION ====================
  const translateWithClaude = async (text, fromLang, toLang) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Translate the following text from ${fromLang} to ${toLang}. 
              IMPORTANT: Return ONLY the translated text, no explanations, no quotes, no preamble.
              
              Text to translate: ${text}`
            }
          ],
        })
      });

      const data = await response.json();
      return data.content[0].text.trim();
    } catch (error) {
      console.error('Claude translation failed:', error);
      throw error;
    }
  };

  // ==================== GOOGLE TRANSLATE API ====================
  const translateWithGoogle = async (text, fromLang, toLang) => {
    try {
      // Using MyMemory API (Free Google Translate alternative)
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        return data.responseData.translatedText;
      }
      throw new Error('Translation failed');
    } catch (error) {
      console.error('Google translation failed:', error);
      throw error;
    }
  };

  // ==================== LIBRETRANSLATE API ====================
  const translateWithLibre = async (text, fromLang, toLang) => {
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: fromLang,
          target: toLang,
          format: 'text'
        })
      });

      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error('LibreTranslate failed:', error);
      throw error;
    }
  };

  // ==================== MAIN TRANSLATE FUNCTION ====================
  const translate = useCallback(async (text, options = {}) => {
    if (!text) return text;

    const {
      fromLang = language === 'id' ? 'en' : language,
      toLang = language,
      forceRefresh = false
    } = options;

    // Return original if same language
    if (fromLang === toLang) return text;

    // Check cache first
    const cacheKey = `${text}_${fromLang}_${toLang}`;
    if (!forceRefresh && translationCache.has(cacheKey)) {
      setTranslationStats(prev => ({
        ...prev,
        totalTranslations: prev.totalTranslations + 1,
        cacheHits: prev.cacheHits + 1
      }));
      return translationCache.get(cacheKey);
    }

    setIsTranslating(true);

    try {
      let translated;

      switch (translationMethod) {
        case 'claude':
          translated = await translateWithClaude(text, fromLang, toLang);
          break;
        case 'google':
          translated = await translateWithGoogle(text, fromLang, toLang);
          break;
        case 'libre':
          translated = await translateWithLibre(text, fromLang, toLang);
          break;
        default:
          translated = text; // Fallback to original
      }

      // Cache the result
      translationCache.set(cacheKey, translated);

      // Update stats
      setTranslationStats(prev => ({
        ...prev,
        totalTranslations: prev.totalTranslations + 1,
        apiCalls: prev.apiCalls + 1
      }));

      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original on error
    } finally {
      setIsTranslating(false);
    }
  }, [language, translationMethod]);

  // ==================== BATCH TRANSLATE ====================
  const translateBatch = useCallback(async (textArray, options = {}) => {
    const translations = await Promise.all(
      textArray.map(text => translate(text, options))
    );
    return translations;
  }, [translate]);

  // ==================== TRANSLATE PAGE ====================
  const translatePage = useCallback(async () => {
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    const translationPromises = Array.from(elementsToTranslate).map(async (element) => {
      const originalText = element.getAttribute('data-original') || element.textContent;
      
      // Store original text if not stored
      if (!element.getAttribute('data-original')) {
        element.setAttribute('data-original', originalText);
      }

      const translated = await translate(originalText);
      element.textContent = translated;
    });

    await Promise.all(translationPromises);
  }, [translate]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const clearCache = () => {
    translationCache.clear();
    console.log('Translation cache cleared');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    translationMethod,
    setTranslationMethod,
    isIndonesian: language === 'id',
    translate,
    translateBatch,
    translatePage,
    isTranslating,
    translationStats,
    clearCache
  };

  return (
    <AITranslationContext.Provider value={value}>
      {children}
    </AITranslationContext.Provider>
  );
};