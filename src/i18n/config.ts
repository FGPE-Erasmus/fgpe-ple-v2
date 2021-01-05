import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./en/translation.json";
import pl from "./pl/translation.json";

export const translationsJson = {
  en: {
    translation: en,
  },
  pl: {
    translation: pl,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: translationsJson,
    fallbackLng: "en",
    debug:
      process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test",
  });
