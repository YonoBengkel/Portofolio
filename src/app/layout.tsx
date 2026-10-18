import type { Metadata } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import { Curtain } from "@/components/curtain";
import { Lightbox } from "@/components/lightbox";
import { RevealOnScroll } from "@/components/reveal-on-scroll";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

// Three faces, each measured off the references rather than chosen by taste. Anton is the
// display face on both sites Ilham picked; at 160px and above it is effectively the genre,
// and a lighter substitute would only make the page worse. Archivo carries the body,
// IBM Plex Mono the labels.
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${profile.name}: Business Process, Data & Applied AI`, template: `%s | ${profile.name}` },
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
      className={`${anton.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
      /*
        The script below writes data-intro here before React hydrates, which React then
        reports as a tree that "hydrated but some attributes didn't match". It is the
        expected shape of a pre-paint script and the warning is about this one attribute,
        not about the tree: without this the console carried a hydration error on every
        route, and the page check failed all eighteen of them.
      */
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        {/*
          Runs before the body paints, which is the only place this decision can be made
          without a flash: deciding it in an effect means the title sequence renders and
          then vanishes, which is worse than either showing it or not.

          It only ever takes the sequence away earlier than the CSS would. The sequence
          itself is keyframes with a forwards fill and ends on its own, so a failure here
          - a blocked script, a thrown error, storage refused in a private window - leaves
          a title sequence that still finishes and uncovers the page.

          The session flag is set on the way in rather than at the end, so a reload
          halfway through does not start it again.

          Nothing here listens for a click any more. It used to end on the first pointer,
          key or wheel event, which is the usual courtesy - but Ilham could not photograph
          it, because taking a screenshot ends it. ?intro replays it on demand instead,
          and that is what the skip was actually being used for.

          The only timer left removes the finished overlay from the layer at 3100ms; the
          CSS has already hidden it by then.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var d=document.documentElement;function off(){d.dataset.intro="off"}' +
              'function on(){d.dataset.intro="on";setTimeout(off,3100)}' +
              'if(location.search.indexOf("intro")>0){on();return}' +
              'if(location.pathname!=="/"){off();return}' +
              'try{if(sessionStorage.getItem("intro")){off();return}sessionStorage.setItem("intro","1")}catch(e){}' +
              'if(matchMedia("(prefers-reduced-motion: reduce)").matches){off();return}' +
              'on()})()',
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:font-bold focus:text-paper"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <RevealOnScroll />
        <Curtain />
        <Lightbox />
      </body>
    </html>
  );
}
