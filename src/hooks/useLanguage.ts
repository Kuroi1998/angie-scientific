import React from 'react';
import { useTranslation } from 'react-i18next';

export type Language = 'fr' | 'es';

export function useLanguage() {
  const { t, i18n } = useTranslation();

  return {
    language: (i18n.language || 'fr').split('-')[0] as Language,
    setLanguage: (lang: Language) => {
      i18n.changeLanguage(lang);
      localStorage.setItem('language', lang); // For backward compatibility with old code if needed
    },
    t,
  };
}

// Dummy provider to not break existing app trees
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};
