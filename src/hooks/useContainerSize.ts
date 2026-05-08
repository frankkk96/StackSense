import { useEffect, useRef, useState } from 'react';

export function useContainerSize<T extends HTMLElement>(): {
  ref: React.RefObject<T | null>;
  size: { w: number; h: number };
} {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const update = () => {
      if (ref.current) {
        setSize({ w: ref.current.clientWidth, h: ref.current.clientHeight });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return { ref, size };
}
