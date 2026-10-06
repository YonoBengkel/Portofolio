import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { Pointer } from "@/components/pointer";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Three faces with three jobs. Instrument Serif is a single-weight display serif: narrow,
// slightly condensed, more film title than fashion masthead. It has one weight on purpose,
// so size and spacing have to do the work instead of boldness. Archivo is a plain grotesque
// that stays legible light-on-dark. IBM Plex Mono carries metadata only.
const instrument = Instrument_Serif({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
      className={`${instrument.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
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
        {/* Fog: the top and bottom edges of the window sink back into the page colour. */}
        <div className="fog" aria-hidden="true" />
        {/* One static grain plate, never animated. */}
        <svg className="grain" aria-hidden="true" focusable="false">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </body>
    </html>
  );
}
