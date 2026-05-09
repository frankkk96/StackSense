import { useEffect, useState } from 'react';
import { Box, Braces, Briefcase, Lightbulb } from 'lucide-react';
import type { NodeType } from '@/data/types';
import { faviconUrl } from '@/lib/graph-data';

const TYPE_ICON: Record<NodeType, typeof Box> = {
  project: Box,
  concept: Lightbulb,
  language: Braces,
  product: Briefcase,
};

const ICON_FRAME =
  'flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center mt-0.5 rounded-lg border border-accent/20 bg-accent/10 text-accent';

export function PanelIcon({
  type,
  homepage,
}: {
  type: NodeType;
  homepage?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const src = homepage ? faviconUrl(homepage) : null;

  // Reset failure state when homepage changes (user navigated to another node).
  useEffect(() => {
    setLogoFailed(false);
  }, [homepage]);

  if (src && !logoFailed) {
    return (
      <img
        src={src}
        width={28}
        height={28}
        alt=""
        aria-hidden="true"
        onError={() => setLogoFailed(true)}
        className={`${ICON_FRAME} block object-contain p-[5px] bg-bg-elev/60 border-border/15`}
      />
    );
  }

  const Icon = TYPE_ICON[type];
  return (
    <span aria-hidden="true" className={ICON_FRAME}>
      <Icon size={26} strokeWidth={1.5} />
    </span>
  );
}
