import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CHAPTERS_DIR = path.join(process.cwd(), 'src/content/chapters');

export interface ChapterFrontmatter {
  title: string;
  order: number;
  slug: string;
}

export interface Chapter {
  slug: string;
  data: ChapterFrontmatter;
  body: string; // raw markdown body (no frontmatter)
}

let _all: Chapter[] | null = null;

export function getAllChapters(): Chapter[] {
  if (_all) return _all;
  const files = fs
    .readdirSync(CHAPTERS_DIR)
    .filter((f) => f.endsWith('.md'));
  const chapters = files.map((file) => {
    const raw = fs.readFileSync(path.join(CHAPTERS_DIR, file), 'utf-8');
    const parsed = matter(raw);
    const fm = parsed.data as ChapterFrontmatter;
    return {
      slug: fm.slug,
      data: fm,
      body: parsed.content.trim(),
    } satisfies Chapter;
  });
  chapters.sort((a, b) => a.data.order - b.data.order);
  _all = chapters;
  return chapters;
}

export function getChapter(slug: string): Chapter | undefined {
  return getAllChapters().find((c) => c.slug === slug);
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

// Lightweight markdown heading extractor: finds lines starting with `## `
// and slugifies the text using the same scheme rehype-slug uses.
export function extractHeadings(body: string): Heading[] {
  const out: Heading[] = [];
  const re = /^(#{2,3})\s+(.+?)\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const depth = m[1].length;
    const text = m[2].trim();
    out.push({ depth, text, slug: slugify(text) });
  }
  return out;
}

// Match GitHub-style heading anchors (lowercase, dashes, drop most punctuation,
// keep CJK characters). Mirrors rehype-slug's default behavior closely enough
// for in-page TOC links.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

// First paragraph (intro lede) — content before the first blank line.
export function extractIntro(body: string): string {
  const idx = body.indexOf('\n\n');
  return (idx > 0 ? body.slice(0, idx) : body).trim();
}

// ── Side-panel summary (used on the homepage graph) ─────────
export interface ChapterSummary {
  slug: string;
  title: string;
  intro: string;
  questions: string[];
  concepts: string[];
}

// Find a `## ...` section by title pattern; returns its body until the next H2.
function findSection(body: string, titleRe: RegExp): string | null {
  const lines = body.split('\n');
  let inSection = false;
  const out: string[] = [];
  for (const line of lines) {
    const h2 = /^##\s+(.+)$/.exec(line);
    if (h2) {
      if (inSection) break;
      if (titleRe.test(h2[1])) {
        inSection = true;
        continue;
      }
    }
    if (inSection) out.push(line);
  }
  return inSection ? out.join('\n') : null;
}

function parseQuestions(section: string): string[] {
  const out: string[] = [];
  for (const line of section.split('\n')) {
    const m = /^\s*\d+\.\s+(.+?)\s*$/.exec(line);
    if (m) out.push(m[1].trim());
  }
  return out;
}

function parseConceptNames(section: string): string[] {
  const out: string[] = [];
  for (const line of section.split('\n')) {
    // Match `- [Name](url)` (top-level bullets only, no leading h3)
    const m = /^\s*-\s*\[([^\]]+)\]/.exec(line);
    if (m) out.push(m[1].trim());
  }
  return out;
}

export function summarize(chapter: Chapter): ChapterSummary {
  const intro = extractIntro(chapter.body);
  const learnSection = findSection(chapter.body, /学完后/);
  const conceptSection = findSection(chapter.body, /核心概念/);
  return {
    slug: chapter.slug,
    title: chapter.data.title,
    intro,
    questions: learnSection ? parseQuestions(learnSection) : [],
    concepts: conceptSection ? parseConceptNames(conceptSection) : [],
  };
}

export function getAllSummaries(): ChapterSummary[] {
  return getAllChapters().map(summarize);
}
