import { useState, useEffect } from 'react';

export type Language = 'en' | 'es';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguage(savedLanguage);
    } else {
      // If no saved language, set Spanish as default
      setLanguage('es');
      localStorage.setItem('language', 'es');
    }

    // Listen for language change events to force re-render
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languagechange', handleLanguageChange);
    return () => window.removeEventListener('languagechange', handleLanguageChange);
  }, []);

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.dispatchEvent(new Event('languagechange'));
  };

  const setLanguageDirectly = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // Refresh the page to ensure all content updates properly
    window.location.reload();
  };

  return { language, toggleLanguage, setLanguageDirectly };
};