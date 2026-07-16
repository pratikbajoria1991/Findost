# Findost — AI-Powered Wealth Companion

**Intelligent Wealth. Real Freedom.** A 24×7 personal finance concierge for Indian investors: a chatbot trained on your own material, goal planning with inflation-adjusted SIP maths, portfolio insight, and market context — in a concierge layout with the assistant front and centre.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Training-library chatbot** — answers come from markdown files in `content/training/` matched by a local retrieval engine (`lib/knowledge.ts`). **No external AI API, zero per-message cost.**
- **Portfolio engine fallback** — questions about the user's portfolio, SIP/goal maths, retirement and tax are computed live from `lib/demo-advisor.ts`
- No database needed for v1 (guest mode with a realistic demo Indian portfolio)

## Train the chatbot

Drop markdown files into [`content/training/`](content/training/README.md):

```markdown
---
topic: What is a SIP and how does it work
keywords: sip, systematic investment plan, sip kya hai
---

Your answer, exactly as the concierge should deliver it.
```

10 seed files ship already (SIP, fund categories, LTCG/STCG, 80C, emergency fund, NPS vs PPF, term insurance, asset allocation, direct vs regular, tax regimes). The market-risk disclaimer is appended automatically to every answer.

## Run locally

```bash
cd app
npm install
npm run dev          # http://localhost:3000
```

## Deploy to findost.io (Vercel)

```bash
cd app
npx vercel login        # one-time — opens browser
npx vercel --prod       # deploys
npx vercel domains add findost.io   # then add the A/CNAME records Vercel shows at your registrar
```

Then in Vercel → Project → Settings → Environment Variables, add the vars from
`.env.example` (Google OAuth, NEXTAUTH_SECRET, Airtable). Redeploy. The site
works fully even before these are set — they switch on sign-in and CRM capture.

## Integrations

| Capability | How it works | Env vars |
|---|---|---|
| Google sign-in/signup | NextAuth at `/api/auth/*`; nav button on landing | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET` |
| Airtable CRM | Every Google sign-in + callback-form submit → row in your base (`lib/airtable.ts`) | `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE` |
| WhatsApp | All CTAs (hero, sidebar, Start planning now, lead section) open **wa.me/916205247092** | — |
| Blog | `/blog` — markdown posts in `content/blog/` + a **daily insight** auto-rotated from the training library (ISR, refreshes hourly) | — |

## Before going live — action items

| Item | Where |
|---|---|
| Google OAuth credentials | console.cloud.google.com → see `.env.example` |
| Airtable base (Leads table: Name, Email, Phone, Source, Message, Captured At) | airtable.com → see `.env.example` |
| Add your own training material | `content/training/*.md` |
| Add blog posts | `content/blog/*.md` |

## Architecture notes

- `app/api/chat/route.ts` — streaming chat route. Tries the training library first (`lib/knowledge.ts`), falls back to the computed portfolio engine (`lib/demo-advisor.ts`). Response header `X-Findost-Mode: trained|demo` tells the UI which engine answered.
- `lib/knowledge.ts` — loads `content/training/*.md` and scores keyword-phrase, topic and body overlap against the question; answers only above a confidence threshold so weak matches fall through to the portfolio engine.
- `lib/demo-data.ts` — single source of truth for the demo portfolio; the dashboard, right rail and chat engine all read from it, so numbers always agree.
- `next.config.mjs` — `outputFileTracingIncludes` bundles the training library into the Vercel serverless function.

## Compliance positioning

Findost presents as an **education-first platform** built by a Chartered Accountant who is a **NISM-certified Research Analyst** and **NISM-certified Mutual Fund Distributor** (MF distribution in partnership with Wealthy.in). It does not claim SEBI registration, give buy/sell calls, or guarantee returns; every chat answer carries a market-risk disclaimer.

## Phase 2 roadmap

- Supabase auth + persisted portfolios and chat history
- Live NSE/BSE quotes and MF NAVs (AMFI feed)
- WhatsApp (Gupshup) + Telegram bot wired to the same `/api/chat` brain
- Optional LLM upgrade path: the chat route is engine-agnostic — a future Claude API engine can slot in behind the same streaming interface
- Razorpay subscription tier (₹499/mo)
