import { useState, useCallback, useEffect } from "react";

export interface LanguageOption {
  code: string;
  label: string;
  nativeLabel: string;
}

// Only en-US is supported by the app's localeManager currently
// Other languages are listed but will fall back to en-US
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en-US", label: "English (US)", nativeLabel: "English" },
  { code: "zh-CN", label: "Chinese (Simplified)", nativeLabel: "简体中文" },
  { code: "zh-TW", label: "Chinese (Traditional)", nativeLabel: "繁體中文" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
];

const STORAGE_KEY = "user_language_preference";

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || navigator.language || "en-US";
    } catch {
      return "en-US";
    }
  });

  const changeLanguage = useCallback((code: string) => {
    setCurrentLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
    document.documentElement.lang = code;
    // Reload to apply new locale through localeManager which reads navigator.language
    // In a real implementation, this would update the IntlProvider context
    window.location.reload();
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return { currentLanguage, changeLanguage, languages: SUPPORTED_LANGUAGES };
};

export default useLanguage;
