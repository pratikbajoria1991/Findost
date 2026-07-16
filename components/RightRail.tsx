"use client";

import { allocation, marketSnapshot, stocks, totals } from "@/lib/demo-data";
import { formatINRCompact, formatPct } from "@/lib/format";

export default function RightRail() {
  const t = totals();
  const alloc = allocation();
  const movers = [...stocks]
    .filter((s) => s.dayChangePct !== undefined)
    .sort((a, b) => Math.abs(b.dayChangePct!) - Math.abs(a.dayChangePct!))
    .slice(0, 3);

  return (
    <aside className="hidden w-80 shrink-0 space-y-4 overflow-y-auto border-l border-ink-700/60 p-4 xl:block">
      {/* Net worth */}
      <div className="panel p-5">
        <p className="text-xs uppercase tracking-wide text-mist-500">Net worth</p>
        <p className="mt-1 text-3xl font-bold text-white">{formatINRCompact(t.current)}</p>
        <p className="mt-1 text-sm text-gain">
          {formatINRCompact(t.gain)} all-time ({formatPct(((t.current - t.invested) / t.invested) * 100)})
        </p>
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full">
          {alloc.map((a) => (
            <div
              key={a.key}
              style={{ width: `${(a.value / t.current) * 100}%`, backgroundColor: a.color }}
            />
          ))}
        </div>
        <div className="mt-3 space-y-1.5">
          {alloc.map((a) => (
            <div key={a.key} className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 text-mist-400">
                <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: a.color }} />
                {a.label}
              </span>
              <span className="font-mono text-mist-300">{formatINRCompact(a.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day movers */}
      <div className="panel p-5">
        <p className="mb-3 text-xs uppercase tracking-wide text-mist-500">Today&apos;s movers</p>
        <div className="space-y-2.5">
          {movers.map((s) => (
            <div key={s.ticker} className="flex items-center justify-between text-sm">
              <span className="font-medium text-mist-200">{s.ticker}</span>
              <span className={`font-mono ${s.dayChangePct! >= 0 ? "text-gain" : "text-loss"}`}>
                {formatPct(s.dayChangePct!)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Market pulse */}
      <div className="panel p-5">
        <p className="mb-3 text-xs uppercase tracking-wide text-mist-500">Market pulse</p>
        <div className="space-y-2.5">
          {marketSnapshot.indices.slice(0, 3).map((ix) => (
            <div key={ix.name} className="flex items-center justify-between text-sm">
              <span className="text-mist-300">{ix.name}</span>
              <span className="font-mono text-mist-200">
                {ix.level}{" "}
                <span className={ix.changePct >= 0 ? "text-gain" : "text-loss"}>{formatPct(ix.changePct)}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[0.65rem] text-mist-500">Indicative demo levels — not live quotes.</p>
      </div>

      {/* Tax nudge */}
      <div className="panel border-gold/30 p-5">
        <p className="text-xs uppercase tracking-wide text-gold">Concierge nudge</p>
        <p className="mt-2 text-sm leading-relaxed text-mist-300">
          You have <strong className="text-white">₹40,000 of 80C headroom</strong> left this FY. Topping up PPF
          before 31 March saves up to ₹12,480 in tax (old regime, 31.2% slab).
        </p>
      </div>
    </aside>
  );
}
