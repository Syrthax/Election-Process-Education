import { createContext, useContext, useState, useCallback } from 'react';
import translations from './translations';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('votewise-lang') || 'en';
  });

  const t = useCallback((key, vars = {}) => {
    let text = translations[language]?.[key] || translations.en?.[key] || key;
    // Replace {var} placeholders
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  }, [language]);

  const switchLanguage = useCallback((lang) => {
    setLanguage(lang);
    localStorage.setItem('votewise-lang', lang);
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, []);

  return (
    <I18nContext.Provider value={{ language, t, switchLanguage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
