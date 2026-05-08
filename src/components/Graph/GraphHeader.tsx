import { Github } from 'lucide-react';
import { GraphSearch } from './GraphSearch';
import type { GraphNode, Locale } from '@/data/types';
import type { UIStrings } from '@/i18n/strings';

const REPO_URL = 'https://github.com/frankkk96/StackSense';

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
        max-md:left-[14px] max-md:right-[112px] max-md:top-3 max-md:gap-2
      "
    >
      <a
        href="/"
        aria-label="StackSense — home"
        className="inline-flex items-center gap-3 text-text no-underline transition-opacity duration-200 hover:opacity-75 max-md:gap-0"
      >
        <img
          src="/logo.svg"
          alt=""
          width={22}
          height={Math.round((22 * 413) / 724)}
          className="flex-shrink-0"
        />
        <span className="font-sans text-base font-semibold tracking-tight max-md:hidden">
          StackSense
        </span>
      </a>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source on GitHub"
        title="Source on GitHub"
        className="
          inline-flex h-[34px] w-[34px] items-center justify-center
          rounded-lg border border-border/15 bg-bg-elev/70 backdrop-blur-md
          text-text/80 transition-colors duration-200
          hover:border-accent/45 hover:bg-bg-elev/90 hover:text-accent
          focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent/55 focus-visible:outline-offset-1
          max-md:h-9 max-md:w-9
        "
      >
        <Github size={15} strokeWidth={1.8} />
      </a>
      <GraphSearch {...props} />
    </header>
  );
}
