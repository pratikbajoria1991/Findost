"use client";

import { useState } from "react";
import { formatINRCompact } from "@/lib/format";
import {
  recommendInsurance,
  recommendWealth,
  type InsuranceInputs,
  type WealthInputs,
  type Risk,
} from "@/lib/intelligence";

const WHATSAPP =
  "https://wa.me/916205247092?text=Hi%20Findost%2C%20I%20want%20help%20with%20my%20insurance%20and%20investment%20plan";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-mist-300">{label}</span>
      {hint && <span className="ml-1 text-xs text-mist-500">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border border-ink-600/60 bg-ink-800/70 px-3.5 py-2.5 text-sm text-white placeholder:text-mist-500 focus:border-spark/50 focus:outline-none";

// ── Insurance tab ─────────────────────────────────────────────────────────

function InsuranceTab() {
  const [f, setF] = useState<InsuranceInputs>({
    age: 32,
    gender: "male",
    smoker: false,
    annualIncome: 18_00_000,
    dependents: 2,
    outstandingLoans: 40_00_000,
    existingLifeCover: 50_00_000,
    existingHealthCover: 5_00_000,
    cityTier: 1,
    familyMembers: 4,
    eldestMemberAge: 62,
  });
  const [res, setRes] = useState<ReturnType<typeof recommendInsurance> | null>(null);

  const set = <K extends keyof InsuranceInputs>(k: K, v: InsuranceInputs[K]) =>
    setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* form */}
      <div className="panel space-y-4 p-6">
        <p className="text-xs uppercase tracking-wide text-mist-500">Your details</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Age">
            <input type="number" className={inputCls} value={f.age} onChange={(e) => set("age", +e.target.value)} />
          </Field>
          <Field label="Gender">
            <select className={inputCls} value={f.gender} onChange={(e) => set("gender", e.target.value as "male" | "female")}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
        </div>
        <Field label="Annual income (₹)">
          <input type="number" step={100000} className={inputCls} value={f.annualIncome} onChange={(e) => set("annualIncome", +e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Outstanding loans (₹)">
            <input type="number" step={100000} className={inputCls} value={f.outstandingLoans} onChange={(e) => set("outstandingLoans", +e.target.value)} />
          </Field>
          <Field label="Dependents">
            <input type="number" className={inputCls} value={f.dependents} onChange={(e) => set("dependents", +e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Existing life cover (₹)">
            <input type="number" step={100000} className={inputCls} value={f.existingLifeCover} onChange={(e) => set("existingLifeCover", +e.target.value)} />
          </Field>
          <Field label="Existing health cover (₹)">
            <input type="number" step={100000} className={inputCls} value={f.existingHealthCover} onChange={(e) => set("existingHealthCover", +e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="City tier">
            <select className={inputCls} value={f.cityTier} onChange={(e) => set("cityTier", +e.target.value as 1 | 2 | 3)}>
              <option value={1}>Tier 1 (metro)</option>
              <option value={2}>Tier 2</option>
              <option value={3}>Tier 3</option>
            </select>
          </Field>
          <Field label="People to insure (health)">
            <input type="number" className={inputCls} value={f.familyMembers} onChange={(e) => set("familyMembers", +e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Eldest member age">
            <input type="number" className={inputCls} value={f.eldestMemberAge} onChange={(e) => set("eldestMemberAge", +e.target.value)} />
          </Field>
          <label className="flex items-end gap-2.5 pb-2.5 text-sm text-mist-300">
            <input type="checkbox" checked={f.smoker} onChange={(e) => set("smoker", e.target.checked)} className="h-4 w-4 accent-spark" />
            Smoker / tobacco
          </label>
        </div>
        <button onClick={() => setRes(recommendInsurance(f))} className="btn-primary w-full">
          Analyse my cover →
        </button>
      </div>

      {/* results */}
      <div className="space-y-5">
        {!res ? (
          <div className="panel flex h-full min-h-64 items-center justify-center p-6 text-center text-sm text-mist-400">
            Enter your details and tap <span className="mx-1 font-semibold text-spark-soft">Analyse my cover</span> to see the exact term + health cover you need.
          </div>
        ) : (
          <>
            {/* Term */}
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-mist-500">Term life — you need</p>
                <span className="chip">🛡️ Protection</span>
              </div>
              <p className="mt-1 text-3xl font-bold text-white">
                {formatINRCompact(res.term.coverGap > 0 ? res.term.coverGap : res.term.recommendedCover)}
                <span className="ml-2 text-base font-medium text-mist-400">more cover</span>
              </p>
              <p className="mt-1 text-sm text-mist-300">
                Indicative premium{" "}
                <span className="font-mono text-gain">
                  {formatINRCompact(res.term.indicativeAnnualPremium[0])}–{formatINRCompact(res.term.indicativeAnnualPremium[1])}/yr
                </span>{" "}
                · term {res.term.termYears} yrs
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-mist-300">
                {res.term.rationale.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-spark">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            {/* Health */}
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-mist-500">Health — you need</p>
                <span className="chip">🏥 Cover</span>
              </div>
              <p className="mt-1 text-3xl font-bold text-white">
                {formatINRCompact(res.health.recommendedCover)}
              </p>
              <p className="mt-1 text-sm text-mist-300">
                {formatINRCompact(res.health.baseCover)} base
                {res.health.superTopUp > 0 ? ` + ${formatINRCompact(res.health.superTopUp)} super top-up` : ""}
                {res.health.coverGap > 0 ? ` · gap ${formatINRCompact(res.health.coverGap)}` : " · you're covered"}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-mist-300">
                {res.health.rationale.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gain">•</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary w-full !bg-[#16A34A] hover:!bg-[#15803D]">
              Get these exact policies on WhatsApp →
            </a>
            <p className="text-center text-[0.68rem] text-mist-500">
              Indicative estimates using the standard needs-analysis method. Final premiums and terms depend on the insurer and medicals. Not insurance advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Wealth tab ────────────────────────────────────────────────────────────

function WealthTab() {
  const [f, setF] = useState<WealthInputs>({
    age: 32,
    monthlyInvestable: 45_000,
    monthlyExpenses: 90_000,
    risk: "moderate",
    goalName: "Retirement",
    goalTargetToday: 3_00_00_000,
    goalYears: 25,
    existingCorpus: 15_00_000,
  });
  const [res, setRes] = useState<ReturnType<typeof recommendWealth> | null>(null);
  const set = <K extends keyof WealthInputs>(k: K, v: WealthInputs[K]) => setF((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="panel space-y-4 p-6">
        <p className="text-xs uppercase tracking-wide text-mist-500">Your money</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Age">
            <input type="number" className={inputCls} value={f.age} onChange={(e) => set("age", +e.target.value)} />
          </Field>
          <Field label="Risk appetite">
            <select className={inputCls} value={f.risk} onChange={(e) => set("risk", e.target.value as Risk)}>
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Monthly investable (₹)">
            <input type="number" step={5000} className={inputCls} value={f.monthlyInvestable} onChange={(e) => set("monthlyInvestable", +e.target.value)} />
          </Field>
          <Field label="Monthly expenses (₹)">
            <input type="number" step={5000} className={inputCls} value={f.monthlyExpenses} onChange={(e) => set("monthlyExpenses", +e.target.value)} />
          </Field>
        </div>
        <Field label="Primary goal">
          <input className={inputCls} value={f.goalName} onChange={(e) => set("goalName", e.target.value)} placeholder="Retirement, child's education, home…" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Goal cost today (₹)">
            <input type="number" step={100000} className={inputCls} value={f.goalTargetToday} onChange={(e) => set("goalTargetToday", +e.target.value)} />
          </Field>
          <Field label="Years to goal">
            <input type="number" className={inputCls} value={f.goalYears} onChange={(e) => set("goalYears", +e.target.value)} />
          </Field>
        </div>
        <Field label="Existing corpus (₹)">
          <input type="number" step={100000} className={inputCls} value={f.existingCorpus} onChange={(e) => set("existingCorpus", +e.target.value)} />
        </Field>
        <button onClick={() => setRes(recommendWealth(f))} className="btn-primary w-full">
          Build my plan →
        </button>
      </div>

      <div className="space-y-5">
        {!res ? (
          <div className="panel flex h-full min-h-64 items-center justify-center p-6 text-center text-sm text-mist-400">
            Enter your details and tap <span className="mx-1 font-semibold text-spark-soft">Build my plan</span> for your allocation, product mix and the exact SIP for your goal.
          </div>
        ) : (
          <>
            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wide text-mist-500">Recommended allocation</p>
              <div className="mt-3 flex h-4 w-full overflow-hidden rounded-full">
                {res.allocation.map((a) => (
                  <div key={a.label} style={{ width: `${a.pct}%`, backgroundColor: a.color }} title={`${a.label} ${a.pct}%`} />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
                {res.allocation.map((a) => (
                  <span key={a.label} className="inline-flex items-center gap-2 text-mist-300">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
                    {a.label} <span className="font-mono text-mist-400">{a.pct}%</span>
                    <span className="text-mist-500">· {a.note}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wide text-mist-500">{f.goalName} in {f.goalYears} yrs</p>
              <p className="mt-1 text-sm text-mist-300">
                Inflated cost: <span className="font-mono text-white">{formatINRCompact(res.goal.futureCost)}</span>
              </p>
              <div className="mt-3 rounded-2xl border border-spark/30 bg-spark/10 p-4">
                <p className="text-xs uppercase tracking-wide text-spark-soft">Monthly SIP needed</p>
                <p className="mt-1 text-3xl font-bold text-spark-soft">{formatINRCompact(res.goal.sipNeeded)}</p>
              </div>
              <p className={`mt-3 text-sm ${res.goal.onTrack ? "text-gain" : "text-gold"}`}>
                {res.goal.onTrack
                  ? `✅ Your ${formatINRCompact(f.monthlyInvestable)}/mo is on track — projected ${formatINRCompact(res.goal.yourSipGrows)}.`
                  : `⚠️ Your ${formatINRCompact(f.monthlyInvestable)}/mo falls short — step up by about ${formatINRCompact(res.goal.shortfallSip)}/mo, or increase SIPs 10% a year.`}
              </p>
            </div>

            <div className="panel p-6">
              <p className="text-xs uppercase tracking-wide text-mist-500">Your product mix</p>
              <ul className="mt-3 space-y-2 text-sm text-mist-300">
                {res.productMix.map((p, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-spark">•</span>
                    {p}
                  </li>
                ))}
              </ul>
              {res.premiumNudge && (
                <p className="mt-3 rounded-xl border border-gold/30 bg-gold/5 p-3 text-xs leading-relaxed text-mist-300">
                  {res.premiumNudge}
                </p>
              )}
            </div>

            <a href={WHATSAPP} target="_blank" rel="noreferrer" className="btn-primary w-full !bg-[#16A34A] hover:!bg-[#15803D]">
              Start this plan with Findost →
            </a>
            <p className="text-center text-[0.68rem] text-mist-500">
              Illustrative, assumed returns — not a guarantee. Educational guidance, not investment advice. Investments are subject to market risks.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────

export default function IntelligenceView() {
  const [tab, setTab] = useState<"insurance" | "wealth">("insurance");

  return (
    <div className="space-y-5 overflow-y-auto p-5">
      <div>
        <h2 className="text-xl font-bold text-white">Intelligence</h2>
        <p className="text-xs text-mist-500">Give us your data — get the right product. Education-first, India-specific.</p>
      </div>

      <div className="inline-flex rounded-xl border border-ink-600/60 bg-ink-800/60 p-1">
        <button
          onClick={() => setTab("insurance")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "insurance" ? "bg-spark/20 text-spark-soft" : "text-mist-400 hover:text-mist-200"}`}
        >
          🛡️ Insurance
        </button>
        <button
          onClick={() => setTab("wealth")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${tab === "wealth" ? "bg-spark/20 text-spark-soft" : "text-mist-400 hover:text-mist-200"}`}
        >
          📈 Wealth
        </button>
      </div>

      {tab === "insurance" ? <InsuranceTab /> : <WealthTab />}
    </div>
  );
}
