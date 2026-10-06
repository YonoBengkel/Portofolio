"use client";

import { useEffect, useRef } from "react";

/**
 * A small pool of light that follows the pointer. It is the same mechanic as
 * the one on the page, just held in the reader's hand: light is how this site
 * ranks things, so this is an instrument rather than a decoration.
 *
 * It never appears on a touch screen, under reduced motion, or in Plain mode,
 * and it never intercepts a click.
 */
export function PointerLight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (document.documentElement.dataset.plain === "on") return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    function draw() {
      frame = 0;
      el!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      el!.dataset.on = "true";
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function onLeave() {
      el!.dataset.on = "false";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={ref} className="pointer-light" data-on="false" aria-hidden="true" />;
}
