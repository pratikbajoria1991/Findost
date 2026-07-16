"use client";

import { allocation, fixedIncome, gold, mutualFunds, stocks, totals, type Holding } from "@/lib/demo-data";
import { formatINRCompact, formatPct } from "@/lib/format";

function gainPct(h: Holding) {
  return ((h.current - h.invested) / h.invested) * 100;
}

function HoldingsTable({ title, rows }: { title: string; rows: Holding[] }) {
  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-ink-700/60 px-5 py-3.5">
        <h3 className="font-semibold text-white">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-mist-500">
            <th className="px-5 py-2.5 font-medium">Holding</th>
            <th className="px-3 py-2.5 text-right font-medium">Invested</th>
            <th className="px-3 py-2.5 text-right font-medium">Current</th>
            <th className="px-5 py-2.5 text-right font-medium">Return</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((h) => {
            const g = gainPct(h);
            return (
              <tr key={h.name} className="border-t border-ink-700/40 hover:bg-ink-800/50">
                <td className="px-5 py-3">
                  <p className="font-medium text-mist-100">{h.name}</p>
                  <p className="text-xs text-mist-500">
                    {h.category}
                    {h.sipAmount ? ` · SIP ${formatINRCompact(h.sipAmount)}/mo` : ""}
                  </p>
                </td>
                <td className="px-3 py-3 text-right font-mono text-mist-300">{formatINRCompact(h.invested)}</td>
                <td className="px-3 py-3 text-right font-mono text-white">{formatINRCompact(h.current)}</td>
                <td className={`px-5 py-3 text-right font-mono ${g >= 0 ? "text-gain" : "text-loss"}`}>
                  {formatPct(g)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function PortfolioView() {
  const t = totals();
  const alloc = allocation();
  const totalPct = (((t.current - t.invested) / t.invested) * 100).toFixed(1);

  return (
    <div className="space-y-5 overflow-y-auto p-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Portfolio</h2>
          <p className="text-xs text-mist-500">Demo account · values are illustrative</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-mist-500">Net worth</p>
          <p className="mt-1 text-3xl font-bold text-white">{formatINRCompact(t.current)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-mist-500">Invested</p>
          <p className="mt-1 text-3xl font-bold text-mist-200">{formatINRCompact(t.invested)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs uppercase tracking-wide text-mist-500">Unrealised gain</p>
          <p className="mt-1 text-3xl font-bold text-gain">
            {formatINRCompact(t.gain)} <span className="text-base font-semibold">(+{totalPct}%)</span>
          </p>
        </div>
      </div>

      {/* Allocation */}
      <div className="panel p-5">
        <h3 className="mb-4 font-semibold text-white">Asset allocation</h3>
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {alloc.map((a) => (
            <div
              key={a.key}
              style={{ width: `${(a.value / t.current) * 100}%`, backgroundColor: a.color }}
              title={`${a.label}: ${formatINRCompact(a.value)}`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {alloc.map((a) => (
            <span key={a.key} className="inline-flex items-center gap-2 text-mist-300">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
              {a.label}
              <span className="font-mono text-mist-400">
                {((a.value / t.current) * 100).toFixed(1)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <HoldingsTable title="Mutual funds" rows={mutualFunds} />
      <HoldingsTable title="Direct equity" rows={stocks} />
      <div className="grid gap-5 lg:grid-cols-2">
        <HoldingsTable title="Fixed income & retirement" rows={fixedIncome} />
        <HoldingsTable title="Gold" rows={gold} />
      </div>
    </div>
  );
}
