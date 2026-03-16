import { useState, useCallback, useEffect } from 'react';

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', nativeLabel: '简体中文' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeLabel: '繁體中文' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
];

const STORAGE_KEY = 'user_language_preference';

const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language || 'en';
  const match = SUPPORTED_LANGUAGES.find((l) => browserLang.startsWith(l.code));
  return match ? match.code : 'en';
};

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || detectBrowserLanguage();
    } catch { return 'en'; }
  });

  const changeLanguage = useCallback((code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return { currentLanguage, changeLanguage, languages: SUPPORTED_LANGUAGES };
};

export default useLanguage;
