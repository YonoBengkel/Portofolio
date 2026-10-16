import type { ReactNode } from "react";

/**
 * Was a View Transitions boundary; now a passthrough.
 *
 * The page change is the curtain in curtain.tsx, which is an ordinary element with an
 * ordinary animation. Naming the whole page as a transition group made the browser
 * capture a 10,000px-tall element into a texture on every navigation, and the API's
 * snapshots render in the top layer - above the curtain, so the curtain was never seen.
 *
 * The component stays so that every page keeps one place to wrap its content, and so
 * that bringing a real page-level transition back is one file rather than twelve.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
