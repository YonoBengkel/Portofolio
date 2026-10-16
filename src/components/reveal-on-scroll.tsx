"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Mounted once, doing two jobs that both need to know what is on screen.
 *
 * Anything with the `reveal` class arrives when it first enters the window, slowly and
 * only once: scrolling back up does not take it away again.
 *
 * And anything with `marquee-run` - the hazard tapes, the About band, the two tool rows -
 * only runs while it is in view. That one is not a nicety. A CSS marquee is composited,
 * so it costs no main-thread time and shows up nowhere in a profile, but it does make the
 * compositor produce a frame every vsync for as long as the page is open. Measured before
 * this: five infinite marquees, every one of them below the fold, 604 compositor frames
 * in 5 seconds at the top of the home page, against 4 for a page with no animation at
 * all. `content-visibility: auto` on the bands gets most of it back on a long page, but
 * it is a heuristic - on a short page Chromium keeps the band relevant and the marquee
 * keeps running - so the play state is set here, where it is a fact rather than a guess.
 *
 * Under reduced motion neither runs: the CSS leaves the revealed elements visible and the
 * marquees stopped, and this observer returns before touching anything.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observers: IntersectionObserver[] = [];

    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-revealed)"));
    if (reveals.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              observer.unobserve(entry.target);
            }
          }
        },
        { rootMargin: "0px 0px -12% 0px" },
      );
      for (const t of reveals) {
        t.classList.add("is-hidden");
        observer.observe(t);
      }
      observers.push(observer);
    }

    const runs = Array.from(document.querySelectorAll<HTMLElement>(".marquee-run"));
    if (runs.length) {
      // A little margin, so a band is already moving by the time its top edge arrives
      // rather than visibly starting from a standstill under the reader's eye.
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) entry.target.classList.toggle("is-running", entry.isIntersecting);
        },
        { rootMargin: "150px 0px" },
      );
      for (const t of runs) observer.observe(t);
      observers.push(observer);
      // Only once this class is on the document does the CSS dare to pause anything.
      // Without it - no JavaScript, or before hydration - every band simply runs, which
      // is the behaviour to fall back to.
      document.documentElement.classList.add("js-marquee");
    }

    return () => {
      for (const o of observers) o.disconnect();
      document.documentElement.classList.remove("js-marquee");
    };
  }, [pathname]);

  return null;
}
