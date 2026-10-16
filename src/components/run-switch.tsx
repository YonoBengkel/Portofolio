"use client";

import { useEffect, useState } from "react";

/**
 * The switch that starts the page.
 *
 * Off, the site is still: no tape running, no drift, no tilt. On, everything moves. It
 * is the same gag as the reference's toggle, with a different job and a different label:
 * this one reads as a machine being started, which is what the rest of the site is about
 * - processes that run - rather than a generic on/off.
 *
 * It writes `data-run` on <html>, so every effect on the site is one CSS selector away
 * and there is no state threaded through the tree. The choice is remembered, because a
 * reader who turned the motion off does not want to turn it off again on the next page.
 *
 * It starts off on a first visit, so flipping it is the moment. Under
 * `prefers-reduced-motion` every effect behind it stays still even when it is on, and
 * nothing that carries information is behind it either way.
 */
export function RunSwitch() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // Off on a first visit, always. The point of the switch is that flipping it starts
    // something; a page that is already running turns the gesture into switching things
    // off, which is the wrong direction for the one moment this is here to create.
    const saved = localStorage.getItem("run");
    if (saved === "1") setOn(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.run = on ? "1" : "0";
    try {
      localStorage.setItem("run", on ? "1" : "0");
    } catch {
      /* private window: the switch still works, it just will not be remembered */
    }
  }, [on]);

  return (
    <div className="run">
      <label className="run-switch">
        <input
          type="checkbox"
          className="sr-only"
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          aria-label="Start the page: turn the animation on"
        />
        <span className="run-track" aria-hidden="true">
          <span className="run-ball" />
        </span>
      </label>
      <p className="run-label" aria-live="polite">
        Pipeline <b>{on ? "running" : "idle"}</b>
      </p>
    </div>
  );
}
