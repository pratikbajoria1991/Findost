"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Chat from "./Chat";
import PortfolioView from "./PortfolioView";
import GoalsView from "./GoalsView";
import MarketsView from "./MarketsView";
import IntelligenceView from "./IntelligenceView";
import CalculatorSuite from "./CalculatorSuite";
import RightRail from "./RightRail";

type ViewKey = "concierge" | "portfolio" | "goals" | "markets" | "intelligence" | "calculators";

const NAV: { key: ViewKey; label: string; icon: string }[] = [
  { key: "concierge", label: "Concierge", icon: "🪶" },
  { key: "intelligence", label: "Intelligence", icon: "🛡️" },
  { key: "calculators", label: "Calculators", icon: "🧮" },
  { key: "portfolio", label: "Portfolio", icon: "📊" },
  { key: "goals", label: "Goals", icon: "🎯" },
  { key: "markets", label: "Markets", icon: "📈" },
];

const WHATSAPP_URL =
  "https://wa.me/916205247092?text=Hi%20Findost%2C%20I%20want%20to%20start%20planning%20my%20wealth";
const TELEGRAM_URL = "https://t.me/Findost_bot";

export default function ConciergeApp() {
  const [view, setView] = useState<ViewKey>("concierge");

  // Landing-page nav deep links: /concierge?view=portfolio|goals|markets
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("view");
    if (v === "portfolio" || v === "goals" || v === "markets" || v === "intelligence" || v === "calculators")
      setView(v);
  }, []);

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Sidebar */}
      <nav className="flex w-16 shrink-0 flex-col items-center border-r border-ink-700/60 bg-ink-900/70 py-4 md:w-56 md:items-stretch md:px-3">
        <Link href="/" className="mb-6 flex items-center gap-2.5 px-1.5 md:px-2">
          <Image src="/findost-logo-mark.png" alt="Findost" width={34} height={34} className="rounded-lg" />
          <span className="hidden text-lg font-bold md:inline">
            find<span className="text-spark">ost</span>
          </span>
        </Link>

        <div className="flex flex-1 flex-col gap-1.5">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                view === item.key
                  ? "bg-spark/15 text-spark-soft"
                  : "text-mist-400 hover:bg-ink-800 hover:text-mist-200"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1.5 border-t border-ink-700/60 pt-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-mist-400 transition hover:bg-ink-800 hover:text-mist-200"
          >
            <span className="text-lg">🟢</span>
            <span className="hidden md:inline">WhatsApp</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-mist-400 transition hover:bg-ink-800 hover:text-mist-200"
          >
            <span className="text-lg">✈️</span>
            <span className="hidden md:inline">Telegram</span>
          </a>
          <div className="mt-1 flex items-center gap-3 rounded-xl bg-ink-800/70 px-3 py-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-royal/40 text-xs font-bold text-white">
              G
            </span>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-mist-200">Guest Investor</p>
              <p className="text-[0.65rem] text-mist-500">Demo portfolio</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main view */}
      <main className="flex min-w-0 flex-1 flex-col">
        <h1 className="sr-only">PaisaGuru AI Wealth Desk for Indian Investors</h1>
        {view === "concierge" && <Chat />}
        {view === "intelligence" && <IntelligenceView />}
        {view === "calculators" && <CalculatorSuite />}
        {view === "portfolio" && <PortfolioView />}
        {view === "goals" && <GoalsView />}
        {view === "markets" && <MarketsView />}
      </main>

      <RightRail />
    </div>
  );
}
