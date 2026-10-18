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

          This now owns the whole life of the overlay, not just its early exit. The
          sequence used to lift itself at the end of its own keyframes; Ilham asked for
          one that ends on a click, so the CSS holds the last frame indefinitely and
          every state change below is the only thing that moves it on. The two failures
          that buys are both covered in globals.css rather than here, because a script
          cannot catch its own absence: noscript removes the overlay when scripting is
          off, and html:not([data-intro]) lifts it at 4000ms when scripting is on but
          this script did not run - a CSP or an extension that strips inline scripts.

          The session flag is set on the way in rather than at the end, so a reload
          halfway through does not start it again.

          The gates run route first. The replay test used to come first and matched
          "intro" anywhere in the query string, so /work?utm_campaign=introducing-ilham
          put the page into the sequence states on a route that never renders the overlay
          - and 3500ms later the first Space or Enter was silently eaten. It is now
          anchored to a whole parameter name and only ever reached on the home page.

          Four deliberate details in the handlers:

          The listeners are attached immediately but out() returns unless the state is
          already "ready", so the first 3500ms cannot be clicked away. Gating on the
          state rather than attaching the listeners on the timer means there is no window
          where the cue is up and the click has not been wired yet - the cue is drawn by
          the same attribute that permits the click.

          Everything also checks up(), that an overlay is actually on screen. A client-side
          navigation away from the home page unmounts it while the states live on <html>,
          and without this check a keystroke would be swallowed on a page with nothing
          covering it. The 3500ms timer resolves to "off" rather than "ready" for the
          same reason.

          Tab is held while the overlay is up. Focus otherwise walks into the header
          behind it, invisibly, and Enter then follows a link the visitor never saw
          themselves choose - measured, four tabs and a return landed on /about with the
          sequence still playing.

          The exit comes in two styles and the script only names which one. ?intro=ink
          asks for the ink panel that sweeps across and off, the move the site makes
          between pages; anything else is the paper curtain, which is the default and
          what an ordinary first visit gets. One timer serves both: 1200ms is past the
          longer of the two, and the overlay is hidden and inert well before it.

          Enter and Space end it, so the overlay is not a trap without a pointer, and
          preventDefault is called only while it is up - otherwise Space would stop
          scrolling the page on every visit that never showed an intro at all.
          Deliberately not any key: PrintScreen and the Windows key fire keydown, and a
          screenshot dismissing the thing being photographed is exactly the complaint
          that got the old skip gesture removed.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){var d=document.documentElement;function off(){d.dataset.intro="off"}' +
              'function up(){var e=document.querySelector(".intro");' +
              'return !!e&&getComputedStyle(e).display!=="none"}' +
              'function out(){if(d.dataset.intro!=="ready"||!up())return;' +
              'd.dataset.intro="out";setTimeout(off,1200)}' +
              'function key(e){var s=d.dataset.intro;' +
              'if((s!=="on"&&s!=="ready")||!up())return;' +
              'if(e.key==="Tab"){e.preventDefault();return}' +
              'if(s==="ready"&&(e.key==="Enter"||e.key===" ")){e.preventDefault();out()}}' +
              'function on(s){d.dataset.introStyle=s==="ink"?"ink":"paper";' +
              'd.dataset.intro="on";addEventListener("pointerdown",out);' +
              'addEventListener("keydown",key);' +
              'setTimeout(function(){if(d.dataset.intro==="on")d.dataset.intro=up()?"ready":"off"},3500)}' +
              'if(location.pathname!=="/"){off();return}' +
              'var m=/[?&]intro(?:=([a-z]+))?(?:&|$)/.exec(location.search);' +
              'if(m){on(m[1]);return}' +
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
