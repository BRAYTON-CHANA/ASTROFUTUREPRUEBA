'use client';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import es from '@/lib/locales/es.json';
import en from '@/lib/locales/en.json';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
  languageCode: string;
}

const translations: Record<Language, any> = { es, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['es', 'en'].includes(storedLanguage)) {
      setLanguageState(storedLanguage);
      document.documentElement.lang = storedLanguage;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string }) => {
    const keys = key.split('.');
    let value = translations[language];
    try {
      for (const k of keys) {
        value = value[k];
      }
      if (typeof value !== 'string') {
        return key;
      }
      if (replacements) {
        return Object.entries(replacements).reduce((acc, [k, v]) => acc.replace(`{{${k}}}`, v), value);
      }
      return value;
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }, [language]);

  const languageCode = language === 'es' ? 'es-ES' : 'en-US';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languageCode }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
