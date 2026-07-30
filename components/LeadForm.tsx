"use client";

import { useState } from "react";

const CLIENT_TYPES = [
  "Business owner",
  "Salaried professional",
  "NRI",
  "Retired investor",
  "Student or early investor",
];

const SERVICE_NEEDS = [
  "Insurance & Wealth Intelligence check",
  "Mutual fund or SIP review",
  "Portfolio hygiene review",
  "Tax-aware planning discussion",
  "Stock or sector research learning",
];

/**
 * "Start a wealth check" intake — posts to /api/lead → Airtable CRM.
 * A 3-minute qualifying form: who you are, what you need, what decision
 * you're trying to make. Richer than a plain callback request so the team
 * can triage and route to the right advisor before the first call.
 */
export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [clientType, setClientType] = useState(CLIENT_TYPES[0]);
  const [serviceNeed, setServiceNeed] = useState(SERVICE_NEEDS[0]);
  const [mandate, setMandate] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          city,
          clientType,
          serviceNeed,
          mandate,
          source: "wealth-check",
          company: "",
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="panel flex items-center gap-4 p-8 text-left">
        <span className="text-3xl">✅</span>
        <div>
          <p className="font-semibold text-white">Thank you, {name.split(" ")[0]}!</p>
          <p className="text-sm text-mist-300">
            Pratik&apos;s team will reach out within one working day. Want answers right now? The
            concierge is online 24×7.
          </p>
        </div>
      </div>
    );
  }

  const fieldCls =
    "w-full rounded-xl border border-ink-600/60 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-mist-500 focus:border-spark/50 focus:outline-none";

  return (
    <form onSubmit={submit} className="panel p-8">
      <h2 className="text-2xl font-bold text-white">Start a 3-minute wealth check</h2>
      <p className="mt-1.5 text-sm text-mist-400">
        Submit your context — goal, risk, current exposure. A real CA-led team reviews it and follows up
        with a human-reviewed next step. Not a call centre.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full name" className={fieldCls} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} required type="tel" placeholder="Mobile number" className={fieldCls} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email (optional)" className={fieldCls} />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={fieldCls} />
        <select value={clientType} onChange={(e) => setClientType(e.target.value)} className={fieldCls}>
          {CLIENT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={serviceNeed} onChange={(e) => setServiceNeed(e.target.value)} className={fieldCls}>
          {SERVICE_NEEDS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <textarea
        value={mandate}
        onChange={(e) => setMandate(e.target.value)}
        placeholder="What decision are you trying to make? e.g. I want to know whether my SIPs, emergency fund, insurance and tax planning are aligned for a 10-year goal."
        rows={3}
        className={`${fieldCls} mt-3 resize-none`}
      />
      {/* honeypot */}
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button
        type="submit"
        disabled={state === "busy"}
        className="mt-3 w-full rounded-xl bg-spark px-5 py-3 font-bold text-ink-950 shadow-glow transition hover:bg-spark-soft disabled:opacity-50"
      >
        {state === "busy" ? "Submitting…" : "Submit Wealth Check"}
      </button>
      {state === "error" && (
        <p className="mt-2 text-xs text-loss">Couldn&apos;t submit just now — please try WhatsApp instead.</p>
      )}
      <p className="mt-2 text-[0.68rem] leading-relaxed text-mist-500">
        This is an intake request, not a recommendation. Personalised advice requires risk profiling,
        suitability review and applicable regulatory compliance.
      </p>
    </form>
  );
}
