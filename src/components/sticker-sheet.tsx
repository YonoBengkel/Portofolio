"use client";

import { useEffect, useRef } from "react";

/**
 * The stickers on the about card: peel one off, drag it about, throw it.
 *
 * Ilham chose this for the name card on 9 Nov 2026 - he asked for something "rusuh",
 * rowdier than a tidy card - from a set of real references (React Bits' Sticker Peel
 * was the one for the gesture). It is the site's own sticker-and-stamp language made into
 * objects: until now every sticker here was a picture of one.
 *
 * Every sticker says something the card already says in text - the field, the city,
 * the organisation, the job, that he is open to work - plus one stamp, which is a joke
 * and reads as one. Nothing here is the only place a fact appears, so the whole sheet
 * is hidden from the accessibility tree.
 *
 * How it moves:
 *   - pressed, a sticker lifts: it grows a little, its shadow drops away under it, and
 *     it comes to the top of the pile;
 *   - dragged, it follows the pointer and leans into the direction it is pulled;
 *   - let go while moving, it carries on with the speed it was released at, spinning a
 *     little with it, slowing on friction and bouncing off the edges of the screen it is
 *     on; then it is pressed back down - the same slap the hero gives its tape;
 *   - let go still, it is simply pressed down where it is.
 *
 * The sheet sits over the card inside the zooming wrapper, not inside the card: the card
 * clips its own edges, and a sticker is only a sticker if it can hang off one. Because
 * the wrapper scales on the way in, every pointer distance is divided by the current
 * scale, so a sticker stays under the finger at any point of the zoom.
 *
 * Under reduced motion there is no throw and no slap: a sticker goes where it is put.
 */
type Sticker = {
  id: string;
  shape: "dot" | "tape" | "badge" | "pin" | "label" | "stamp";
  text: string;
  sub?: string;
  /** Where its centre sits on the card, in percent of the card's box, and its angle. */
  x: number;
  y: number;
  r: number;
  /** The same below 860px, where the card stacks into one tall column. */
  xm: number;
  ym: number;
};

/*
  Placed on the card's edges, never over its words. The top two sit 8% down rather than
  on the edge itself: at the end of the runway the ABOUT ME tape runs across the top of
  the card and a sticker on the edge was under it - not seen, and not pickable either.

  Stacked, the card is one column 1300px tall and nearly as wide as the phone, so the
  edges are off screen and the words run the full width. There they go on the corners
  of the portrait and in the empty space beside the two buttons instead.
*/
const STICKERS: Sticker[] = [
  { id: "data", shape: "dot", text: "Data", x: 31, y: 8, r: -12, xm: 80, ym: 4 },
  { id: "open", shape: "tape", text: "Open to work", x: 74, y: 7, r: 6, xm: 33, ym: 3 },
  { id: "ieee", shape: "badge", text: "IEEE PENS", sub: "Research & Education", x: 98, y: 33, r: 11, xm: 70, ym: 25 },
  { id: "sby", shape: "pin", text: "Surabaya", x: -1, y: 56, r: -8, xm: 27, ym: 27 },
  { id: "ideola", shape: "label", text: "AI Engineer", sub: "at Ideola", x: 97, y: 70, r: -6, xm: 77, ym: 68 },
  { id: "approved", shape: "stamp", text: "Approved", x: 9, y: 79, r: -14, xm: 77, ym: 60 },
];

// Friction per 60th of a second, and the speed (px/ms) under which a throw has stopped.
const FRICTION = 0.935;
const REST = 0.03;
const BOUNCE = 0.45;

export function StickerSheet() {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sheet = sheetRef.current;
    const pin = sheet?.parentElement;
    const stage = sheet?.closest<HTMLElement>(".about-sticky");
    if (!sheet || !pin || !stage) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let top = 10;
    const undo: (() => void)[] = [];

    for (const el of sheet.querySelectorAll<HTMLElement>(".stk")) {
      const s = { x: 0, y: 0, spin: 0, vx: 0, vy: 0, id: -1, raf: 0 };
      let start = { cx: 0, cy: 0, x: 0, y: 0 };
      let scale = 1;
      let samples: { t: number; x: number; y: number }[] = [];

      const write = (lean = 0) => {
        el.style.setProperty("--dx", `${s.x.toFixed(1)}px`);
        el.style.setProperty("--dy", `${s.y.toFixed(1)}px`);
        el.style.setProperty("--spin", `${(s.spin + lean).toFixed(1)}deg`);
      };

      // The screen the sticker is on, in the card's own units, less a margin so a
      // sticker never ends up somewhere it cannot be picked up from.
      const bounds = () => {
        const p = pin.getBoundingClientRect();
        const st = stage.getBoundingClientRect();
        const home = el.getBoundingClientRect();
        // Where the sticker's centre would be with no offset, in card units.
        const cx = (home.left + home.width / 2 - p.left) / scale - s.x;
        const cy = (home.top + home.height / 2 - p.top) / scale - s.y;
        const m = 36;
        return {
          minX: (st.left - p.left) / scale + m - cx,
          maxX: (st.right - p.left) / scale - m - cx,
          minY: (st.top - p.top) / scale + m - cy,
          maxY: (st.bottom - p.top) / scale - m - cy,
        };
      };

      const settle = () => {
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        write();
        if (!still.matches) el.dataset.press = "";
      };

      const fly = () => {
        const b = bounds();
        let last = performance.now();
        const step = (now: number) => {
          const dt = Math.min(48, now - last);
          last = now;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.spin += s.vx * dt * 0.12;
          const f = Math.pow(FRICTION, dt / 16.7);
          s.vx *= f;
          s.vy *= f;
          if (s.x < b.minX || s.x > b.maxX) {
            s.x = Math.min(b.maxX, Math.max(b.minX, s.x));
            s.vx *= -BOUNCE;
          }
          if (s.y < b.minY || s.y > b.maxY) {
            s.y = Math.min(b.maxY, Math.max(b.minY, s.y));
            s.vy *= -BOUNCE;
          }
          write();
          if (Math.hypot(s.vx, s.vy) < REST) return settle();
          s.raf = requestAnimationFrame(step);
        };
        s.raf = requestAnimationFrame(step);
      };

      const down = (e: PointerEvent) => {
        if (e.button > 0) return;
        cancelAnimationFrame(s.raf);
        s.raf = 0;
        s.id = e.pointerId;
        el.setPointerCapture(e.pointerId);
        const p = pin.getBoundingClientRect();
        scale = p.width / pin.offsetWidth || 1;
        start = { cx: e.clientX, cy: e.clientY, x: s.x, y: s.y };
        samples = [{ t: e.timeStamp, x: s.x, y: s.y }];
        el.removeAttribute("data-press");
        el.dataset.lift = "";
        el.style.zIndex = String(++top);
        e.preventDefault();
      };

      const move = (e: PointerEvent) => {
        if (e.pointerId !== s.id) return;
        s.x = start.x + (e.clientX - start.cx) / scale;
        s.y = start.y + (e.clientY - start.cy) / scale;
        samples.push({ t: e.timeStamp, x: s.x, y: s.y });
        if (samples.length > 6) samples.shift();
        const a = samples[samples.length - 2] ?? samples[0];
        const vx = (s.x - a.x) / Math.max(1, e.timeStamp - a.t);
        write(Math.max(-12, Math.min(12, vx * 14)));
      };

      const up = (e: PointerEvent) => {
        if (e.pointerId !== s.id) return;
        s.id = -1;
        delete el.dataset.lift;
        // Release speed over the last ~80ms, so a flick counts and a pause before letting
        // go does not.
        const now = e.timeStamp;
        const recent = samples.filter((p) => now - p.t < 80);
        const first = recent[0] ?? samples[samples.length - 1];
        const span = Math.max(1, now - first.t);
        s.vx = (s.x - first.x) / span;
        s.vy = (s.y - first.y) / span;
        if (still.matches || Math.hypot(s.vx, s.vy) < REST * 2) return settle();
        fly();
      };

      const pressed = (e: AnimationEvent) => {
        if (e.animationName === "sticker-slap") el.removeAttribute("data-press");
      };

      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("animationend", pressed);
      undo.push(() => {
        cancelAnimationFrame(s.raf);
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("animationend", pressed);
      });
    }

    return () => {
      for (const off of undo) off();
    };
  }, []);

  return (
    <div className="stk-sheet" ref={sheetRef} aria-hidden="true">
      {STICKERS.map((k) => (
        <div
          key={k.id}
          className={`stk stk-${k.shape}`}
          style={
            {
              "--x": `${k.x}%`,
              "--y": `${k.y}%`,
              "--xm": `${k.xm}%`,
              "--ym": `${k.ym}%`,
              "--r": `${k.r}deg`,
            } as React.CSSProperties
          }
        >
          <span className="stk-face">
            <b>{k.text}</b>
            {k.sub && <small>{k.sub}</small>}
          </span>
        </div>
      ))}
    </div>
  );
}
