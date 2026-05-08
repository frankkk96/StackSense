import { Search } from 'lucide-react';
import type { GraphNode, Locale } from '@/data/types';
import type { UIStrings } from '@/i18n/strings';
import { labelForType } from '@/lib/graph-data';

interface Props {
  inputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (q: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  results: GraphNode[];
  activeResult: number;
  setActiveResult: React.Dispatch<React.SetStateAction<number>>;
  onPick: (id: string) => void;
  locale: Locale;
  t: UIStrings;
}

export function GraphSearch({
  inputRef,
  query,
  setQuery,
  open,
  setOpen,
  results,
  activeResult,
  setActiveResult,
  onPick,
  locale,
  t,
}: Props) {
  const showResults = open && results.length > 0;

  return (
    <div
      data-has-results={showResults || undefined}
      className="
        relative flex h-[34px] w-[280px] items-center gap-2
        rounded-lg border border-border/15 bg-bg-elev/70 backdrop-blur-md
        py-0 pl-8 pr-2.5
        transition-[background-color,border-color] duration-200
        focus-within:border-accent/45 focus-within:bg-bg-elev/90
        data-[has-results=true]:rounded-b-none
        max-md:h-9 max-md:w-auto max-md:flex-1 max-md:min-w-0
      "
    >
      <Search
        size={14}
        strokeWidth={1.8}
        aria-hidden="true"
        className="pointer-events-none absolute left-[11px] top-1/2 -translate-y-1/2 text-text/55"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder={t.searchPlaceholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so onMouseDown on results can still fire.
          window.setTimeout(() => setOpen(false), 120);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveResult((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveResult((i) => Math.max(0, i - 1));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const hit = results[activeResult];
            if (hit) onPick(hit.id);
          } else if (e.key === 'Escape') {
            if (query) setQuery('');
            else inputRef.current?.blur();
          }
        }}
        aria-label={t.searchAria}
        className="
          h-full min-w-0 flex-1 border-0 bg-transparent p-0 outline-none
          font-sans text-[13px] text-text placeholder:text-text/40
          max-md:text-sm
        "
      />
      <kbd
        aria-hidden="true"
        className="
          flex-shrink-0 rounded border border-border/15 bg-bg/50
          px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.04em] text-text/55
          max-md:hidden
        "
      >
        ⌘K
      </kbd>
      {showResults && (
        <ul
          role="listbox"
          className="
            absolute left-[-1px] right-[-1px] top-full z-[1] m-0 list-none
            overflow-y-auto rounded-b-lg border border-t-0 border-border/15
            bg-bg-elev/95 p-1 backdrop-blur-md
            shadow-[0_12px_28px_rgb(0_0_0_/_0.32)]
            max-h-80 max-md:max-h-[60vh]
          "
        >
          {results.map((n, i) => {
            const active = i === activeResult;
            return (
              <li
                key={n.id}
                role="option"
                aria-selected={active}
                onMouseEnter={() => setActiveResult(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onPick(n.id);
                }}
                className={`
                  flex cursor-pointer select-none items-center justify-between gap-3
                  rounded-md px-2.5 py-[7px] text-[13px] text-text
                  ${active ? 'bg-accent/10' : ''}
                `}
              >
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                  {n.label}
                </span>
                <span className="flex-shrink-0 font-mono text-[10px] tracking-[0.16em] uppercase opacity-50">
                  {labelForType(n.type, locale)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
