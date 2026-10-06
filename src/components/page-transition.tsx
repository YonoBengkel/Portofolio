import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Wraps a page so navigation moves instead of blinking. Going deeper slides the
 * old page left and brings the new one in from the right; going back reverses
 * it. This has to sit inside each page rather than the layout, because layouts
 * persist across navigation and so never enter or exit.
 *
 * Browsers without the View Transitions API simply swap the page, and the CSS
 * turns the whole thing off under prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
