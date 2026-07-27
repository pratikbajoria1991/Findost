import fs from "fs";
import path from "path";

/**
 * Extracts FAQ-style Q&A from the training library for SEO/AEO/GEO surfaces
 * (FAQ page, FAQPage JSON-LD, llms.txt). Uses the English section of each
 * training file — answer-first and concise, exactly what answer engines quote.
 */

export interface FaqItem {
  q: string;
  a: string; // plain text, concise
  slug: string;
}

function toQuestion(topic: string): string {
  const t = topic.trim();
  // Training "topic" lines are already phrased as questions/how-tos; tidy them.
  if (/[?]$/.test(t)) return t;
  if (/^(how|what|which|should|is|are|can|when|why|do)\b/i.test(t)) return t + "?";
  return t;
}

/** Strip markdown to clean prose, take the first ~2 sentences / 320 chars. */
function toAnswer(body: string): string {
  const englishOnly = body.split(/\n\[(?:hi|bn|mr|te|ta|gu|ur|kn|or|ml)\]\s*\n/)[0];
  const clean = englishOnly
    .replace(/\|.*\|/g, " ") // tables
    .replace(/[*_`#>-]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= 340) return clean;
  const cut = clean.slice(0, 340);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "));
  return (lastStop > 120 ? cut.slice(0, lastStop + 1) : cut).trim() + " …";
}

export function getFaqItems(): FaqItem[] {
  const dir = path.join(process.cwd(), "content", "training");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
      .sort();
  } catch {
    return [];
  }
  const items: FaqItem[] = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!m) continue;
      const topic = m[1].match(/^topic:\s*(.+)$/m)?.[1]?.trim();
      if (!topic) continue;
      items.push({ q: toQuestion(topic), a: toAnswer(m[2].trim()), slug: f.replace(/\.md$/, "") });
    } catch {
      /* skip */
    }
  }
  return items;
}
