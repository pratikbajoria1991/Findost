import { ImageResponse } from "next/og";
import { getPost } from "@/lib/blog";

export const alt = "Findost blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-post OG/social card with the article title — great for link previews
 *  on WhatsApp, Telegram, X, LinkedIn and search/answer-engine result cards. */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title ?? "The Findost Blog";
  const date = post?.date ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #060B18 0%, #0D1830 60%, #13203D 100%)",
          color: "#EAF1FB",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "#2D9CFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 800,
              color: "#04070F",
            }}
          >
            F
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 8 }}>FINDOST</div>
          <div style={{ fontSize: 24, color: "#64789A", marginLeft: 8 }}>· Blog</div>
        </div>

        <div
          style={{
            fontSize: title.length > 60 ? 58 : 70,
            fontWeight: 800,
            lineHeight: 1.08,
            maxWidth: 1050,
            display: "flex",
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#64789A" }}>
          <span>findost.io/blog{date ? ` · ${date}` : ""}</span>
          <span>Plain-language money guidance</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
