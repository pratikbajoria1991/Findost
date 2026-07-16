import Image from "next/image";
import Link from "next/link";
import PhoneMockup from "@/components/PhoneMockup";
import PaisaGuruLauncher from "@/components/PaisaGuruLauncher";
import SessionChip from "@/components/SessionChip";
import LeadForm from "@/components/LeadForm";
import { authConfigured } from "@/lib/auth";

const WHATSAPP_URL =
  "https://wa.me/916205247092?text=Hi%20Findost%2C%20I%20want%20to%20start%20planning%20my%20wealth";
const TELEGRAM_URL = "https://t.me/Findost_bot";

const NAV_LINKS = [
  { label: "Wealth", href: "/concierge?view=portfolio" },
  { label: "Calculators", href: "/concierge?view=goals" },
  { label: "Goals", href: "/concierge?view=goals" },
  { label: "Insights", href: "/concierge?view=markets" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "#about" },
];

const STATS = [
  { value: "90 sec", label: "Instant KYC" },
  { value: "₹500", label: "Min. SIP" },
  { value: "24/7", label: "WhatsApp Advisor" },
];

const features = [
  {
    icon: "🪶",
    title: "24×7 AI Concierge",
    body: "A private-banker-grade assistant that knows your portfolio, answers in seconds, and never sleeps. Ask anything — SIP maths, tax angles, market context.",
  },
  {
    icon: "📊",
    title: "Portfolio Intelligence",
    body: "Net worth, asset allocation and P&L across mutual funds, equity, FDs, gold and EPF/PPF — in clean Indian rupee terms, lakh and crore.",
  },
  {
    icon: "🎯",
    title: "Goal-Based Planning",
    body: "Retirement, home, education — inflation-adjusted targets with the exact monthly SIP needed, and step-up strategies that get you there sooner.",
  },
  {
    icon: "🧾",
    title: "Tax Intelligence",
    body: "80C headroom, LTCG harvesting at the ₹1.25L exemption, old vs new regime — proactive nudges from a CA-grade engine.",
  },
  {
    icon: "📈",
    title: "Markets, Decoded",
    body: "Nifty, Sensex and your watchlist with plain-language context — discipline over noise, SIPs over timing.",
  },
  {
    icon: "💬",
    title: "WhatsApp & Telegram",
    body: "Your concierge, on the apps you already use. Nudges before tax deadlines, SIP reminders, and answers on the go.",
  },
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-7xl px-6">
      {/* Nav */}
      <nav className="flex items-center justify-between gap-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/findost-logo-mark.png" alt="Findost" width={40} height={40} className="rounded-xl" />
          <span className="text-lg font-bold tracking-[0.35em] text-white">FINDOST</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-mist-300 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="transition hover:text-white">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-5">
          <SessionChip configured={authConfigured} />
          <Link
            href="/concierge"
            className="rounded-full bg-spark px-6 py-2.5 text-sm font-bold tracking-wide text-ink-950 shadow-glow transition hover:bg-spark-soft"
          >
            GET STARTED
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid items-center gap-14 pb-24 pt-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-spark/40 px-5 py-2 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-spark-soft">
            ★ The 24/7 Wealth Desk in Your Pocket
          </span>
          <h1 className="mt-8 text-6xl font-semibold leading-[1.04] tracking-tight text-white md:text-7xl">
            Smart
            <br />
            wealth.
            <br />
            <span className="font-serif italic text-spark">Better life.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-mist-300">
            Backed by AI. Driven by you. Manage SIPs, FDs and tax planning over
            WhatsApp — with a real CA on the other end.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#16A34A] px-8 py-4 text-base font-bold text-white transition hover:bg-[#15803D]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.8 1.3-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.7.3.2.5.1.7-.1l1-1.1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.3.6.4 0 .2 0 .8-.4 1.3Z" />
              </svg>
              Chat on WhatsApp
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-[#2AABEE] px-8 py-4 text-base font-bold text-white transition hover:bg-[#1E96D6]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.9 6.9-1.7 8c-.1.6-.5.7-.9.4l-2.6-1.9-1.2 1.2c-.2.2-.3.3-.5.3l.2-2.6 4.8-4.3c.2-.2 0-.3-.3-.1l-5.9 3.7-2.5-.8c-.6-.2-.6-.6.1-.8l9.8-3.8c.5-.2.9.1.7.7Z" />
              </svg>
              Open in Telegram
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-10">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-mono text-3xl font-semibold text-spark">{s.value}</p>
                <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.25em] text-mist-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:pl-10">
          <PhoneMockup />
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-5 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="panel p-6 transition hover:border-spark/40">
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-3 text-lg font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-300">{f.body}</p>
          </div>
        ))}
      </section>

      {/* Lead capture */}
      <section className="mb-20 grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Talk to a real <span className="text-spark">CA</span>, not a chatbot script.
          </h2>
          <p className="mt-3 max-w-md text-mist-300">
            Leave your number and Pratik&apos;s team will call you back — or skip the queue and
            message us right now on{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold text-[#25D366] underline-offset-2 hover:underline">
              WhatsApp +91 62052 47092
            </a>
            .
          </p>
        </div>
        <LeadForm />
      </section>

      {/* Trust band */}
      <section
        id="about"
        className="panel mb-20 flex flex-col items-center gap-6 p-10 text-center md:flex-row md:justify-between md:text-left"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Building Financial Freedom</h2>
          <p className="mt-2 max-w-xl text-sm text-mist-300">
            Built by a Chartered Accountant, NISM-certified Research Analyst &amp;
            NISM-certified Mutual Fund Distributor. Education-first,
            compliance-aware, and always in your corner.
          </p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-full bg-[#16A34A] px-7 py-3 font-bold text-white transition hover:bg-[#15803D]"
        >
          Start planning now → WhatsApp
        </a>
      </section>

      {/* Footer / compliance */}
      <footer className="border-t border-ink-700/60 py-10 text-xs leading-relaxed text-mist-500">
        <p className="mb-2 font-semibold text-mist-400">Important disclosures</p>
        <p>
          Findost is an educational and financial-planning technology platform run by a
          Chartered Accountant who is a NISM-certified Research Analyst and
          NISM-certified Mutual Fund Distributor. Mutual fund and securities
          investments are subject to market risks; read all scheme-related documents
          carefully. Past performance is not indicative of future returns. Content on
          this platform is educational in nature and does not constitute investment
          advice or a solicitation to buy or sell securities. Mutual fund distribution
          services, where offered, are provided in partnership with Wealthy.in under
          applicable AMFI registration and NISM certifications.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} Findost · wealthy.findost.io · Your Wealth.
          Intelligent. Personal. Always.
        </p>
      </footer>

      <PaisaGuruLauncher />
    </main>
  );
}
