"use client";

import { useMemo, useState } from "react";
import { presetGoals } from "@/lib/demo-data";
import { inflate, sipFutureValue, sipRequired } from "@/lib/calculators";
import { formatINRCompact } from "@/lib/format";

export default function GoalsView() {
  const [target, setTarget] = useState(1_00_00_000);
  const [years, setYears] = useState(15);
  const [returnPct, setReturnPct] = useState(12);
  const [inflationPct, setInflationPct] = useState(6);
  const [adjustInflation, setAdjustInflation] = useState(true);

  const result = useMemo(() => {
    const effectiveTarget = adjustInflation ? inflate(target, inflationPct, years) : target;
    const monthly = sipRequired(effectiveTarget, returnPct, years);
    const invested = monthly * years * 12;
    return { effectiveTarget, monthly, invested, wealth: effectiveTarget - invested };
  }, [target, years, returnPct, inflationPct, adjustInflation]);

  const current45k = useMemo(() => sipFutureValue(45_000, returnPct, years), [returnPct, years]);

  return (
    <div className="space-y-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-xl font-bold text-white">Goal planning</h2>
        <p className="text-xs text-mist-500">Inflation-adjusted SIP maths — illustrative, assumed returns</p>
      </div>

      {/* Preset goals */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {presetGoals.map((g) => (
          <button
            key={g.key}
            onClick={() => {
              setTarget(g.target);
              setYears(g.years);
            }}
            className="panel p-4 text-left transition hover:border-spark/50"
          >
            <span className="text-xl">{g.icon}</span>
            <p className="mt-2 text-sm font-semibold text-white">{g.label}</p>
            <p className="text-xs text-mist-400">
              {formatINRCompact(g.target)} · {g.years} yrs
            </p>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Inputs */}
        <div className="panel space-y-5 p-6">
          <div>
            <div className="flex justify-between text-sm">
              <label className="text-mist-300">Target (today&apos;s cost)</label>
              <span className="font-mono text-white">{formatINRCompact(target)}</span>
            </div>
            <input
              type="range"
              min={5_00_000}
              max={10_00_00_000}
              step={5_00_000}
              value={target}
              onChange={(e) => setTarget(+e.target.value)}
              className="mt-2 w-full accent-spark"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <label className="text-mist-300">Time horizon</label>
              <span className="font-mono text-white">{years} years</span>
            </div>
            <input
              type="range"
              min={1}
              max={35}
              value={years}
              onChange={(e) => setYears(+e.target.value)}
              className="mt-2 w-full accent-spark"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <label className="text-mist-300">Expected return (p.a.)</label>
              <span className="font-mono text-white">{returnPct}%</span>
            </div>
            <input
              type="range"
              min={5}
              max={16}
              step={0.5}
              value={returnPct}
              onChange={(e) => setReturnPct(+e.target.value)}
              className="mt-2 w-full accent-spark"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <label className="text-mist-300">Inflation (p.a.)</label>
              <span className="font-mono text-white">{inflationPct}%</span>
            </div>
            <input
              type="range"
              min={3}
              max={12}
              step={0.5}
              value={inflationPct}
              onChange={(e) => setInflationPct(+e.target.value)}
              className="mt-2 w-full accent-spark"
              disabled={!adjustInflation}
            />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-mist-300">
            <input
              type="checkbox"
              checked={adjustInflation}
              onChange={(e) => setAdjustInflation(e.target.checked)}
              className="h-4 w-4 accent-spark"
            />
            Adjust target for inflation (recommended)
          </label>
        </div>

        {/* Result */}
        <div className="panel flex flex-col justify-center gap-5 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-mist-500">
              {adjustInflation ? `Future cost after ${years} yrs of inflation` : "Target"}
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{formatINRCompact(result.effectiveTarget)}</p>
          </div>
          <div className="rounded-2xl border border-spark/30 bg-spark/10 p-5">
            <p className="text-xs uppercase tracking-wide text-spark-soft">Required monthly SIP</p>
            <p className="mt-1 text-4xl font-bold text-spark-soft">{formatINRCompact(result.monthly)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-mist-500">You invest</p>
              <p className="font-mono text-mist-200">{formatINRCompact(result.invested)}</p>
            </div>
            <div>
              <p className="text-mist-500">Wealth created</p>
              <p className="font-mono text-gain">{formatINRCompact(result.wealth)}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-mist-500">
            Your current ₹45,000/month SIP grows to{" "}
            <span className="text-mist-300">{formatINRCompact(current45k)}</span> over {years} years at{" "}
            {returnPct}%. Illustrative compounding, monthly rests; not a promise of returns.
          </p>
        </div>
      </div>
    </div>
  );
}
