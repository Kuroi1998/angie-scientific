import React, { createContext, useContext, useState } from 'react';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';

export type Language = 'fr' | 'es';
type Translations = Record<string, string>;

interface LanguageContextType {
  language: Language | null;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Translations> = {
  fr: fr as Translations,
  es: es as Translations,
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language | null>(() => {
    const saved = localStorage.getItem('angie_sci_lang');
    return (saved === 'fr' || saved === 'es') ? (saved as Language) : null;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('angie_sci_lang', lang);
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const currentLang = language || 'fr'; // fallback if null
    const dict = translations[currentLang];
    return dict[key] || key;
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
