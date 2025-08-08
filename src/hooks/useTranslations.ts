import { useTranslation } from 'react-i18next';

export const useTranslations = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English' },
      { code: 'ko', name: 'Korean' },
      { code: 'it', name: 'Italian' },
      { code: 'de', name: 'German' },
      { code: 'fr', name: 'French' }
    ];
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages
  };
};
