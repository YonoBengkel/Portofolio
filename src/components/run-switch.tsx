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
 * away and no state is threaded through the tree.
 *
 * It starts on the name, and then it flips itself. That used to be ruled out - a page
 * that arrives already flipped turns the gesture into switching things off - and on
 * 9 Nov 2026 Ilham chose exactly that: the page lays the tape over the name by itself,
 * strip by strip, and Name is now the switch that tidies the scene. It starts on the
 * name so the name is seen first; the laying is the event, not a starting position.
 *
 * It lays the tape once per visit to the page, and only when it can be watched:
 *   - after the intro has gone, if the intro is up - laying tape behind a closed door
 *     would spend the whole gesture on nobody;
 *   - otherwise after a beat on its own, so the name is read before it is covered;
 *   - not if the hero is no longer on screen by then, or if the switch has been
 *     touched first - either way the visitor has already moved on or made the choice;
 *   - never under prefers-reduced-motion, where the laying is the motion. There the page
 *     stays on the name and the switch does the rest, without movement.
 *
 * The choice is not persisted. Restoring it would mean setting React state inside an
 * effect on every mount, and the only way back to this screen is the home page itself.
 */
// 6 strips laid 230ms apart, each 560ms on its way in plus its 260ms press, and margin.
const LAY_TOTAL = 5 * 230 + 560 + 260 + 230;
// A beat on the name before the tape starts, with and without the intro in front of it.
const ALONE = 700;
const AFTER_INTRO = 250;

export function RunSwitch() {
  const [alt, setAlt] = useState(false);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const [mark, setMark] = useState<{ x: number; w: number } | null>(null);
  const touched = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.run = alt ? "1" : "0";
  }, [alt]);

  useEffect(() => {
    const html = document.documentElement;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const hero = document.querySelector<HTMLElement>(".hero");
    let timer = 0;
    let done = 0;
    let watcher: MutationObserver | null = null;

    const lay = () => {
      if (touched.current || !hero) return;
      const r = hero.getBoundingClientRect();
      // Most of the hero has to be in the window, not just its last few pixels.
      if (r.bottom < innerHeight * 0.6 || r.top > innerHeight * 0.4) return;
      // The choreography attribute goes on before data-run flips, so the flip is styled
      // by the laying rules from its first frame.
      html.dataset.tape = "lay";
      setAlt(true);
      done = window.setTimeout(() => delete html.dataset.tape, LAY_TOTAL);
    };

    const intro = html.dataset.intro;
    if (intro && intro !== "off") {
      watcher = new MutationObserver(() => {
        if (html.dataset.intro !== "off") return;
        watcher?.disconnect();
        timer = window.setTimeout(lay, AFTER_INTRO);
      });
      watcher.observe(html, { attributes: true, attributeFilter: ["data-intro"] });
    } else {
      timer = window.setTimeout(lay, ALONE);
    }

    return () => {
      watcher?.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(done);
      delete html.dataset.tape;
    };
  }, []);

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
          onChange={(e) => {
            // A hand on the switch overrides the page: no laying after this, and any
            // laying in progress hands back to the switch's own choreography.
            touched.current = true;
            delete document.documentElement.dataset.tape;
            setAlt(e.target.checked);
          }}
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
