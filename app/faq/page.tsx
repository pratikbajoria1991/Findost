import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getFaqItems } from "@/lib/faq";
import { faqPageSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Personal finance FAQ — SIP, mutual funds, insurance & tax, answered simply",
  description:
    "Plain-language answers to India's most-asked money questions — SIPs, mutual funds, term & health insurance, LTCG tax, 80C, NPS, bonds and retirement — from Findost, built by a CA and NISM-certified advisor.",
  alternates: { canonical: `${SITE_URL}/faq` },
};

export const revalidate = 3600;

export default function FaqPage() {
  const items = getFaqItems();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20">
      <JsonLd data={faqPageSchema(items.map(({ q, a }) => ({ q, a })))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
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
          Personal finance, <span className="font-serif italic text-spark">answered simply</span>
        </h1>
        <p className="mt-3 text-mist-300">
          Straight answers to the money questions Indians actually ask — SIPs, mutual funds, term
          &amp; health insurance, tax, NPS, bonds and retirement. Written by a Chartered Accountant
          who is a NISM-certified Research Analyst &amp; Mutual Fund Distributor.
        </p>
      </header>

      <div className="mt-10 space-y-4">
        {items.map((it) => (
          <section key={it.slug} id={it.slug} className="panel scroll-mt-20 p-6">
            <h2 className="text-lg font-semibold text-white">{it.q}</h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-mist-300">{it.a}</p>
          </section>
        ))}
      </div>

      <div className="panel mt-10 flex flex-col items-center gap-3 p-8 text-center">
        <h2 className="text-xl font-bold text-white">Have a question that&apos;s not here?</h2>
        <p className="text-sm text-mist-300">
          PaisaGuru answers any personal-finance question 24×7, in 11 Indian languages.
        </p>
        <Link href="/concierge" className="btn-primary mt-1">
          Ask PaisaGuru — free →
        </Link>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-mist-500">
        Educational content, not investment advice or a solicitation. Mutual fund and securities
        investments are subject to market risks.
      </p>
    </main>
  );
}
