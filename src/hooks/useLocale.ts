import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/data/types';
import { STRINGS, type UIStrings } from '@/i18n/strings';

const LOCALE_STORAGE_KEY = 'stacksense.locale';

// SSR output stays stable: initial render always uses DEFAULT_LOCALE; the
// saved preference is applied after hydration.
export function useLocale(): {
  locale: Locale;
  switchLocale: (next: Locale) => void;
  t: UIStrings;
} {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved && (LOCALES as string[]).includes(saved)) {
      setLocale(saved as Locale);
    }
  }, []);

  const switchLocale = useCallback((next: Locale) => {
    setLocale(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.documentElement.setAttribute(
        'lang',
        next === 'zh' ? 'zh-CN' : 'en'
      );
    }
  }, []);

  return { locale, switchLocale, t: STRINGS[locale] };
}
