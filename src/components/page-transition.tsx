import { ViewTransition } from "react";
import type { ReactNode } from "react";

/**
 * Wraps a page so the doors close on it and part on the next one. Direction is
 * carried by the case-study title that travels, not by the doors, because a lift
 * door closes the same way whichever floor you asked for.
 *
 * This has to sit inside each page rather than the layout, because layouts persist
 * across navigation and so never enter or exit. Browsers without the View
 * Transitions API simply swap the page, and the CSS turns it off under
 * prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}
