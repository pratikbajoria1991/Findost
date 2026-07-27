/**
 * Central SEO / AEO / GEO configuration and structured-data builders.
 * AEO = Answer Engine Optimization (schema.org so answer engines quote us).
 * GEO = Generative Engine Optimization (clean, citable content + llms.txt so
 * ChatGPT / Perplexity / Claude / Gemini surface Findost).
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://findost.io").replace(/\/$/, "");
export const SITE_NAME = "Findost";
export const SITE_TAGLINE = "Intelligent Wealth. Real Freedom.";
export const SITE_DESCRIPTION =
  "Findost is a 24×7 AI-powered wealth companion for Indian investors. Get the right mutual funds, term & health insurance, bonds and tax plan — with PaisaGuru, an AI concierge in 11 Indian languages, built by a Chartered Accountant who is a NISM-certified Research Analyst and Mutual Fund Distributor.";

export const FOUNDER = {
  name: "Pratik Bajoria",
  credentials: "Chartered Accountant, NISM-certified Research Analyst & Mutual Fund Distributor",
};

// Owned channels — used in schema.org sameAs so entity engines link them to Findost.
export const SOCIALS = {
  telegram: "https://t.me/Findost_bot", // Telegram bot
  telegramChannel: "https://t.me/findost", // [verify: Findost Telegram channel handle]
  instagram: "https://www.instagram.com/findost", // [verify: Findost Instagram handle]
  whatsapp: "https://wa.me/916205247092",
};

export const AI_CRAWLERS = [
  "GPTBot", // OpenAI / ChatGPT
  "OAI-SearchBot", // OpenAI search
  "ChatGPT-User", // ChatGPT browsing
  "ClaudeBot", // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Google Gemini / AI Overviews training
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot",
  "CCBot", // Common Crawl (feeds many LLMs)
  "Bytespider", // TikTok / Doubao
  "cohere-ai",
  "Meta-ExternalAgent",
];

type Json = Record<string, unknown>;

/** schema.org FinancialService + Organization for Findost. */
export function organizationSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FinancialService"],
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Findost — AI Wealth Management",
    url: SITE_URL,
    logo: `${SITE_URL}/findost-logo-mark.png`,
    image: `${SITE_URL}/findost-brand-logo.png`,
    slogan: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    areaServed: { "@type": "Country", name: "India" },
    knowsLanguage: ["en", "hi", "bn", "mr", "te", "ta", "gu", "ur", "kn", "or", "ml"],
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.credentials,
    },
    serviceType: [
      "Mutual fund distribution",
      "Term and health insurance advisory",
      "Bonds and fixed deposits",
      "Goal-based financial planning",
      "Tax planning",
    ],
    sameAs: [SOCIALS.instagram, SOCIALS.telegramChannel, SOCIALS.telegram],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Odia", "Malayalam"],
      url: SOCIALS.whatsapp,
    },
  };
}

/** schema.org WebSite with a SearchAction (helps Google sitelinks + AEO). */
export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };
}

export function faqPageSchema(items: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleSchema(a: {
  title: string;
  description: string;
  slug: string;
  date: string;
}): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    url: `${SITE_URL}/blog/${a.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${a.slug}`,
    author: { "@type": "Person", name: FOUNDER.name, jobTitle: FOUNDER.credentials },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
    isAccessibleForFree: true,
  };
}

export function breadcrumbSchema(crumbs: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}
