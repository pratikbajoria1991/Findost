"use client";

import { marketSnapshot } from "@/lib/demo-data";
import { formatPct } from "@/lib/format";

export default function MarketsView() {
  return (
    <div className="space-y-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-xl font-bold text-white">Markets</h2>
        <p className="text-xs text-mist-500">{marketSnapshot.asOf}</p>
      </div>

      {/* Indices */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {marketSnapshot.indices.map((ix) => (
          <div key={ix.name} className="panel p-4">
            <p className="text-xs uppercase tracking-wide text-mist-500">{ix.name}</p>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-xl font-bold text-white">{ix.level}</p>
              <p className={`font-mono text-sm ${ix.changePct >= 0 ? "text-gain" : "text-loss"}`}>
                {formatPct(ix.changePct)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Watchlist */}
        <div className="panel overflow-hidden">
          <div className="border-b border-ink-700/60 px-5 py-3.5">
            <h3 className="font-semibold text-white">Watchlist</h3>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {marketSnapshot.watchlist.map((w) => (
                <tr key={w.ticker} className="border-t border-ink-700/40 first:border-t-0 hover:bg-ink-800/50">
                  <td className="px-5 py-3 font-semibold text-mist-100">{w.ticker}</td>
                  <td className="px-3 py-3 text-right font-mono text-white">{w.price}</td>
                  <td
                    className={`px-5 py-3 text-right font-mono ${w.changePct >= 0 ? "text-gain" : "text-loss"}`}
                  >
                    {formatPct(w.changePct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Research note */}
        <div className="panel p-6">
          <h3 className="font-semibold text-white">Concierge view — staying disciplined</h3>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-mist-300">
            <p>
              Index levels near highs with a subdued VIX historically reward <strong className="text-white">process
              over prediction</strong>: continue SIPs, rebalance annually, and stagger any lumpsum via STP from a
              liquid fund over 3–6 months.
            </p>
            <p>
              Midcap breadth is strong; small-cap valuations remain rich relative to history — prefer flexi-cap
              routes for incremental allocation rather than chasing momentum.
            </p>
            <p className="text-xs text-mist-500">
              ⚠️ Educational market commentary by a NISM-certified Research Analyst — not a recommendation to buy
              or sell any security and not investment advice. Investments are subject to market risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
