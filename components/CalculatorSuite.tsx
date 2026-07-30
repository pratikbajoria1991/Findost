"use client";

import { useMemo, useState } from "react";
import { CALCULATORS, type CalculatorConfig } from "@/lib/wealthdesk-calculators";
import { formatINRCompact } from "@/lib/format";

function useCalculatorState(calc: CalculatorConfig) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(calc.fields.map((f) => [f.key, f.default])),
  );
  const result = useMemo(() => calc.calculate(values), [calc, values]);
  const set = (key: string, v: number) => setValues((p) => ({ ...p, [key]: v }));
  return { values, set, result };
}

function CalculatorCard({ calc }: { calc: CalculatorConfig }) {
  const { values, set, result } = useCalculatorState(calc);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel space-y-5 p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-mist-500">{calc.kicker}</p>
          <h3 className="mt-1 text-lg font-semibold text-white">{calc.title}</h3>
        </div>
        {calc.fields.map((f) => (
          <div key={f.key}>
            <div className="flex justify-between text-sm">
              <label className="text-mist-300">{f.label}</label>
              <span className="font-mono text-white">
                {f.label.toLowerCase().includes("%") || f.label.includes("(%)")
                  ? `${values[f.key]}%`
                  : f.key === "frequency" || f.key === "years" || f.label.toLowerCase().includes("year")
                    ? values[f.key]
                    : formatINRCompact(values[f.key])}
              </span>
            </div>
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={values[f.key]}
              onChange={(e) => set(f.key, +e.target.value)}
              className="mt-2 w-full accent-spark"
            />
          </div>
        ))}
      </div>

      <div className="panel flex flex-col justify-center gap-5 p-6">
        <div className="rounded-2xl border border-spark/30 bg-spark/10 p-5">
          <p className="text-xs uppercase tracking-wide text-spark-soft">{result.headlineLabel}</p>
          <p className="mt-1 text-3xl font-bold text-spark-soft">{formatINRCompact(result.headline)}</p>
        </div>
        <div className="space-y-2.5">
          {result.rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <span className="text-mist-400">{r.label}</span>
              <span className="font-mono text-mist-200">
                {r.value > 1000 || r.value < -1000 ? formatINRCompact(r.value) : r.value.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-mist-500">
          Illustrative, assumed returns — not a guarantee. Educational guidance, not investment or tax advice.
        </p>
      </div>
    </div>
  );
}

export default function CalculatorSuite() {
  const [active, setActive] = useState(CALCULATORS[0].key);
  const calc = CALCULATORS.find((c) => c.key === active)!;

  return (
    <div className="space-y-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-xl font-bold text-white">Calculators</h2>
        <p className="text-xs text-mist-500">
          SIP, Lumpsum, FD, EMI, Tax, Retirement, Goal, PPF, NPS — the full Wealth Desk toolkit.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {CALCULATORS.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`rounded-xl border px-3.5 py-2 text-sm font-medium transition ${
              active === c.key
                ? "border-spark/50 bg-spark/15 text-spark-soft"
                : "border-ink-600/60 bg-ink-800/60 text-mist-400 hover:text-mist-200"
            }`}
          >
            {c.kicker.replace(" calculator", "")}
          </button>
        ))}
      </div>

      <CalculatorCard calc={calc} />
    </div>
  );
}
