import type { MetadataRoute } from "next";
import { SITE_URL, AI_CRAWLERS } from "@/lib/seo";

/**
 * robots.txt — we WANT LLM/answer engines to crawl and cite Findost, so every
 * AI crawler is explicitly allowed (GPTBot, ClaudeBot, PerplexityBot,
 * Google-Extended, etc.) alongside normal search bots.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
