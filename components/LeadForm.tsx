"use client";

import { useState } from "react";

/** Callback-request form — posts to /api/lead → Airtable CRM. */
export default function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "busy") return;
    setState("busy");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, company: "" }),
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

  return (
    <form onSubmit={submit} className="panel p-8">
      <h2 className="text-2xl font-bold text-white">Get a call back</h2>
      <p className="mt-1.5 text-sm text-mist-400">
        A real CA-led team, not a call centre. Free 15-minute portfolio chat.
      </p>
      <div className="mt-5 grid gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Your name"
          className="rounded-xl border border-ink-600/60 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-mist-500 focus:border-spark/50 focus:outline-none"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          type="tel"
          placeholder="Mobile number"
          className="rounded-xl border border-ink-600/60 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-mist-500 focus:border-spark/50 focus:outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email (optional)"
          className="rounded-xl border border-ink-600/60 bg-ink-800/70 px-4 py-3 text-sm text-white placeholder:text-mist-500 focus:border-spark/50 focus:outline-none"
        />
        {/* honeypot */}
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button
          type="submit"
          disabled={state === "busy"}
          className="rounded-xl bg-spark px-5 py-3 font-bold text-ink-950 shadow-glow transition hover:bg-spark-soft disabled:opacity-50"
        >
          {state === "busy" ? "Sending…" : "Request call back"}
        </button>
        {state === "error" && (
          <p className="text-xs text-loss">Couldn&apos;t submit just now — please try WhatsApp instead.</p>
        )}
        <p className="text-[0.68rem] leading-relaxed text-mist-500">
          By submitting you agree to be contacted about Findost services. We never share your data.
        </p>
      </div>
    </form>
  );
}
