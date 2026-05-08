import { useEffect, useMemo, useRef, useState } from 'react';
import type { GraphNode } from '@/data/types';

const MAX_RESULTS = 12;

export function useGraphSearch(graphNodes: GraphNode[]) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);

  // Case-insensitive substring match against label / id / domain / tags, capped.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as GraphNode[];
    return graphNodes
      .filter((n) => {
        if (n.label.toLowerCase().includes(q)) return true;
        if (n.id.toLowerCase().includes(q)) return true;
        if (n.domain.toLowerCase().includes(q)) return true;
        for (const tag of n.tags) if (tag.toLowerCase().includes(q)) return true;
        return false;
      })
      .slice(0, MAX_RESULTS);
  }, [query, graphNodes]);

  // Reset highlight when the query string changes.
  useEffect(() => {
    setActiveResult(0);
  }, [query]);

  // ⌘K / Ctrl+K focuses the input.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return {
    inputRef,
    query,
    setQuery,
    open,
    setOpen,
    results,
    activeResult,
    setActiveResult,
  };
}
