import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema, SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Findost — AI Wealth Companion for India | PaisaGuru",
    template: "%s | Findost",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AI financial advisor India",
    "PaisaGuru",
    "mutual fund distributor",
    "term insurance calculator India",
    "health insurance advisor",
    "SIP calculator",
    "tax planning India",
    "NISM research analyst",
    "wealth management India",
    "personal finance assistant Hindi",
  ],
  authors: [{ name: "Pratik Bajoria" }],
  creator: "Pratik Bajoria",
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  category: "finance",
  icons: { icon: "/findost-mark.svg" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `Findost — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    // og:image is provided dynamically by app/opengraph-image.tsx (and per-post variants)
  },
  twitter: {
    card: "summary_large_image",
    title: `Findost — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${plex.variable} ${plexMono.variable} ${fraunces.variable}`}>
      <body className="font-sans">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
