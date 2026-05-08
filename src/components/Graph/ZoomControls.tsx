import { Maximize2, Minus, Plus } from 'lucide-react';
import type { UIStrings } from '@/i18n/strings';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  t: UIStrings;
}

const BTN_CLASS =
  'flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border-0 bg-transparent text-text/70 transition-[background-color,color] duration-150 hover:bg-bg/50 hover:text-text active:bg-accent/10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent/50 focus-visible:outline-offset-1 cursor-pointer max-md:h-9 max-md:w-9';

export function ZoomControls({ onZoomIn, onZoomOut, onFit, t }: Props) {
  return (
    <div
      role="group"
      aria-label={t.zoomIn}
      className="
        absolute left-4 bottom-4 z-[5] flex flex-col gap-0.5 rounded-lg p-[3px]
        border border-border/15 bg-bg-elev/70 backdrop-blur-md
        max-md:left-3 max-md:bottom-[max(12px,env(safe-area-inset-bottom))] max-md:gap-[3px] max-md:p-1
      "
    >
      <button type="button" onClick={onZoomIn} aria-label={t.zoomIn} title={t.zoomIn} className={BTN_CLASS}>
        <Plus size={15} strokeWidth={1.8} />
      </button>
      <button type="button" onClick={onZoomOut} aria-label={t.zoomOut} title={t.zoomOut} className={BTN_CLASS}>
        <Minus size={15} strokeWidth={1.8} />
      </button>
      <button type="button" onClick={onFit} aria-label={t.zoomFit} title={t.zoomFit} className={BTN_CLASS}>
        <Maximize2 size={13} strokeWidth={1.8} />
      </button>
    </div>
  );
}
