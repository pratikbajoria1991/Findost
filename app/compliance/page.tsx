import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Compliance — how Findost keeps AI advice safe",
  description:
    "Findost's AI assistant educates and prepares context; it never gives personalised buy/sell, allocation or tax advice — those are always escalated to a human, NISM-certified advisor before any action.",
  alternates: { canonical: `${SITE_URL}/compliance` },
};

const ALLOWED = [
  "General financial education and definitions",
  "Calculator framing and illustrative scenarios",
  "Service discovery and onboarding questions",
  "Broad market context and commentary",
];

const ESCALATED = [
  "Portfolio allocation and scheme selection",
  "Buy / sell / hold decisions and target prices",
  "Personal tax position and filing decisions",
  "Legal interpretation and document review",
];

export default function CompliancePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compliance", path: "/compliance" },
        ])}
      />

      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/findost-logo-mark.png" alt="Findost" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold tracking-[0.35em] text-white">FINDOST</span>
        </Link>
        <Link href="/concierge" className="chip hover:border-spark/50">
          🪶 Ask PaisaGuru
        </Link>
      </nav>

      <header className="mt-4">
        <h1 className="text-4xl font-bold leading-tight text-white">
          Built around <span className="font-serif italic text-spark">advisory-safe</span> escalation
        </h1>
        <p className="mt-3 text-mist-300">
          Findost should win on trust. PaisaGuru educates, collects context, and prepares clean notes —
          it escalates sensitive matters to a human advisor before any personal action is suggested.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-semibold text-white">✅ Allowed in AI chat</h2>
          <ul className="mt-3 space-y-2 text-sm text-mist-300">
            {ALLOWED.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-gain">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-6">
          <h2 className="font-semibold text-white">🧑‍💼 Escalated to a human advisor</h2>
          <ul className="mt-3 space-y-2 text-sm text-mist-300">
            {ESCALATED.map((e) => (
              <li key={e} className="flex gap-2">
                <span className="text-gold">•</span>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel mt-6 p-6">
        <h2 className="font-semibold text-white">Who&apos;s behind Findost</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist-300">
          Findost is built and reviewed by a Chartered Accountant who is a NISM-certified Research Analyst
          and NISM-certified Mutual Fund Distributor. Mutual fund and insurance distribution is offered in
          partnership with Wealthy.in under applicable AMFI/NISM/IRDAI certifications. The Insurance &amp;
          Wealth Intelligence tool and calculators on this site produce illustrative, assumed-return
          estimates — they are not personalised recommendations.
        </p>
      </div>

      <div className="panel mt-6 border-gold/30 p-6">
        <h2 className="font-semibold text-white">Regulatory disclosures</h2>
        <p className="mt-2 text-sm leading-relaxed text-mist-300">
          Public communication on this site, WhatsApp, Telegram and social channels is educational and
          informational, not investment advice or a solicitation. Mutual fund and securities investments
          are subject to market risks — please read all scheme-related documents carefully before investing.
          Past performance is not indicative of future returns. Insurance is the subject matter of the
          solicitation; please read the policy wording carefully before concluding a sale.
        </p>
      </div>

      <div className="panel mt-10 flex flex-col items-center gap-3 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Want a human-reviewed plan?</h2>
        <p className="text-sm text-mist-300">
          Start with PaisaGuru, then request a callback — a real advisor picks it up from there.
        </p>
        <Link href="/concierge" className="btn-primary mt-1">
          Ask PaisaGuru — free →
        </Link>
      </div>
    </main>
  );
}
