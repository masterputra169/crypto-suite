// frontend/src/hooks/useAITranslate.js

import { useState, useEffect } from 'react';
import { useAITranslation } from '../context/AITranslationContext';

/**
 * Hook for translating text with AI
 * @param {string} text - Text to translate
 * @param {object} options - Translation options
 * @returns {string} Translated text
 */
export const useAITranslate = (text, options = {}) => {
  const { translate, language } = useAITranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const performTranslation = async () => {
      if (!text) {
        setTranslatedText('');
        return;
      }

      setIsLoading(true);
      try {
        const result = await translate(text, options);
        if (isMounted) {
          setTranslatedText(result);
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setTranslatedText(text); // Fallback to original
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [text, language, translate, options]);

  return { translatedText, isLoading };
};

/**
 * Hook for translating multiple texts
 */
export const useAITranslateBatch = (textArray, options = {}) => {
  const { translateBatch, language } = useAITranslation();
  const [translatedTexts, setTranslatedTexts] = useState(textArray);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const performBatchTranslation = async () => {
      if (!textArray || textArray.length === 0) {
        setTranslatedTexts([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await translateBatch(textArray, options);
        if (isMounted) {
          setTranslatedTexts(results);
        }
      } catch (error) {
        console.error('Batch translation error:', error);
        if (isMounted) {
          setTranslatedTexts(textArray); // Fallback to original
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    performBatchTranslation();

    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(textArray), language, translateBatch]);

  return { translatedTexts, isLoading };
};