import { ArrowUpRight, X as IconX } from 'lucide-react';
import type { Locale, NodeType } from '@/data/types';
import { STRINGS } from '@/i18n/strings';
import { labelForType, type PanelData } from '@/lib/graph-data';
import { PanelIcon } from './PanelIcon';

interface Props {
  panel: PanelData | null;
  onClose: () => void;
  onSelectNode: (id: string) => void;
  locale: Locale;
}

const CHIP_BASE =
  'inline-flex max-w-full cursor-pointer items-center gap-[7px] rounded-full border border-border/20 bg-bg-elev/55 px-2.5 py-1.5 font-sans text-xs leading-none text-text/85 no-underline transition-[background-color,border-color,color] duration-150 hover:border-accent/45 hover:bg-bg-elev/85 hover:text-text';

const CHIP_VARIANT_BY_TYPE: Record<NodeType, string> = {
  project:
    'bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent/55 hover:text-accent',
  concept: 'bg-transparent border-border/30',
  language:
    'font-mono text-[11.5px] tracking-[0.02em] bg-bg-muted/60 border-border/20',
  product:
    'bg-accent/[0.07] border-accent/40 text-accent/95 hover:bg-accent/15 hover:border-accent/60 hover:text-accent',
};

export function SidePanel({ panel, onClose, onSelectNode, locale }: Props) {
  const t = STRINGS[locale];
  const open = panel != null;

  return (
    <aside
      data-open={open || undefined}
      aria-hidden={!open}
      className="
        absolute right-0 top-0 bottom-0 z-30 flex w-[420px] max-w-[90vw] flex-col
        overflow-hidden border-l border-border/15
        bg-[linear-gradient(180deg,rgb(28_29_30/0.96),rgb(22_23_23/0.96))]
        shadow-[-16px_0_36px_rgb(0_0_0/0.4)] backdrop-blur-md
        translate-x-full transition-transform duration-[320ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]
        data-[open=true]:translate-x-0
        max-md:w-full max-md:max-w-none
      "
    >
      <div className="relative flex-1 overflow-y-auto px-8 pt-[60px] pb-8 max-md:px-5 max-md:pt-14">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          title={t.close}
          className="
            absolute right-4 top-3.5 z-[1] flex h-[30px] w-[30px] items-center justify-center
            cursor-pointer rounded-full border border-border/15 bg-bg/60 p-0 text-text/85
            transition-[background-color,border-color,color] duration-200
            hover:border-accent/50 hover:bg-accent/15 hover:text-accent
            max-md:right-3 max-md:top-3 max-md:h-[34px] max-md:w-[34px]
          "
        >
          <IconX size={15} strokeWidth={1.6} />
        </button>

        {panel && (
          <>
            <header className="mb-[22px] flex items-start gap-4">
              <PanelIcon type={panel.iconType} homepage={panel.homepage} />
              <div>
                <h2 className="m-0 mb-1 text-[22px] font-semibold leading-[1.22] tracking-[-0.012em]">
                  {panel.title}
                </h2>
                <span className="inline-block rounded bg-accent/15 px-[7px] py-0.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-accent">
                  {labelForType(panel.iconType, locale)}
                </span>
              </div>
            </header>

            {(panel.tags.length > 0 || panel.domain) && (
              <div className="mb-[18px] flex flex-wrap gap-[5px]">
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-[9px] py-1 text-[10.5px] font-semibold uppercase tracking-[0.06em] text-accent select-none">
                  {panel.domain}
                </span>
                {panel.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex select-none items-center rounded-full border border-border/15 bg-bg-elev/55 px-[9px] py-1 font-sans text-[11.5px] leading-none text-text/75"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {panel.intro && (
              <p className="mb-[22px] m-0 text-[14px] leading-[1.75] opacity-80 max-md:text-[13.5px]">
                {panel.intro}
              </p>
            )}

            {panel.resources && panel.resources.length > 0 && (
              <Section title={t.sectionResources(panel.resources.length)}>
                <div className="flex flex-wrap gap-[5px]">
                  {panel.resources.map((r) => (
                    <a
                      key={r.href}
                      href={r.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={r.label}
                      className={`${CHIP_BASE} group/chip`}
                    >
                      <span className="flex-shrink-0 font-mono text-[9.5px] uppercase tracking-[0.16em] opacity-55">
                        {r.kind}
                      </span>
                      <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                        {r.label}
                      </span>
                      <ArrowUpRight
                        size={11}
                        strokeWidth={1.7}
                        className="flex-shrink-0 opacity-50 transition-[opacity,transform] duration-150 group-hover/chip:translate-x-[1px] group-hover/chip:-translate-y-[1px] group-hover/chip:opacity-95"
                      />
                    </a>
                  ))}
                </div>
              </Section>
            )}

            {panel.concepts.length > 0 && (
              <Section title={t.sectionConcepts}>
                <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                  {panel.concepts.map((c, i) => (
                    <li
                      key={i}
                      className="rounded border border-border/15 bg-bg-muted/55 px-2.5 py-1 font-mono text-[11.5px] text-text opacity-90"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {panel.related.length > 0 && (
              <Section title={t.sectionRelated(panel.related.length)}>
                <div className="flex flex-wrap gap-[5px]">
                  {panel.related.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => onSelectNode(r.id)}
                      title={t.jumpTo(r.label)}
                      className={`${CHIP_BASE} ${CHIP_VARIANT_BY_TYPE[r.type]}`}
                    >
                      <span className="max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {panel.questions.length > 0 && (
              <Section title={t.sectionQuestions}>
                <ol className="m-0 list-none p-0">
                  {panel.questions.map((q, i) => (
                    <li
                      key={i}
                      className="
                        flex gap-3 py-2 text-[13px] leading-[1.65] opacity-90
                        border-t border-dashed border-border/10
                        first:border-t-0 first:pt-0
                        max-md:text-[12.5px]
                      "
                    >
                      <span className="font-mono text-[11.5px] font-medium leading-[1.65] text-accent opacity-75">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1">{q}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            )}
          </>
        )}
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-[22px]">
      <h3 className="m-0 mb-3 font-mono text-[10.5px] font-medium uppercase tracking-[0.22em] opacity-50 max-md:text-[10px]">
        {title}
      </h3>
      {children}
    </section>
  );
}
