"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * The contents list on /work shows the work while you read it: point at a row and that
 * project's cover follows the pointer, with a round "Open" riding just ahead of it.
 *
 * Ilham picked this on 9 Nov 2026 from Dennis Snellenberg's work list, and the timings
 * are read off his page rather than invented: the preview grows from nothing over 0.4s
 * on cubic-bezier(0.36, 0, 0.66, 0); moving from one row to the next slides a strip of
 * every cover under the frame over 0.5s on cubic-bezier(0.65, 0, 0.35, 1), so the
 * covers pass each other instead of cutting; the frame trails the pointer and the button
 * keeps closer to it, which is what makes the pair read as two objects rather than one
 * sticker. The rows that are not under the pointer dim, as his do.
 *
 * Only where it can be used: a fine pointer that hovers, a window wide enough for the
 * list's four columns, and not under reduced motion. Everywhere else the list is exactly
 * the list it was, and nothing in it depends on this. The covers load on the first
 * pointer into the list, not with the page - most visits to /work never hover it.
 *
 * Hidden from the accessibility tree: every row already names its project in text, and
 * the cover is the same picture the case study opens with.
 */
type Item = { slug: string; src: StaticImageData };

const FRAME_W = 400;
const FRAME_H = 280;
// How much of the remaining distance each frame closes: the frame lags, the button keeps up.
const FRAME_EASE = 0.12;
const BUTTON_EASE = 0.24;

export function WindexPreview({ items, children }: { items: Item[]; children: React.ReactNode }) {
  const [armed, setArmed] = useState(false);
  const [on, setOn] = useState(false);
  const [at, setAt] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ fx: 0, fy: 0, bx: 0, by: 0, placed: false });
  const raf = useRef(0);
  const usable = useRef(false);

  useEffect(() => {
    const q = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 860px) and (prefers-reduced-motion: no-preference)");
    const set = () => (usable.current = q.matches);
    set();
    q.addEventListener("change", set);
    return () => {
      q.removeEventListener("change", set);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const loop = () => {
    const p = pos.current;
    const t = target.current;
    p.fx += (t.x - p.fx) * FRAME_EASE;
    p.fy += (t.y - p.fy) * FRAME_EASE;
    p.bx += (t.x - p.bx) * BUTTON_EASE;
    p.by += (t.y - p.by) * BUTTON_EASE;
    /*
      The translate property, not transform. The grow-in animates scale, and scale is
      applied after translate but before transform: written into transform, the position
      itself got scaled, and the preview flew in from the top-left corner instead of
      growing where the pointer was.
    */
    if (frameRef.current) frameRef.current.style.translate = `${p.fx - FRAME_W / 2}px ${p.fy - FRAME_H / 2}px`;
    if (buttonRef.current) buttonRef.current.style.translate = `${p.bx - 44}px ${p.by - 44}px`;
    // Keep going only while there is somewhere left to go.
    const still = Math.abs(t.x - p.fx) + Math.abs(t.y - p.fy) < 0.5;
    raf.current = still ? 0 : requestAnimationFrame(loop);
  };

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!usable.current || e.pointerType === "touch") return;
    if (!armed) setArmed(true);
    const row = (e.target as Element).closest<HTMLElement>("[data-prev]");
    const i = row ? Number(row.dataset.prev) : -1;
    target.current = { x: e.clientX, y: e.clientY };
    if (!pos.current.placed) {
      // First entry: appear where the pointer is, not fly in from the corner.
      pos.current = { fx: e.clientX, fy: e.clientY, bx: e.clientX, by: e.clientY, placed: true };
    }
    if (i >= 0) {
      if (i !== at) setAt(i);
      if (!on) setOn(true);
    } else if (on) {
      setOn(false);
    }
    if (!raf.current) raf.current = requestAnimationFrame(loop);
  };

  const leave = () => {
    setOn(false);
    pos.current.placed = false;
  };

  return (
    <div className="windex-wrap" data-on={on ? "" : undefined} onPointerMove={move} onPointerLeave={leave}>
      {children}
      <div className="wprev" ref={frameRef} aria-hidden="true">
        <div className="wprev-frame">
          <div className="wprev-stack" style={{ "--at": at } as React.CSSProperties}>
            {items.map((it) => (
              <div className="wprev-slide" key={it.slug}>
                {armed && <Image src={it.src} alt="" sizes={`${FRAME_W}px`} className="wprev-img" />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="wprev-btn" ref={buttonRef} aria-hidden="true">
        Open
      </div>
    </div>
  );
}
