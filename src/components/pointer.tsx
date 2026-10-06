"use client";

import { useEffect, useRef } from "react";

/**
 * The cursor is the light.
 *
 * Three parts move together: a pool that lights the page around the pointer, a
 * ring that follows a beat behind so the movement has weight, and a small dot
 * that is exactly where the pointer is, because a page you click on needs a
 * precise mark and a soft glow is not one.
 *
 * The system cursor is hidden from JavaScript, never from the stylesheet, so a
 * browser that does not run this file keeps its own arrow instead of losing the
 * pointer entirely. It never takes over a touch screen, and it stops moving
 * under prefers-reduced-motion.
 */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])';

export function Pointer() {
  const poolRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pool = poolRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!pool || !ring || !dot) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    root.dataset.cursor = "light";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let ringX = x;
    let ringY = y;
    let frame = 0;

    function draw() {
      // The ring trails; the dot and the pool do not. Under reduced motion nothing trails.
      const ease = calm.matches ? 1 : 0.16;
      ringX += (x - ringX) * ease;
      ringY += (y - ringY) * ease;
      pool!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      dot!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring!.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      const settled = Math.abs(x - ringX) < 0.1 && Math.abs(y - ringY) < 0.1;
      frame = settled ? 0 : requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      x = e.clientX;
      y = e.clientY;
      root.dataset.pointer = "on";
      const over = (e.target as Element | null)?.closest?.(INTERACTIVE);
      root.dataset.pointerOver = over ? "link" : "page";
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function onLeave() {
      root.dataset.pointer = "off";
    }

    function onDown() {
      root.dataset.pointerDown = "true";
    }
    function onUp() {
      root.dataset.pointerDown = "false";
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      delete root.dataset.cursor;
      delete root.dataset.pointer;
    };
  }, []);

  return (
    <>
      <div ref={poolRef} className="pointer-light" aria-hidden="true" />
      <div ref={ringRef} className="pointer-ring" aria-hidden="true" />
      <div ref={dotRef} className="pointer-dot" aria-hidden="true" />
    </>
  );
}
