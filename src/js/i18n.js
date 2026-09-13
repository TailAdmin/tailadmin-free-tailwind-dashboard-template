import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "../locales/en/common.json";

import flagUs from "../images/flag/flag-us.svg";

// Supported locales metadata
export const supportedLocales = [
  {
    code: "en",
    name: "English",
    shortName: "English",
    country: "USA",
    flag: flagUs,
  },
];

export const isRTL = (lng) => {
  return typeof lng === "string" && lng.startsWith("ar");
};

export const applyHtmlLanguageAttributes = (lng) => {
  const currentLang = lng || "en";
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isRTL(currentLang) ? "rtl" : "ltr";
};

// Synchronously apply saved language/direction before page paints
(function () {
  try {
    const saved = localStorage.getItem("i18nextLng") || "en";
    applyHtmlLanguageAttributes(saved);
  } catch (e) {
    applyHtmlLanguageAttributes("en");
  }
})();

// Initialize i18next
i18next.use(LanguageDetector).init({
  resources: {
    en: { common: enTranslation },
  },
  defaultNS: "common",
  fallbackLng: "en",
  detection: {
    order: ["localStorage", "navigator"],
    lookupLocalStorage: "i18nextLng",
    caches: ["localStorage"],
  },
  interpolation: {
    escapeValue: false,
  },
});

// Update DOM attributes on language changes
i18next.on("languageChanged", (lng) => {
  applyHtmlLanguageAttributes(lng);
});

/**
 * Register i18next with Alpine.js
 * @param {import('alpinejs').Alpine} Alpine
 */
export function setupI18n(Alpine) {
  // 1. Register reactive i18n store
  Alpine.store("i18n", {
    currentLocale: i18next.language || "en",
    dir: isRTL(i18next.language) ? "rtl" : "ltr",
    locales: supportedLocales,

    get currentLang() {
      return (
        this.locales.find((item) => item.code === this.currentLocale) ||
        this.locales[0]
      );
    },

    t(key, options) {
      return i18next.t(key, options);
    },

    setLocale(lng) {
      return i18next.changeLanguage(lng).then(() => {
        this.currentLocale = lng;
        this.dir = isRTL(lng) ? "rtl" : "ltr";
        applyHtmlLanguageAttributes(lng);
        window.dispatchEvent(
          new CustomEvent("i18n:language-changed", { detail: { lng } }),
        );
      });
    },
  });

  // 2. Register $t magic helper for use in Alpine expressions: x-text="$t('common.home')"
  Alpine.magic("t", () => (key, options) => {
    const store = Alpine.store("i18n");
    if (store) {
      // Create reactivity dependency on currentLocale
      const _ = store.currentLocale;
    }
    return i18next.t(key, options);
  });

  // 3. Register x-i18n directive: <span x-i18n="'sidebar.items.dashboard'">Dashboard</span>
  Alpine.directive("i18n", (el, { expression }, { evaluateLater, effect }) => {
    const getTranslationKey = evaluateLater(expression);
    effect(() => {
      const store = Alpine.store("i18n");
      if (store) {
        const _ = store.currentLocale;
      }
      getTranslationKey((key) => {
        if (key) {
          el.textContent = i18next.t(key);
        }
      });
    });
  });
}

export default i18next;
