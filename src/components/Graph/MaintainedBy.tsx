import { Github } from 'lucide-react';
import { contactEmail } from '@/data/site';

const REPO_URL = 'https://github.com/frankkk96/StackSense';

export function MaintainedBy() {
  return (
    <p
      className="
        pointer-events-none absolute right-4 z-[5] m-0 flex items-center gap-2
        bottom-[max(12px,env(safe-area-inset-bottom))]
        font-mono text-[10.5px] tracking-[0.02em] text-text/30
        max-md:right-3 max-md:text-[9.5px]
        transition-opacity duration-200
        group-data-[panel-open=true]:pointer-events-none group-data-[panel-open=true]:opacity-0
      "
    >
      <span>
        maintained by{' '}
        <a
          href={`mailto:${contactEmail}`}
          className="pointer-events-auto text-inherit no-underline transition-colors duration-200 hover:text-accent/85"
        >
          {contactEmail}
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Source on GitHub"
        title="Source on GitHub"
        className="pointer-events-auto inline-flex items-center text-inherit transition-colors duration-200 hover:text-accent/85"
      >
        <Github size={12} strokeWidth={1.8} />
      </a>
    </p>
  );
}
