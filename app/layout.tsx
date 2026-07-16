import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://wealthy.findost.io"),
  title: "Findost — Your AI-Powered Wealth Companion",
  description:
    "Intelligent Wealth. Real Freedom. A 24×7 personal finance concierge for Indian investors — portfolio insight, goal planning, tax intelligence.",
  icons: { icon: "/findost-mark.svg" },
  openGraph: {
    title: "Findost — Intelligent Wealth. Real Freedom.",
    description:
      "Your 24×7 AI wealth concierge: portfolio insight, goal planning and tax intelligence for Indian investors.",
    images: ["/findost-brand-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plex.variable} ${plexMono.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
