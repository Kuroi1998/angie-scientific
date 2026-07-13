import React, { createContext, useContext } from 'react';
import fr from '../i18n/fr.json';
import es from '../i18n/es.json';
import { useLocalStorageState } from './useLocalStorageState';

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

const isLanguageOrNull = (raw: unknown): raw is Language | null =>
  raw === 'fr' || raw === 'es' || raw === null;

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorageState<Language | null>('language', null, {
    validate: isLanguageOrNull,
    legacyKey: 'angie_sci_lang',
    parseLegacy: (raw) => (raw === 'fr' || raw === 'es' ? raw : undefined),
  });

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
