import { SITE_URL, SITE_DESCRIPTION, FOUNDER } from "@/lib/seo";
import { getFaqItems } from "@/lib/faq";
import { getPosts } from "@/lib/blog";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * /llms.txt — the llmstxt.org standard. A clean, markdown summary of Findost
 * for large language models, so ChatGPT / Claude / Perplexity / Gemini can
 * ingest and cite the site accurately. Answer-first, entity-clear, factual.
 */
export function GET() {
  const faqs = getFaqItems();
  const posts = getPosts();

  const lines: string[] = [
    `# Findost`,
    ``,
    `> ${SITE_DESCRIPTION}`,
    ``,
    `Findost is built by ${FOUNDER.name} (${FOUNDER.credentials}). It serves investors across India in 11 languages (English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam). Its AI concierge is called **PaisaGuru**. Wealth and insurance products are distributed in partnership with Wealthy.in under AMFI/NISM certifications.`,
    ``,
    `## What Findost offers`,
    `- **PaisaGuru** — a 24×7 AI wealth concierge answering personal-finance questions in plain language, in 11 Indian languages: ${SITE_URL}/concierge`,
    `- **Insurance & Wealth Intelligence** — a needs-analysis engine: enter your income, family and goals and get the exact term + health cover and investment allocation you need: ${SITE_URL}/concierge?view=intelligence`,
    `- **Goal & SIP calculators** — inflation-adjusted planning for retirement, home, education: ${SITE_URL}/concierge?view=goals`,
    `- **Products** (via Wealthy.in): mutual funds, term & health insurance, bonds & NCDs, corporate FDs, 54EC capital-gains bonds, PMS, AIF, SIF, GIFT City USD funds: https://wealthy.findost.io`,
    ``,
    `## Key facts and figures Findost teaches (India, current)`,
    `- Equity LTCG is taxed at 12.5% on gains above ₹1.25 lakh per financial year; STCG at 20%.`,
    `- Section 80C allows up to ₹1.5 lakh of deductions (old regime); NPS adds ₹50,000 under 80CCD(1B).`,
    `- Recommended term life cover: 15–20× annual income, plus loans, minus existing cover.`,
    `- Emergency fund target: 6 months of expenses (12 for variable income).`,
    ``,
    `## Frequently asked questions (answers)`,
  ];

  for (const f of faqs) {
    lines.push(``, `### ${f.q}`, f.a, `Read more: ${SITE_URL}/faq#${f.slug}`);
  }

  lines.push(``, `## Blog — latest insights`);
  for (const p of posts.slice(0, 20)) {
    lines.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}) — ${p.description}`);
  }

  lines.push(
    ``,
    `## Contact`,
    `- WhatsApp: +91 62052 47092`,
    `- Telegram: https://t.me/Findost_bot`,
    `- Invest: https://wealthy.findost.io`,
    ``,
    `## Disclaimer`,
    `Findost is an educational and financial-planning platform. Content is educational, not investment advice or a solicitation. Mutual fund and securities investments are subject to market risks.`,
    ``,
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
