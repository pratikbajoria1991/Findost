"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Markdown } from "./Markdown";
import { LANGS, UI, isLang, type Lang } from "@/lib/i18n";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: UI.en.greeting },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"trained" | "demo" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore preferred language.
  useEffect(() => {
    const saved = localStorage.getItem("findost-lang");
    if (isLang(saved) && saved !== "en") changeLang(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  function changeLang(next: Lang) {
    setLang(next);
    localStorage.setItem("findost-lang", next);
    // If the conversation hasn't started, re-greet in the new language.
    setMessages((cur) =>
      cur.length === 1 && cur[0].role === "assistant"
        ? [{ role: "assistant", content: UI[next].greeting }]
        : cur,
    );
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const history = [...messages, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // greeting is client-side flavour; don't send it as a real turn
        body: JSON.stringify({ messages: history.slice(1), lang }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const headerMode = res.headers.get("X-Findost-Mode");
      if (headerMode === "trained" || headerMode === "demo") setMode(headerMode);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((cur) => {
          const next = cur.slice();
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      }
    } catch {
      setMessages((cur) => {
        const next = cur.slice();
        next[next.length - 1] = {
          role: "assistant",
          content:
            "I couldn't reach PaisaGuru just now — please try again in a moment.",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-ink-700/60 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <Image src="/findost-avatar.png" alt="PaisaGuru" width={36} height={36} className="rounded-lg" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-850 bg-gain" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">PaisaGuru by Findost</p>
            <p className="flex items-center gap-1.5 truncate text-xs text-gain">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gain" />
              online · NISM-certified
              <span className="text-mist-500">
                {mode === "trained" ? "· training library" : mode === "demo" ? "· portfolio engine" : ""}
              </span>
            </p>
          </div>
        </div>
        <select
          value={lang}
          onChange={(e) => changeLang(e.target.value as Lang)}
          aria-label="Language"
          className="shrink-0 rounded-lg border border-ink-600/70 bg-ink-800 px-2 py-1.5 text-xs text-mist-200 focus:border-spark/60 focus:outline-none"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              dir="auto"
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-md bg-spark-dim/40 px-4 py-3 text-mist-100"
                  : "max-w-[85%] rounded-2xl rounded-bl-md border border-ink-600/50 bg-ink-800/80 px-4 py-3 text-mist-200"
              }
            >
              {m.content === "" && busy && i === messages.length - 1 ? (
                <span className="inline-flex gap-1.5 py-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-spark [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-spark [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-spark [animation-delay:240ms]" />
                </span>
              ) : (
                <Markdown text={m.content} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {UI[lang].prompts.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="chip transition hover:border-spark/60 hover:text-white"
              disabled={busy}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-ink-700/60 p-4"
      >
        <div className="flex items-end gap-3 rounded-2xl border border-ink-600/60 bg-ink-800/70 px-4 py-3 focus-within:border-spark/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            dir="auto"
            placeholder={UI[lang].placeholder}
            className="max-h-32 flex-1 resize-none bg-transparent text-[0.95rem] text-white placeholder:text-mist-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="rounded-xl bg-spark px-4 py-2 font-semibold text-ink-950 transition hover:bg-spark-soft disabled:opacity-40"
          >
            {UI[lang].send}
          </button>
        </div>
        <p className="mt-2 text-center text-[0.68rem] text-mist-500">{UI[lang].footer}</p>
      </form>
    </div>
  );
}
