import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import es from './es.json';

const resources = {
  en: { translation: en },
  es: { translation: es }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es', // Force Spanish as default to fix the user's issue immediately
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
