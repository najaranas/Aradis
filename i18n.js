import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getStoredValue } from "./utils/storage";

// Import language files
import enTranslation from "./translations/en.json";
import frTranslation from "./translations/fr.json";
import arTranslation from "./translations/ar.json";

const initializeI18next = async () => {
  const language = (await getStoredValue("lang")) || "fr";

  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      ar: { translation: arTranslation },
    },
    lng: language,
    fallbackLng: "en",

    returnNull: false,
    returnEmptyString: false,
    fallbackLng: false,

    // This tells i18n to not return the key when translation is missing

    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeI18next();

export default i18next;
