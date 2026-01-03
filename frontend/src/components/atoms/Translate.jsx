// frontend/src/components/atoms/Translate.jsx

import { useAITranslate } from '../../hooks/useAITranslate';
import { Loader2 } from 'lucide-react';

/**
 * AI-Powered Translation Component
 * Usage: <Translate>Your text here</Translate>
 */
const Translate = ({ 
  children, 
  fallback = null,
  showLoader = false,
  className = '',
  fromLang,
  toLang 
}) => {
  const { translatedText, isLoading } = useAITranslate(children, {
    fromLang,
    toLang
  });

  if (isLoading && showLoader) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <Loader2 size={14} className="animate-spin" />
        {fallback || children}
      </span>
    );
  }

  if (isLoading && !showLoader) {
    return <span className={className}>{fallback || children}</span>;
  }

  return <span className={className}>{translatedText}</span>;
};

export default Translate;