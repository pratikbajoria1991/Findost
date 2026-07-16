"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

/**
 * Google sign-in / account chip for the landing nav.
 * When Google OAuth isn't configured yet, falls back to a guest link so the
 * site keeps working before credentials are added.
 */
export default function SessionChip({ configured }: { configured: boolean }) {
  const { data: session, status } = useSession();

  if (!configured) {
    return (
      <Link href="/concierge" className="hidden text-sm text-mist-300 transition hover:text-white sm:block">
        Sign in
      </Link>
    );
  }

  if (status === "loading") {
    return <span className="hidden h-9 w-20 animate-pulse rounded-full bg-ink-800 sm:block" />;
  }

  if (session?.user) {
    return (
      <span className="hidden items-center gap-2.5 sm:flex">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt=""
            width={30}
            height={30}
            className="rounded-full border border-ink-600"
            unoptimized
          />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-royal/40 text-xs font-bold text-white">
            {session.user.name?.[0] ?? "U"}
          </span>
        )}
        <span className="max-w-28 truncate text-sm text-mist-200">{session.user.name}</span>
        <button onClick={() => signOut()} className="text-xs text-mist-500 transition hover:text-white">
          Sign out
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/concierge" })}
      className="hidden items-center gap-2 rounded-full border border-ink-600/70 px-4 py-2 text-sm font-medium text-mist-200 transition hover:border-spark/50 hover:text-white sm:flex"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.2 3.5 2.7h.2c2.2-2 3.8-5 3.8-8.6Z" />
        <path fill="#34A853" d="M12 24c3.2 0 5.9-1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.1 0-5.8-2-6.7-4.9h-.2L1.4 17.4v.2C3.4 21.3 7.4 24 12 24Z" />
        <path fill="#FBBC05" d="M5.3 14.5c-.3-.7-.4-1.5-.4-2.5s.2-1.7.4-2.5v-.2L1.6 6.4h-.2C.5 8.1 0 10 0 12s.5 3.9 1.4 5.6l3.9-3.1Z" />
        <path fill="#EB4335" d="M12 4.6c2.2 0 3.7 1 4.6 1.8l3.3-3.3C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.4l3.9 3.1C6.2 6.6 8.9 4.6 12 4.6Z" />
      </svg>
      Sign in with Google
    </button>
  );
}
