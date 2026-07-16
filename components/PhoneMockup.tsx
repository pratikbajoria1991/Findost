import Image from "next/image";

/**
 * Hero phone mockup — PaisaGuru WhatsApp-style conversation, matching the
 * "Concierge" variation of the Findost design system.
 */
export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[320px] sm:w-[340px]">
      {/* Live advisor floating chip */}
      <div className="absolute -left-28 top-16 z-20 hidden w-56 rounded-2xl border border-ink-600/60 bg-ink-850/95 p-4 shadow-card backdrop-blur lg:block">
        <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gain">
          <span className="h-2 w-2 rounded-full bg-gain" /> Live Advisor
        </p>
        <p className="mt-2 text-sm leading-snug text-mist-200">
          Pratik typically replies within <strong className="text-spark-soft">4 minutes</strong>
        </p>
      </div>

      {/* SIP confirmed floating card */}
      <div className="absolute -right-16 bottom-24 z-20 hidden w-52 rounded-2xl border border-ink-600/60 bg-ink-850/95 p-4 shadow-card backdrop-blur md:block">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gain">SIP Confirmed</p>
        <p className="mt-1.5 text-xl font-bold text-white">₹12,000 / month</p>
        <p className="text-xs text-mist-400">Mirae Asset Large Cap</p>
        <p className="mt-2 border-t border-ink-700/60 pt-2 text-xs text-mist-500">
          Next debit <span className="text-mist-300">01 May</span>
        </p>
      </div>

      {/* Phone frame */}
      <div className="relative overflow-hidden rounded-[2.6rem] border border-ink-600/70 bg-ink-950 shadow-[0_30px_80px_-20px_rgba(2,8,23,0.9)]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pb-2 pt-4 text-[0.7rem] font-semibold text-mist-200">
          <span>9:41</span>
          <span className="flex items-center gap-1.5 text-mist-400">
            <span className="tracking-widest">••••</span> 5G <span>▮▮▮</span>
          </span>
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-ink-700/60 bg-ink-900 px-4 py-3">
          <div className="relative shrink-0">
            <Image src="/findost-avatar.png" alt="" width={36} height={36} className="rounded-full" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-900 bg-gain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">PaisaGuru by Findost</p>
            <p className="flex items-center gap-1.5 text-[0.7rem] text-gain">
              <span className="h-1.5 w-1.5 rounded-full bg-gain" /> online · NISM-certified
            </p>
          </div>
          <span className="text-mist-400">📞</span>
          <span className="text-mist-400">⋮</span>
        </div>

        {/* Conversation */}
        <div className="space-y-3 bg-ink-900/60 px-4 py-4 text-[0.8rem] leading-snug">
          <p className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.25em] text-mist-500">
            Today · 09:41
          </p>

          {/* incoming */}
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-ink-800 px-3.5 py-2.5 text-mist-100">
            Good morning Arjun 👋 Your portfolio is up <strong className="text-gain">+₹3,240</strong> this week.
            Want the breakdown?
            <span className="mt-1 block text-right text-[0.6rem] text-mist-500">9:41</span>
          </div>

          {/* outgoing */}
          <div className="ml-auto max-w-[60%] rounded-2xl rounded-tr-md bg-[#0E5E43] px-3.5 py-2.5 text-white">
            Yes please
            <span className="mt-1 block text-right text-[0.6rem] text-mist-300">9:42 ✓✓</span>
          </div>

          {/* weekly summary card */}
          <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-ink-800 px-3.5 py-3 text-mist-100">
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-mist-400">
              Weekly Summary · 24–30 Apr
            </p>
            <div className="mt-2 space-y-1.5 font-mono text-[0.74rem]">
              <p className="flex justify-between gap-3">
                <span className="text-mist-300">Mirae Large Cap</span>
                <span className="text-gain">+₹1,420 <span className="text-[0.65rem]">+1.8%</span></span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-mist-300">Axis Bluechip</span>
                <span className="text-gain">+₹980 <span className="text-[0.65rem]">+2.1%</span></span>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-mist-300">HDFC Mid-Cap</span>
                <span className="text-gain">+₹840 <span className="text-[0.65rem]">+3.4%</span></span>
              </p>
              <p className="flex justify-between gap-3 border-t border-ink-700/60 pt-1.5 font-semibold">
                <span className="text-white">Total</span>
                <span className="text-gain">+₹3,240</span>
              </p>
            </div>
            <span className="mt-1 block text-right text-[0.6rem] text-mist-500">9:41</span>
          </div>

          {/* SIP reminder */}
          <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-ink-800 px-3.5 py-2.5 text-mist-100">
            Heads up: your March SIP of <strong className="text-white">₹10,000</strong> auto-debits tomorrow ⏰
            <span className="mt-1 block text-right text-[0.6rem] text-mist-500">9:41</span>
          </div>

          {/* outgoing */}
          <div className="ml-auto max-w-[75%] rounded-2xl rounded-tr-md bg-[#0E5E43] px-3.5 py-2.5 text-white">
            Can I increase it to ₹12,000?
            <span className="mt-1 block text-right text-[0.6rem] text-mist-300">9:43 ✓✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}
