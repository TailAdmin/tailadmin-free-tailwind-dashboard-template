import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type LanguageCode = "en" | "ar" | "es" | "de";

export type Language = {
  code: LanguageCode;
  name: string;
  dir: "ltr" | "rtl";
  flag?: string;
};

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
];

type LanguageContextType = {
  language: LanguageCode;
  currentLanguage: Language;
  dir: "ltr" | "rtl";
  setLanguage: (code: LanguageCode) => void;
  availableLanguages: Language[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const currentLng = (i18n.resolvedLanguage || i18n.language || "en") as LanguageCode;
    return AVAILABLE_LANGUAGES.some((lang) => lang.code === currentLng)
      ? currentLng
      : "en";
  });

  const currentLanguage =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === language) ||
    AVAILABLE_LANGUAGES[0];
  const dir = currentLanguage.dir;

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const matched = AVAILABLE_LANGUAGES.find((l) => l.code === lng);
      if (matched && matched.code !== language) {
        setLanguageState(matched.code);
      }
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n, language]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem("i18nextLng", language);
    localStorage.setItem("language", language);
  }, [language, dir]);

  const setLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    setLanguageState(code);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        currentLanguage,
        dir,
        setLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
