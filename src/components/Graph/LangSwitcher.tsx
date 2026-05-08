import { ChevronDown } from 'lucide-react';
import type { Locale } from '@/data/types';
import type { UIStrings } from '@/i18n/strings';

interface Props {
  locale: Locale;
  switchLocale: (next: Locale) => void;
  t: UIStrings;
}

export function LangSwitcher({ locale, switchLocale, t }: Props) {
  return (
    <div
      className="
        absolute right-7 top-[22px] z-20
        transition-opacity duration-200
        group-data-[panel-open=true]:pointer-events-none group-data-[panel-open=true]:opacity-0
        max-md:right-[14px] max-md:top-3
      "
    >
      <select
        value={locale}
        onChange={(e) => switchLocale(e.target.value as Locale)}
        aria-label={t.langSwitcherLabel}
        title={t.langSwitcherLabel}
        className="
          h-[34px] cursor-pointer appearance-none
          rounded-lg border border-border/15 bg-bg-elev/70 backdrop-blur-md
          py-0 pl-3 pr-9
          font-sans text-xs font-medium tracking-wider text-text/85
          transition-colors duration-200
          hover:border-accent/45 hover:bg-bg-elev/90 hover:text-accent
          focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent/55 focus-visible:outline-offset-1
          max-md:h-9
        "
      >
        <option value="en">English</option>
        <option value="zh">中文</option>
      </select>
      <ChevronDown
        size={14}
        strokeWidth={1.8}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text/55"
      />
    </div>
  );
}
