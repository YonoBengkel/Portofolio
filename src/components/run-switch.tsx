"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
  const labelRef = useRef<HTMLParagraphElement>(null);
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    document.documentElement.dataset.run = alt ? "1" : "0";
  }, [alt]);

  /*
    The mark under the active word is one element that travels, not a border that moves
    from one word to the other - two borders cannot animate into each other, only a
    single object can cross the gap. Same device as the nav pill's fill.

    Measured from the live word rather than written down, so it stays right at whatever
    the font renders to; offsetLeft is taken from the label's border box while the mark
    is positioned against its padding box, which is what clientLeft subtracts. The active
    word is found by its class rather than by index - the mark is a span inside the same
    label, so counting children puts it in the queue with the words.
  */
  useLayoutEffect(() => {
    const label = labelRef.current;
    if (!label) return;
    const measure = () => {
      const word = label.querySelector<HTMLElement>(".is-on");
      setMark(word ? { x: word.offsetLeft - label.clientLeft, w: word.offsetWidth } : null);
    };
    measure();
    // Fonts land after first paint and change both words' widths.
    const observer = new ResizeObserver(measure);
    observer.observe(label);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => observer.disconnect();
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
      <p
        className="run-label"
        ref={labelRef}
        data-has-mark={mark ? "" : undefined}
        style={mark ? ({ "--mark-x": `${mark.x}px`, "--mark-w": `${mark.w}px` } as React.CSSProperties) : undefined}
      >
        <span className="run-mark" aria-hidden="true" />
        <span className={alt ? "" : "is-on"}>Name</span>
        <span aria-hidden="true"> / </span>
        <span className={alt ? "is-on" : ""}>Method</span>
      </p>
    </div>
  );
}
