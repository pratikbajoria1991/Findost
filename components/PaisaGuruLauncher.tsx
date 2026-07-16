"use client";

import { useState } from "react";
import Image from "next/image";
import Chat from "./Chat";

const TELEGRAM_BOT_URL = "https://t.me/Findost_bot";

/**
 * Floating launchers (bottom-right): the PaisaGuru chat bubble plus a
 * Telegram button that opens the Findost Telegram bot.
 */
export default function PaisaGuruLauncher() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[600px] max-h-[calc(100dvh-7.5rem)] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-ink-600/70 bg-ink-900 shadow-[0_30px_80px_-20px_rgba(2,8,23,0.95)]">
          <div className="min-h-0 flex-1">
            <Chat />
          </div>
        </div>
      )}

      {/* Telegram bot — sits just above the chat bubble */}
      <a
        href={TELEGRAM_BOT_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Open Findost on Telegram"
        className="fixed bottom-[5.5rem] right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#2AABEE] shadow-card transition hover:scale-105 hover:bg-[#1E96D6]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white" aria-hidden>
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.9 6.9-1.7 8c-.1.6-.5.7-.9.4l-2.6-1.9-1.2 1.2c-.2.2-.3.3-.5.3l.2-2.6 4.8-4.3c.2-.2 0-.3-.3-.1l-5.9 3.7-2.5-.8c-.6-.2-.6-.6.1-.8l9.8-3.8c.5-.2.9.1.7.7Z" />
        </svg>
      </a>

      {/* PaisaGuru chat bubble */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setSeen(true);
        }}
        aria-label={open ? "Close PaisaGuru chat" : "Chat with PaisaGuru"}
        className="fixed bottom-5 right-5 z-50 rounded-full shadow-glow transition hover:scale-105"
      >
        <span className="relative block">
          <Image
            src="/findost-avatar.png"
            alt="PaisaGuru"
            width={60}
            height={60}
            className="rounded-full border-2 border-spark/50"
          />
          <span className="absolute -bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-gain" />
          {!seen && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-loss text-[0.65rem] font-bold text-white">
              1
            </span>
          )}
        </span>
      </button>
    </>
  );
}
