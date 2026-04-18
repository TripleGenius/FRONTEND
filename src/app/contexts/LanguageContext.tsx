import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'kk' | 'mn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  kk: {
    // Login
    'login.title': 'Жүйеге кіру',
    'login.email': 'Электрондық пошта',
    'login.password': 'Құпия сөз',
    'login.button': 'Кіру',
    'login.welcome': 'Қош келдіңіз',

    // Dashboard
    'dashboard.title': 'Бақылау тақтасы',
    'dashboard.progress': 'Үлгеріміңіз',
    'dashboard.modules': 'Модульдер',
    'dashboard.continue': 'Жалғастыру',

    // Navigation
    'nav.dashboard': 'Басты бет',
    'nav.modules': 'Модульдер',
    'nav.progress': 'Үлгерім',
    'nav.settings': 'Баптаулар',

    // Modules
    'module.english': 'English',
    'module.alash': 'Alash',
    'module.olen': 'Өлең',
    'module.iq': 'IQ',
    'module.tapqirliq': 'Тапқырлық',
    'module.sozdik': 'Сөздік',

    // Common
    'common.showAnswer': 'Жауапты көрсету',
    'common.next': 'Келесі',
    'common.back': 'Артқа',
    'common.complete': 'Аяқталды',
    'common.loading': 'Жүктелуде...',
  },
  mn: {
    // Login
    'login.title': 'Нэвтрэх',
    'login.email': 'Имэйл',
    'login.password': 'Нууц үг',
    'login.button': 'Нэвтрэх',
    'login.welcome': 'Тавтай морил',

    // Dashboard
    'dashboard.title': 'Хяналтын самбар',
    'dashboard.progress': 'Ахиц',
    'dashboard.modules': 'Модулиуд',
    'dashboard.continue': 'Үргэлжлүүлэх',

    // Navigation
    'nav.dashboard': 'Нүүр',
    'nav.modules': 'Модулиуд',
    'nav.progress': 'Ахиц',
    'nav.settings': 'Тохиргоо',

    // Modules
    'module.english': 'English',
    'module.alash': 'Alash',
    'module.olen': 'Шүлэг',
    'module.iq': 'IQ',
    'module.tapqirliq': 'Ухаан',
    'module.sozdik': 'Толь',

    // Common
    'common.showAnswer': 'Хариулт харах',
    'common.next': 'Дараах',
    'common.back': 'Буцах',
    'common.complete': 'Дууссан',
    'common.loading': 'Ачаалж байна...',
  },
  en: {
    // Login
    'login.title': 'Sign In',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.button': 'Sign In',
    'login.welcome': 'Welcome',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.progress': 'Your Progress',
    'dashboard.modules': 'Modules',
    'dashboard.continue': 'Continue',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.modules': 'Modules',
    'nav.progress': 'Progress',
    'nav.settings': 'Settings',

    // Modules
    'module.english': 'English',
    'module.alash': 'Alash',
    'module.olen': 'Poetry',
    'module.iq': 'IQ',
    'module.tapqirliq': 'Wit',
    'module.sozdik': 'Dictionary',

    // Common
    'common.showAnswer': 'Show Answer',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.complete': 'Complete',
    'common.loading': 'Loading...',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('kk');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
