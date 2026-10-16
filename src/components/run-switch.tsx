"use client";

import { useEffect, useState } from "react";

/**
 * The switch in the middle of the hero.
 *
 * It swaps the first screen between two grounds: his name on paper, or three ink bands
 * carrying the three things he actually does. Nothing else on the site is behind it -
 * the scroll-driven motion runs on its own, gated only by prefers-reduced-motion, which
 * is the thing that should gate it.
 *
 * It writes `data-run` on <html>, so the hero's whole alternate state is one CSS selector
 * away and no state is threaded through the tree. It starts on the name, always: flipping
 * it has to start something, and a page that arrives already flipped turns the gesture
 * into switching things off.
 *
 * The choice is not persisted. Restoring it would mean setting React state inside an
 * effect on every mount, and the only way back to this screen is the home page itself -
 * where the name is what the page is for.
 */
export function RunSwitch() {
  const [alt, setAlt] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.run = alt ? "1" : "0";
  }, [alt]);

  return (
    <div className="run">
      <label className="run-switch">
        <input
          type="checkbox"
          className="sr-only"
          checked={alt}
          onChange={(e) => setAlt(e.target.checked)}
          aria-label="Swap the first screen between my name and the three steps of the work"
        />
        <span className="run-track" aria-hidden="true">
          <span className="run-ball" />
        </span>
      </label>
      {/* No aria-live: the words here never change, only which one is marked, and the
          checkbox announces its own state. A live region that can never fire is noise. */}
      <p className="run-label">
        <span className={alt ? "" : "is-on"}>Name</span>
        <span aria-hidden="true"> / </span>
        <span className={alt ? "is-on" : ""}>Method</span>
      </p>
    </div>
  );
}
