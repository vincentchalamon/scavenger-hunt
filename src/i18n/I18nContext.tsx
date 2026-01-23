"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { translations, Language, TranslationKey } from "./translations";

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * Detects the browser language
 */
function detectBrowserLanguage(): Language {
  if (typeof navigator === "undefined") {
    return "fr"; // Default language on server-side
  }

  // Get browser language (e.g., "fr-FR" or "en-US")
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Extract language code (e.g., "fr" from "fr-FR")
  const langCode = browserLang.split("-")[0].toLowerCase();

  // Check if language is supported
  if (langCode in translations) {
    return langCode as Language;
  }

  // Default language if not supported
  return "fr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detect language on component mount
    const savedLang = typeof localStorage !== "undefined"
      ? localStorage.getItem("language") as Language | null
      : null;

    const detectedLang = savedLang || detectBrowserLanguage();
    setLanguageState(detectedLang);
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: TranslationKey): string => {
    // Cast to any to avoid TypeScript indexing error since all languages have the same keys
    return (translations[language] as any)[key] || (translations.fr as any)[key] || key;
  };

  // Avoid flash of untranslated content
  if (!mounted) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
