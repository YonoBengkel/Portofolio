import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Newsreader } from "next/font/google";
import { Pointer } from "@/components/pointer";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Three faces with three jobs. Newsreader replaced Instrument Serif after measuring both
// at the hero's size: the stems came out 9.0px against 6.0px, so Instrument Serif is a
// third thinner and loses that much more of itself to a near-black page. Their hairlines
// are identical at 3.0px, so the old reason - "the hairlines vanish" - was wrong; it is
// the stems. Newsreader also reads as something printed, which suits a site whose job is
// handing over evidence. Archivo is a plain grotesque that stays legible light-on-dark.
// IBM Plex Mono carries metadata only.
// Loaded as a variable font, which is what lets the optical-size axis through; the weight
// it is actually set at lives in .display.
const newsreader = Newsreader({
  variable: "--font-display-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], style: ["normal"], display: "swap" });
// Metadata only, so it never blocks the first screen.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name}: Business Process, Data & Applied AI`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  authors: [{ name: profile.name }],
  openGraph: {
    type: "website",
    title: `${profile.name}: Business Process, Data & Applied AI`,
    description: profile.tagline,
    siteName: profile.name,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${newsreader.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-brass focus:px-4 focus:py-3 focus:font-bold focus:text-on-brass"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

        <RevealOnScroll />
        {/* The cursor: a pool of light, a trailing ring and an exact dot. */}
        <Pointer />
        {/* The warm seam where the doors meet during a page change. */}
        <div className="shutter-seam" aria-hidden="true" />
        {/* The back wall. Everything else in the page stands in front of it. */}
        <div className="room" aria-hidden="true" />
        {/* Fog: the top and bottom edges of the window sink back into the page colour. */}
        <div className="fog" aria-hidden="true" />
        {/* One static grain plate, never animated. */}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
