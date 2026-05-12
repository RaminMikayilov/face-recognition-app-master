import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import az from './locales/az.json';
import ru from './locales/ru.json';


// əgər tərcümə mətnində dinamik value istifadə etmək istərsəniz aşağıda nümunə yazıram. bunu müvafiq tərcümə sənədinə əlavə edin 
// "info": "Mənim {{age}} yaşım var və mən {{city}} şəhərində yaşayıram"
// t('info', { age: 20, city: 'Bakı' })

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            az: { translation: az },
            ru: { translation: ru },
        },
        lng: 'az',
        fallbackLng: 'az',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
