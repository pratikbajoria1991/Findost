import fs from "fs";
import path from "path";

/**
 * Blog engine. Two content sources:
 *  1. Editorial posts — markdown files in content/blog/ (frontmatter:
 *     title, date, description). Add a file, redeploy, it's live.
 *  2. Daily insight — auto-published every day by rotating through the
 *     training library, so the blog is never stale even with no new post.
 */

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  description: string;
  body: string;
}

function parsePost(slug: string, raw: string): Post | null {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return null;
  const [, front, body] = m;
  const get = (k: string) => front.match(new RegExp(`^${k}:\\s*(.+)$`, "m"))?.[1]?.trim() ?? "";
  const title = get("title");
  if (!title) return null;
  return {
    slug,
    title,
    date: get("date") || "2026-01-01",
    description: get("description"),
    body: body.trim(),
  };
}

export function getPosts(): Post[] {
  const dir = path.join(process.cwd(), "content", "blog");
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .map((f) => {
      try {
        return parsePost(f.replace(/\.md$/, ""), fs.readFileSync(path.join(dir, f), "utf8"));
      } catch {
        return null;
      }
    })
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(process.cwd(), "content", "blog", `${slug}.md`);
  try {
    return parsePost(slug, fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** Today's auto-insight, rotated daily through the training library. */
export function getDailyInsight(): { title: string; body: string; date: string } | null {
  const dir = path.join(process.cwd(), "content", "training");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
      .sort();
  } catch {
    return null;
  }
  if (files.length === 0) return null;

  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  const file = files[dayOfYear % files.length];

  try {
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!m) return null;
    const topic = m[1].match(/^topic:\s*(.+)$/m)?.[1]?.trim() ?? "Today's insight";
    // English section only (everything before the first [lang] marker)
    const body = m[2].split(/\n\[(?:hi|bn|mr|te|ta|gu|ur|kn|or|ml)\]\s*\n/)[0].trim();
    return {
      title: topic.charAt(0).toUpperCase() + topic.slice(1),
      body,
      date: now.toISOString().slice(0, 10),
    };
  } catch {
    return null;
  }
}
