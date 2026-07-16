import { totals } from "./demo-data";
import { formatINRCompact } from "./format";
import { sipFutureValue, sipRequired, inflate } from "./calculators";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const DISCLAIMER =
  "\n\n_Mutual fund and equity investments are subject to market risks. This is educational guidance, not investment advice or a solicitation._";

/**
 * Rule-based concierge used when ANTHROPIC_API_KEY is not configured.
 * Answers are computed from the same demo portfolio the dashboard shows,
 * so the experience stays coherent end-to-end.
 */
export function demoReply(messages: ChatMessage[]): string {
  const last = (messages[messages.length - 1]?.content ?? "").toLowerCase();
  const t = totals();

  if (/portfolio|net worth|holdings|review|how am i doing/.test(last)) {
    return [
      `Here's a quick read of your portfolio:`,
      ``,
      `**Net worth: ${formatINRCompact(t.current)}** against ${formatINRCompact(t.invested)} invested — an unrealised gain of **${formatINRCompact(t.gain)} (+${(((t.current - t.invested) / t.invested) * 100).toFixed(1)}%)**.`,
      ``,
      `- **Mutual funds ${formatINRCompact(t.mf.current)}** — your core engine. Parag Parikh Flexi Cap and the Nifty index fund are doing the heavy lifting.`,
      `- **Direct equity ${formatINRCompact(t.eq.current)}** — concentrated in 5 quality large-caps; ITC is your best performer (+39%).`,
      `- **Fixed income ${formatINRCompact(t.fi.current)}** — EPF + PPF + FD give you a solid ~31% defensive sleeve.`,
      `- **Gold ${formatINRCompact(t.au.current)}** — SGBs up sharply; a good inflation hedge at ~6% of portfolio.`,
      ``,
      `**Two observations:** equity allocation (~55%) suits your moderately-aggressive profile at 34, and your ₹45K/month SIP rate is a healthy 24% of income. Consider topping up PPF before March to use the full ₹1.5L 80C limit.`,
    ].join("\n") + DISCLAIMER;
  }

  if (/sip|invest monthly|monthly invest/.test(last) && /crore|cr|1 crore|10000000|target/.test(last)) {
    const monthly = sipRequired(1_00_00_000, 12, 15);
    return [
      `To reach **₹1 crore in 15 years** assuming 12% annual returns (long-run equity average):`,
      ``,
      `- Required SIP: **${formatINRCompact(monthly)}/month**`,
      `- Total invested: ${formatINRCompact(monthly * 180)}`,
      `- Wealth created: ${formatINRCompact(1_00_00_000 - monthly * 180)}`,
      ``,
      `You currently invest ₹45,000/month — at 12% that grows to **${formatINRCompact(sipFutureValue(45_000, 12, 15))}** in 15 years, so you're already on a multi-crore path. Step up SIPs 10% annually and you'll get there ~3 years sooner.`,
    ].join("\n") + DISCLAIMER;
  }

  if (/retire|retirement/.test(last)) {
    const corpusToday = 1_20_000 * 12 * 25;
    const corpusFuture = inflate(corpusToday, 6, 21);
    const sip = sipRequired(corpusFuture - sipFutureValue(45_000, 11, 21), 11, 21);
    return [
      `Let's frame retirement at **55 (21 years away)**:`,
      ``,
      `- Today's lifestyle ≈ ₹1.2 L/month → ₹14.4 L/year`,
      `- Corpus needed today (25× annual expenses): **${formatINRCompact(corpusToday)}**`,
      `- Inflated at 6% for 21 years: **${formatINRCompact(corpusFuture)}**`,
      ``,
      `Your current ₹45K/month SIP at 11% builds ~**${formatINRCompact(sipFutureValue(45_000, 11, 21))}**. Bridging the gap needs roughly **${formatINRCompact(Math.max(sip, 0))}/month more**, or a 10% annual SIP step-up which achieves nearly the same outcome.`,
      ``,
      `Your EPF + PPF (${formatINRCompact(t.fi.current)}) adds a tax-efficient debt cushion. Keep equity ~60-65% till age 45, then glide down.`,
    ].join("\n") + DISCLAIMER;
  }

  if (/tax|80c|ltcg|regime/.test(last)) {
    return [
      `Key tax angles for you this financial year:`,
      ``,
      `1. **80C headroom** — PPF + EPF (employee share) + ELSS count toward ₹1.5 L (old regime). Top up PPF before 5th April for full-year interest.`,
      `2. **LTCG harvesting** — equity LTCG above **₹1.25 L/year is taxed at 12.5%**. You have meaningful unrealised gains; consider harvesting up to the exemption and re-buying to reset cost basis.`,
      `3. **Regime choice** — at ₹1.85 L/month with home-loan or HRA + 80C deductions, run both regimes; the old regime often wins above ~₹4 L of deductions. I can run the numbers if you share your deductions.`,
      `4. **Debt funds** — taxed at slab now; your FD and debt allocation are tax-equivalent, so choose on liquidity and rates.`,
    ].join("\n") + DISCLAIMER;
  }

  if (/emergency|safety net/.test(last)) {
    return [
      `Your emergency cover: **cash ${formatINRCompact(t.cash)}** ≈ 1.7 months of income.`,
      ``,
      `Target **6 months of expenses (~₹7.2 L)**. Suggested build:`,
      `- Keep ₹2 L in savings/sweep-in FD for instant access`,
      `- Park the rest in a liquid fund or overnight fund`,
      `- Route 2-3 months of bonus/variable pay here before adding new SIPs`,
    ].join("\n") + DISCLAIMER;
  }

  if (/market|nifty|sensex|outlook/.test(last)) {
    return [
      `On the dashboard you'll see an indicative snapshot (demo levels): **NIFTY ~26,180 (+0.6%)**, midcaps outperforming, VIX subdued near 12.8 — historically a low-fear zone.`,
      ``,
      `Rather than timing entries, your SIPs already average across cycles. If you have lumpsum cash, staggering it over 3-6 months via STP from a liquid fund is the disciplined route.`,
      ``,
      `_For live quotes, please verify on NSE/BSE or your broker terminal — concierge data here is illustrative._`,
    ].join("\n") + DISCLAIMER;
  }

  if (/hello|hi|hey|namaste/.test(last) || last.trim().length < 12) {
    return [
      `Namaste! I'm **PaisaGuru by Findost** — your 24×7 wealth desk. I can:`,
      ``,
      `- Review your **portfolio** and asset allocation`,
      `- Plan **goals** — retirement, home, education — with exact SIP maths`,
      `- Optimise **tax** — 80C, LTCG harvesting, regime choice`,
      `- Explain **markets** and product categories in plain language`,
      ``,
      `Try: *"Review my portfolio"* or *"What SIP do I need for ₹1 crore in 15 years?"*`,
    ].join("\n");
  }

  return [
    DEMO_FALLBACK_MARKER,
    ``,
    `I answer best on **portfolio review, SIP & goal maths, stock market basics, bonds & FDs, tax (80C/LTCG/regime), retirement and insurance** — try one of those, or tap a suggestion above.`,
  ].join("\n");
}

/** First line of the engine's "didn't understand" reply — used by the API
 *  route to swap in a localized fallback for non-English users. */
export const DEMO_FALLBACK_MARKER = "Good question.";
