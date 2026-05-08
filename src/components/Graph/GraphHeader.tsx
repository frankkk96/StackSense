import { GraphSearch } from './GraphSearch';
import type { GraphNode, Locale } from '@/data/types';
import type { UIStrings } from '@/i18n/strings';

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

export function GraphHeader(props: Props) {
  return (
    <header
      className="
        absolute left-7 top-[22px] z-20 flex items-center gap-3
        max-md:left-[14px] max-md:right-16 max-md:top-3 max-md:flex-wrap max-md:gap-2
      "
    >
      <a
        href="/"
        className="inline-flex items-center gap-3 text-text no-underline transition-opacity duration-200 hover:opacity-75"
      >
        <img
          src="/logo.svg"
          alt=""
          width={22}
          height={Math.round((22 * 413) / 724)}
          className="flex-shrink-0"
        />
        <span className="font-sans text-base font-semibold tracking-tight">
          StackSense
        </span>
      </a>
      <GraphSearch {...props} />
    </header>
  );
}
