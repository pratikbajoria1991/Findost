import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getDailyInsight, getPosts } from "@/lib/blog";
import { Markdown } from "@/components/Markdown";

export const metadata: Metadata = {
  title: "Blog — Findost",
  description: "Daily wealth insights in plain language, from the Findost desk.",
};

export const revalidate = 3600; // refresh hourly so the daily insight rolls over

export default function BlogPage() {
  const posts = getPosts();
  const daily = getDailyInsight();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20">
      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/findost-logo-mark.png" alt="Findost" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold tracking-[0.35em] text-white">FINDOST</span>
        </Link>
        <Link href="/concierge" className="chip hover:border-spark/50">
          🪶 Ask PaisaGuru
        </Link>
      </nav>

      <h1 className="mt-6 text-4xl font-bold text-white">
        The Findost <span className="font-serif italic text-spark">Blog</span>
      </h1>
      <p className="mt-2 text-mist-400">
        Money, explained like a friend would — fresh every day.
      </p>

      {daily && (
        <article className="panel mt-8 border-spark/30 p-7">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-spark-soft">
            ★ Today&apos;s insight · {daily.date}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">{daily.title}</h2>
          <div className="mt-4 text-mist-200">
            <Markdown text={daily.body} />
          </div>
          <p className="mt-5 text-xs text-mist-500">
            Auto-published daily from the Findost training desk. Educational, not investment advice.
          </p>
        </article>
      )}

      <div className="mt-10 space-y-5">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="panel block p-6 transition hover:border-spark/40"
          >
            <p className="text-xs text-mist-500">{p.date}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{p.title}</h3>
            <p className="mt-1.5 text-sm text-mist-300">{p.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
