import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frAuth from './locales/fr/auth.json';
import frSettings from './locales/fr/settings.json';
import frPeriodicTable from './locales/fr/periodicTable.json';
import frQuantum from './locales/fr/quantum.json';
import frFusion from './locales/fr/fusion.json';
import esCommon from './locales/es/common.json';
import esNavigation from './locales/es/navigation.json';
import esAuth from './locales/es/auth.json';
import esSettings from './locales/es/settings.json';
import esPeriodicTable from './locales/es/periodicTable.json';
import esQuantum from './locales/es/quantum.json';
import esFusion from './locales/es/fusion.json';

const resources = {
  fr: {
    common: frCommon,
    navigation: frNavigation,
    auth: frAuth,
    settings: frSettings,
    periodicTable: frPeriodicTable,
    quantum: frQuantum,
    fusion: frFusion,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    auth: esAuth,
    settings: esSettings,
    periodicTable: esPeriodicTable,
    quantum: esQuantum,
    fusion: esFusion,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'es'],
    ns: ['common', 'navigation', 'auth', 'settings', 'periodicTable', 'quantum', 'fusion'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false, // React already safe from xss
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.resolvedLanguage || 'fr';

export default i18n;
