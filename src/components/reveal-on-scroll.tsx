"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Mounted once. Anything with the `reveal` class arrives when it first enters
 * the window, slowly and only once: scrolling back up does not take it away
 * again. Under reduced motion the CSS leaves everything visible and this
 * observer never runs.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not(.is-revealed)"));
    if (targets.length === 0) return;

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

    for (const t of targets) {
      t.classList.add("is-hidden");
      observer.observe(t);
    }
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
