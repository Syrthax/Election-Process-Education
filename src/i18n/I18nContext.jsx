import { useState, useCallback, useMemo } from 'react';
import { I18nContext } from './I18nContextRef';
import translations from './translations';

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem('votewise-lang') || 'en';
  });

  const t = useCallback((key, vars = {}) => {
    let text = translations[language]?.[key] || translations.en?.[key] || key;
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  }, [language]);

  const switchLanguage = useCallback((lang) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('votewise-lang', lang);
      document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    }
  }, []);

  const value = useMemo(() => ({ language, t, switchLanguage }), [language, t, switchLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
