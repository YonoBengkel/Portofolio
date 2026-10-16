"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const NAMES: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/about/competitions": "Competitions",
  "/about/activities": "Organisations",
  "/cv": "CV",
  "/contact": "Contact",
};

/*
  Slower than it was. The numbers never changed, but the feel did: the header now sits
  above the panel, so the page no longer disappears completely and the cover stopped
  reading as a pause. Giving it longer puts the pause back.
*/
const COVER = 520; // the panel rises
const HOLD = 260; // the name sits there while the new page mounts behind it
const CLEAR = 560; // the panel carries on upward and off

function nameFor(path: string) {
  return NAMES[path] ?? path.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "";
}

/**
 * The page change: a panel rises over the page, the destination says its own name, and
 * the panel carries on upward and off. This is the barba.js move Ilham asked for.
 *
 * It does NOT use the View Transitions API, and that is the fix rather than a shortcut.
 * The old version did, and it was rough for two reasons. The API renders its snapshots in
 * the top layer, above every element on the page, so the curtain - an ordinary div - was
 * drawn underneath them and the reader never saw it; what they saw was the hard cut at
 * the moment the new snapshot appeared. And naming the whole page as a transition group
 * made the browser capture a 10,000px-tall element into a texture on every navigation,
 * which is where the lag came from.
 *
 * So the panel is a plain element with a plain animation, and the navigation is simply
 * delayed until it covers. Nothing is captured and nothing is composited twice.
 *
 * It intercepts only the clicks a router would have handled anyway: left button, no
 * modifier, same origin, no target, no download, not a fragment on the current page.
 * Everything else - a middle click, a new tab, an external link, JavaScript off - goes
 * through the browser untouched. Under prefers-reduced-motion it does not run at all and
 * every link navigates immediately.
 *
 * The listener is in the CAPTURE phase, and that detail is load-bearing. React attaches
 * next/link's own handler at the root container, which is an ancestor of every link but
 * a descendant of the document - so on the way up it runs first, calls preventDefault and
 * pushes the route, and a bubble-phase listener here would find the navigation already
 * done. Capturing on the document means this runs before any of that, and stopping
 * propagation is what keeps the Link from pushing before the panel has covered anything.
 */
export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "covering" | "clearing">("idle");
  const busy = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];

    const onClick = (e: MouseEvent) => {
      if (busy.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // the same page, or only a hash

      e.preventDefault();
      e.stopPropagation();
      busy.current = true;
      setLabel(nameFor(url.pathname));
      setState("covering");
      // The header's fill listens for this, so it has already slid to the destination by
      // the time the panel lifts rather than appearing there afterwards.
      window.dispatchEvent(new CustomEvent("nav:pending", { detail: url.pathname }));

      timers.push(
        window.setTimeout(() => {
          router.push(url.pathname + url.search);
          timers.push(
            window.setTimeout(() => {
              setState("clearing");
              timers.push(
                window.setTimeout(() => {
                  setState("idle");
                  busy.current = false;
                  window.dispatchEvent(new CustomEvent("nav:pending", { detail: null }));
                }, CLEAR),
              );
            }, HOLD),
          );
        }, COVER),
      );
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      for (const t of timers) window.clearTimeout(t);
      busy.current = false;
    };
  }, [router]);

  // If a navigation happens some other way - back, forward, a redirect - make sure the
  // panel is not left sitting over the page.
  useEffect(() => {
    if (!busy.current) setState("idle");
  }, [pathname]);

  return (
    <div className={`curtain curtain-${state}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}
