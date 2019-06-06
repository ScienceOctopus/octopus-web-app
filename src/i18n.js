import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const LANGUAGE_LINK_KEY = "linkLanguageKey";
export const AVAILABLE_LANGUAGES = ["en", "pt-BR"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    detection: {
      // order and from where user language should be detected
      order: ["path", "navigator"],

      // keys or params to lookup language from
      lookupFromPathIndex: 0,

      // cache user language on
      caches: [],
    },
    resources: {
      en: {
        translation: {
          [LANGUAGE_LINK_KEY]: "",
          octopus: "Octopus",
        },
      },
      "pt-BR": {
        translation: {
          [LANGUAGE_LINK_KEY]: "/pt-BR",
          octopus: "jellyblob",
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
