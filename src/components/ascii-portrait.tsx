"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { asciiPortraits } from "@/content/ascii-portraits";

/**
 * The portrait in the about card: Ilham drawn in characters, and the photograph
 * underneath when you put the cursor on it.
 *
 * The ASCII has no background. A portrait a hundred characters wide has no room to spend
 * on a room - rendered at the frame's real size, a busy background does not read as a
 * background, it reads as noise over the face, and taking it out is what turned a shape
 * into a person. The photograph on hover is the opposite case: it is a real picture at
 * real resolution, and a cut-out figure floating on paper there would look like a
 * mistake. Both are the same crop, so the frame never jumps between them.
 *
 * Between portraits the characters fly. Each cell is sampled from somewhere else in the
 * grid - a long way off at the start of the half second, nowhere by the end - so the old
 * portrait comes apart and the new one gathers out of the pieces. The displacements are
 * one fixed random field, generated once: a new field per frame makes the scatter
 * seethe instead of travel, because nothing a cell does is related to what it did last
 * frame.
 *
 * It is one text node rewritten about thirty times, not six thousand animated elements.
 * Six thousand spans, each with its own transform, is the obvious way to make characters
 * move and it would spend the whole budget on layout; rewriting the string is one DOM
 * write per frame and the browser lays out a monospace block for free.
 *
 * The characters are hidden from the accessibility tree: a screen reader given this would
 * read several thousand punctuation marks. The name is carried once, in text, beside it.
 */

// Short enough that a visitor sees two or three, long enough to look at one.
const HOLD = 2500;
const FLY = 500;
// How far a character can be thrown, in cells. Measured against the 100-wide grid: much
// less and the scatter reads as a shimmer rather than as motion.
const THROW = 22;

const GRIDS = asciiPortraits.map((p) => p.ascii.split("\n"));
const ROWS = GRIDS[0].length;
const COLS = GRIDS[0][0].length;

/*
  One displacement per cell, made once and reused by every transition. Not Math.random at
  render time: this runs in an effect on the client only, so there is no markup for the
  server and the client to disagree about.
*/
function makeField() {
  const dx = new Int8Array(ROWS * COLS);
  const dy = new Int8Array(ROWS * COLS);
  for (let i = 0; i < dx.length; i++) {
    const angle = Math.random() * Math.PI * 2;
    const reach = Math.random() * THROW;
    dx[i] = Math.round(Math.cos(angle) * reach);
    dy[i] = Math.round(Math.sin(angle) * reach);
  }
  return { dx, dy };
}

export function AsciiPortrait({ alt }: { alt: string }) {
  const [shown, setShown] = useState(0);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre || asciiPortraits.length < 2) return;
    // An animation with no end is exactly what this setting exists to stop, so it does
    // not start. The first portrait stays, and the hover still works.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const { dx, dy } = makeField();
    const line: string[] = new Array(COLS);
    const out: string[] = new Array(ROWS);
    let from = 0;
    let timer = 0;
    let raf = 0;

    /** One frame of the scatter: p is 0 at the start of the throw and 1 at the end. */
    const paint = (to: number, p: number) => {
      const a = GRIDS[from];
      const b = GRIDS[to];
      // Cubic, so the pieces spend most of the half second travelling and then stop
      // rather than drifting in for the whole of it.
      const reach = (1 - p) ** 3;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
          const i = y * COLS + x;
          // The new portrait gathers from far away; the old one is thrown out as it goes.
          const take = Math.random() < p ? b : a;
          const scale = take === b ? reach : p ** 3;
          const sy = y + Math.round(dy[i] * scale);
          const sx = x + Math.round(dx[i] * scale);
          line[x] = sy < 0 || sy >= ROWS || sx < 0 || sx >= COLS ? " " : take[sy][sx];
        }
        out[y] = line.join("");
      }
      pre.textContent = out.join("\n");
    };

    const run = (to: number) => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / FLY);
        if (p < 1) {
          paint(to, p);
          raf = requestAnimationFrame(step);
          return;
        }
        pre.textContent = asciiPortraits[to].ascii;
        from = to;
        setShown(to);
        timer = window.setTimeout(() => run((to + 1) % asciiPortraits.length), HOLD);
      };
      raf = requestAnimationFrame(step);
    };

    timer = window.setTimeout(() => run(1 % asciiPortraits.length), HOLD);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ascii-shot">
      <span className="sr-only">{alt}</span>
      <pre className="ascii-frame" ref={preRef} aria-hidden="true">
        {asciiPortraits[0].ascii}
      </pre>
      {asciiPortraits.map((portrait, i) => (
        <Image
          key={i}
          className="ascii-photo"
          data-on={i === shown ? "" : undefined}
          src={portrait.photo}
          alt=""
          sizes="(min-width: 768px) 27rem, 70vw"
        />
      ))}
    </div>
  );
}
