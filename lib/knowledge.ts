import fs from "fs";
import path from "path";
import { UI, type Lang } from "./i18n";

/**
 * Training-material knowledge engine. Loads markdown files from
 * content/training/ (frontmatter: topic, keywords) and answers user
 * questions by scoring keyword/topic/body overlap. No external AI API.
 *
 * Multilingual: a file body can contain `[hi]`, `[ta]`, ... sections.
 * The engine matches across all sections (Unicode-aware) and answers in
 * the requested language, falling back to English.
 */

interface KnowledgeEntry {
  topic: string;
  keywords: string[]; // lowercase phrases
  sections: Partial<Record<Lang, string>>; // 'en' + translations
  matchTokens: Set<string>; // topic + first line of each language section
  bodyTokens: Set<string>; // every word across all sections
}

const STOPWORDS = new Set([
  // English
  "the", "a", "an", "is", "are", "was", "in", "on", "of", "for", "to", "and",
  "or", "my", "i", "me", "what", "how", "do", "does", "should", "can", "about",
  "with", "be", "it", "this", "that", "you", "your", "much", "need", "have",
  // Hindi / Marathi (Devanagari)
  "है", "हैं", "का", "की", "के", "में", "और", "से", "को", "क्या", "कैसे", "एक",
  "आहे", "काय", "कसे", "मध्ये", "आणि", "म्हणजे",
  // Bengali
  "কী", "কি", "এর", "এবং", "করে", "কীভাবে", "হয়",
  // Telugu
  "అంటే", "ఏమిటి", "ఎలా", "మరియు", "లో",
  // Tamil
  "என்றால்", "என்ன", "எப்படி", "மற்றும்", "இல்",
  // Gujarati
  "શું", "છે", "કેવી", "રીતે", "અને", "માં",
  // Urdu
  "کیا", "ہے", "کیسے", "اور", "میں", "کے",
  // Kannada
  "ಎಂದರೇನು", "ಹೇಗೆ", "ಮತ್ತು", "ಅಲ್ಲಿ",
  // Odia
  "କଣ", "କିପରି", "ଏବଂ", "ରେ",
  // Malayalam
  "എന്താണ്", "എങ്ങനെ", "ഒപ്പം", "ൽ",
]);

let cache: KnowledgeEntry[] | null = null;

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    // \p{M} keeps Indic combining vowel signs (matras) attached to words
    .replace(/[^\p{L}\p{M}\p{N}₹%\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const LANG_MARKER = /^\[(hi|bn|mr|te|ta|gu|ur|kn|or|ml)\]\s*$/;

function parseSections(body: string): Partial<Record<Lang, string>> {
  const sections: Partial<Record<Lang, string>> = {};
  let current: Lang = "en";
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join("\n").trim();
    if (text) sections[current] = text;
    buf = [];
  };
  for (const line of body.split("\n")) {
    const m = line.trim().match(LANG_MARKER);
    if (m) {
      flush();
      current = m[1] as Lang;
    } else {
      buf.push(line);
    }
  }
  flush();
  return sections;
}

function parseEntry(raw: string): KnowledgeEntry | null {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const [, front, body] = m;
  const topic = front.match(/^topic:\s*(.+)$/m)?.[1]?.trim() ?? "";
  const keywords = (front.match(/^keywords:\s*(.+)$/m)?.[1] ?? "")
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
  const sections = parseSections(body.trim());
  if (!topic || !sections.en) return null;

  // Topic-grade tokens: the English topic plus the first line of every
  // language section (each section opens with its own localized heading).
  // The bold heading itself also becomes a keyword phrase, so a question
  // typed verbatim in any language is a strong match.
  const matchTokens = new Set(tokenize(topic));
  for (const text of Object.values(sections)) {
    const firstLine = text?.split("\n")[0] ?? "";
    for (const t of tokenize(firstLine)) matchTokens.add(t);
    const heading = firstLine.match(/^\*\*(.+?)\*\*/)?.[1];
    if (heading) {
      const phrase = heading.replace(/[?？!।]/g, "").trim().toLowerCase();
      if (phrase) keywords.push(phrase);
    }
  }
  const bodyTokens = new Set<string>();
  for (const text of Object.values(sections)) {
    for (const t of tokenize(text ?? "")) bodyTokens.add(t);
  }
  return { topic, keywords, sections, matchTokens, bodyTokens };
}

function loadEntries(): KnowledgeEntry[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const dir = path.join(process.cwd(), "content", "training");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  } catch {
    cache = [];
    return cache;
  }
  cache = files
    .map((f) => {
      try {
        return parseEntry(fs.readFileSync(path.join(dir, f), "utf8"));
      } catch {
        return null;
      }
    })
    .filter((e): e is KnowledgeEntry => e !== null);
  return cache;
}

function score(query: string, queryTokens: string[], entry: KnowledgeEntry): number {
  let s = 0;
  // Whole keyword phrases appearing in the query are the strongest signal.
  for (const kw of entry.keywords) {
    if (kw && query.includes(kw)) s += kw.includes(" ") ? 5 : 3;
  }
  // Topic-grade overlap (English topic + localized section headings).
  // Prefix-tolerant so Indic inflections still match (বাজারে ~ বাজার).
  for (const t of queryTokens) {
    if (entry.matchTokens.has(t)) {
      s += 2;
    } else if (t.length >= 4) {
      for (const mt of entry.matchTokens) {
        if (mt.length >= 4 && (t.startsWith(mt) || mt.startsWith(t))) {
          s += 2;
          break;
        }
      }
    }
  }
  // Light body overlap, capped so long files don't dominate.
  let bodyHits = 0;
  for (const t of queryTokens) if (entry.bodyTokens.has(t)) bodyHits++;
  s += Math.min(bodyHits * 0.5, 3);
  return s;
}

/**
 * Returns the best training-material answer for the query in the requested
 * language (English fallback), or null when nothing matches confidently.
 */
export function knowledgeReply(rawQuery: string, lang: Lang = "en"): string | null {
  const entries = loadEntries();
  if (entries.length === 0) return null;
  const query = rawQuery.toLowerCase();
  const queryTokens = tokenize(rawQuery);

  let best: KnowledgeEntry | null = null;
  let bestScore = 0;
  for (const e of entries) {
    const s = score(query, queryTokens, e);
    if (s > bestScore) {
      bestScore = s;
      best = e;
    }
  }

  // Threshold: at least one strong keyword hit or solid topic overlap.
  if (!best || bestScore < 4) return null;
  const answer = best.sections[lang] ?? best.sections.en!;
  return answer + "\n\n" + UI[lang].disclaimer;
}
