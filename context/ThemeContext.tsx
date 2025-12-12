import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
export type Language = 'en' | 'ru';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currency: CurrencyInfo;
  setCurrency: (currency: CurrencyInfo) => void;
  formatCurrency: (amount: number) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_dashboard: 'Dashboard',
    nav_inbox: 'Inbox',
    nav_leads: 'Leads',
    nav_bookings: 'Bookings',
    nav_tours: 'Tours',
    nav_reports: 'Reports',
    nav_team: 'Team',
    nav_settings: 'Settings',
    page_dashboard_title: 'Dashboard',
    page_inbox_title: 'Inbox',
    page_leads_title: 'Leads',
    page_bookings_title: 'Bookings',
    page_tours_title: 'Tours',
    page_reports_title: 'Reports',
    page_team_title: 'Team',
    page_settings_title: 'Settings',
    leads_status_new: 'New',
    leads_status_contacted: 'Contacted',
    leads_status_qualified: 'Qualified',
    leads_status_booked: 'Booked',
    leads_status_lost: 'Lost',
  },
  ru: {
    nav_dashboard: 'Дашборд',
    nav_inbox: 'Входящие',
    nav_leads: 'Лиды',
    nav_bookings: 'Бронирования',
    nav_tours: 'Туры',
    nav_reports: 'Отчеты',
    nav_team: 'Команда',
    nav_settings: 'Настройки',
    page_dashboard_title: 'Дашборд',
    page_inbox_title: 'Входящие',
    page_leads_title: 'Лиды',
    page_bookings_title: 'Бронирования',
    page_tours_title: 'Туры',
    page_reports_title: 'Отчеты',
    page_team_title: 'Команда',
    page_settings_title: 'Настройки',
    leads_status_new: 'Новый',
    leads_status_contacted: 'Связались',
    leads_status_qualified: 'Квалифицирован',
    leads_status_booked: 'Забронирован',
    leads_status_lost: 'Потерян',
  }
};

const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  'USD ($) - United States Dollar': { code: 'USD', symbol: '$', name: 'United States Dollar' },
  'EUR (€) - Euro': { code: 'EUR', symbol: '€', name: 'Euro' },
  'GBP (£) - British Pound': { code: 'GBP', symbol: '£', name: 'British Pound' },
  'JPY (¥) - Japanese Yen': { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  'CNY (¥) - Chinese Yuan': { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  'AUD ($) - Australian Dollar': { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  'CAD ($) - Canadian Dollar': { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  'CHF (Fr) - Swiss Franc': { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  'SGD ($) - Singapore Dollar': { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  'HKD ($) - Hong Kong Dollar': { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
  'NZD ($) - New Zealand Dollar': { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  'THB (฿) - Thai Baht': { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  'AED (د.إ) - UAE Dirham': { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  'INR (₹) - Indian Rupee': { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  'MYR (RM) - Malaysian Ringgit': { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  'IDR (Rp) - Indonesian Rupiah': { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  'PHP (₱) - Philippine Peso': { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  'VND (₫) - Vietnamese Dong': { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  'KRW (₩) - South Korean Won': { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  'TWD (NT$) - Taiwan Dollar': { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  'TRY (₺) - Turkish Lira': { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  'ZAR (R) - South African Rand': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  'MXN ($) - Mexican Peso': { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  'BRL (R$) - Brazilian Real': { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  'ARS ($) - Argentine Peso': { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  'COP ($) - Colombian Peso': { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  'CLP ($) - Chilean Peso': { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  'EGP (£) - Egyptian Pound': { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  'MAD (د.م.) - Moroccan Dirham': { code: 'MAD', symbol: 'د.م.', name: 'Moroccan Dirham' },
  'RUB (₽) - Russian Ruble': { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme Logic
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as Theme;
      if (saved) return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  // Language Logic
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language') as Language;
      if (saved === 'en' || saved === 'ru') return saved;
    }
    return 'en';
  });

  // Currency Logic
  const [currency, setCurrencyState] = useState<CurrencyInfo>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return { code: 'USD', symbol: '$', name: 'United States Dollar' };
        }
      }
    }
    return { code: 'USD', symbol: '$', name: 'United States Dollar' };
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const t = (key: string) => {
    const langData = translations[language] || translations['en'];
    return langData[key] || translations['en'][key] || key;
  };

  const setCurrency = (newCurrency: CurrencyInfo) => {
    setCurrencyState(newCurrency);
  };

  const formatCurrency = (amount: number): string => {
    return `${currency.symbol}${amount.toLocaleString()}`;
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      toggleTheme,
      language,
      setLanguage,
      t,
      currency,
      setCurrency,
      formatCurrency
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export useI18n as the primary hook for translations
export const useI18n = useTheme;

// Export currency map for settings page
export { CURRENCY_MAP };
