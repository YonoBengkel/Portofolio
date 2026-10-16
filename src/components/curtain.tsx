"use client";

import { usePathname } from "next/navigation";

const NAMES: Record<string, string> = {
  "/": "Home",
  "/work": "Work",
  "/about": "About",
  "/about/competitions": "Competitions",
  "/about/activities": "Organisations",
  "/cv": "CV",
  "/contact": "Contact",
};

/**
 * The page change.
 *
 * A panel rises over the page, the destination says its own name in the middle of the
 * move, and the panel leaves upward. 620ms end to end, which is slower than a hover but
 * well inside what the reference sites spend on a navigation.
 *
 * The name is read from the path the browser is already on, so there is nothing to wire
 * at each link, and the whole thing is CSS driven by `:active-view-transition` — no
 * state, no timers, and it simply does not run where view transitions are unsupported
 * or where motion is turned down.
 */
export function Curtain() {
  const path = usePathname();
  const name = NAMES[path] ?? path.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? "";

  return (
    <div className="curtain" aria-hidden="true">
      <span>{name}</span>
    </div>
  );
}
