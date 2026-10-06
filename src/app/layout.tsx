import type { Metadata } from "next";
import { Archivo, Bodoni_Moda, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Three faces with three jobs. Bodoni Moda is a high-contrast didone: at display size its
// hairlines nearly disappear into a dark page, which is the point. Archivo is a plain
// grotesque that stays legible light-on-dark. IBM Plex Mono carries metadata only.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

// Reads the stored Plain mode choice before the first paint, so the page never flashes
// out of atmosphere into plain and back.
const plainModeBoot = `try{if(localStorage.getItem("plain-mode")==="on"){document.documentElement.dataset.plain="on"}}catch(e){}`;

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
      className={`${bodoni.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: plainModeBoot }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-raincoat focus:px-4 focus:py-3 focus:font-bold focus:text-on-raincoat"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />

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
