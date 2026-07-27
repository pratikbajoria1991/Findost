import { ImageResponse } from "next/og";

export const alt = "Findost — AI Wealth Companion for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default site OG/social card — dynamically rendered, on-brand. */
export default function Image() {
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
          background: "linear-gradient(135deg, #060B18 0%, #0D1830 55%, #13203D 100%)",
          color: "#EAF1FB",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#2D9CFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              color: "#04070F",
            }}
          >
            F
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 10 }}>FINDOST</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            Intelligent Wealth.
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#6FBCFF" }}>
            Real Freedom.
          </div>
          <div style={{ marginTop: 26, fontSize: 30, color: "#A9BEDD", maxWidth: 900 }}>
            A 24×7 AI wealth companion for Indian investors — mutual funds, insurance, tax and
            goal planning in 11 languages.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#64789A" }}>
          <span>findost.io</span>
          <span>Ask PaisaGuru · NISM-certified</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
