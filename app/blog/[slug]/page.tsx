import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/blog";
import { Markdown } from "@/components/Markdown";
import JsonLd from "@/components/JsonLd";
import { articleSchema, breadcrumbSchema, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Findost Blog" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: ["Pratik Bajoria"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-20">
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <nav className="flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/findost-logo-mark.png" alt="Findost" width={36} height={36} className="rounded-xl" />
          <span className="text-lg font-bold tracking-[0.35em] text-white">FINDOST</span>
        </Link>
        <Link href="/blog" className="chip hover:border-spark/50">
          ← All posts
        </Link>
      </nav>

      <article className="mt-6">
        <p className="text-xs text-mist-500">{post.date}</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight text-white">{post.title}</h1>
        <div className="panel mt-8 p-8 text-mist-200">
          <Markdown text={post.body} />
        </div>
        <p className="mt-6 text-xs leading-relaxed text-mist-500">
          Educational content from the Findost desk — not investment advice or a solicitation.
          Investments are subject to market risks. Questions?{" "}
          <Link href="/concierge" className="text-spark-soft hover:underline">
            Ask PaisaGuru
          </Link>{" "}
          or WhatsApp <a href="https://wa.me/916205247092" className="text-spark-soft hover:underline">+91 62052 47092</a>.
        </p>
      </article>
    </main>
  );
}
