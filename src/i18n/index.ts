import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import language files
import en from './locales/en.json';
import ko from './locales/ko.json';
import it from './locales/it.json';
import de from './locales/de.json';
import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  },
  ko: {
    translation: ko
  },
  it: {
    translation: it
  },
  de: {
    translation: de
  },
  fr: {
    translation: fr
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
