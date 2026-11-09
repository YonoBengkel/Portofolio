"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { AwardCell } from "./certificates";

/**
 * The certificates grid on the home page, in Antoine Wodniack's awards format: a column
 * of ruled cells, each under an ink mask with a star that wipes off to the right as the
 * cell comes into view, and either side of the column the walls of a room drawn in
 * one-point perspective. What goes in the cells is decided in certificates.tsx.
 *
 * It replaced the corridor on 9 Nov 2026, which had stuttered on Ilham's machine, so it
 * is built to cost nothing while you scroll:
 *   - each reveal is a CSS transition, started once by an IntersectionObserver and never
 *     again;
 *   - the room is lines, not planes. A wall's rungs are 1px strips skewed about the end
 *     where they meet the grid, and its posts are 1px strips moved up and down; both are
 *     Web Animations on a ViewTimeline of the wall, so the compositor runs them straight
 *     off the scroll position, and nothing in the page restyles or repaints.
 *
 * The room: the column is the far wall, and you stand in front of it at the middle of the
 * window. A rung is a line on a side wall at one height; at the column it is where the
 * grid's own row line is, and towards you it runs away from your eye level - up when it
 * is above you, down when it is below - so as you scroll down the rungs swing past like
 * the floors of a lift shaft. STEEP is how far they swing: tan 35 degrees once a rung's
 * end is at the top or bottom of the window. The posts are where the wall's panels meet,
 * closer together towards the column, the way equal steps in depth look.
 *
 * Under reduced motion, and where there is no ViewTimeline, the room is drawn once as if
 * you stood at its middle, and the cells are not masked at all.
 */
const POSTS = [0.1, 0.24, 0.43, 0.67]; // where the posts stand, as a share of the wall from the column out
const STEEP = 0.7;

type Timeline = new (o: { subject: Element; axis?: string }) => AnimationTimeline;

function Star({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 0C12.6 6.2 17.8 11.4 24 12C17.8 12.6 12.6 17.8 12 24C11.4 17.8 6.2 12.6 0 12C6.2 11.4 11.4 6.2 12 0Z" />
    </svg>
  );
}

// The seal in the drawn cell: a rosette of eighteen scallops, a ring, a star and two
// ribbon tails, the way a certificate is stamped. Computed once, so the server and the
// browser draw the same thing.
const ROSETTE = (() => {
  const n = 18;
  const [cx, cy, R] = [50, 40, 31];
  const r = (R * Math.sin(Math.PI / n) * 1.18).toFixed(2);
  let d = "";
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    const x = (cx + R * Math.cos(a)).toFixed(2);
    const y = (cy + R * Math.sin(a)).toFixed(2);
    d += k === 0 ? `M${x} ${y}` : `A${r} ${r} 0 0 1 ${x} ${y}`;
  }
  return `${d}Z`;
})();

function Seal() {
  return (
    <svg className="aw-seal-art" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d="M39 66 31 95 37.5 90 43 96 48 71" />
      <path d="M61 66 69 95 62.5 90 57 96 52 71" />
      <path d={ROSETTE} />
      <circle cx="50" cy="40" r="21" />
      <path
        className="aw-seal-star"
        d="M50 29C50.3 35.6 54.4 39.7 61 40C54.4 40.3 50.3 44.4 50 51C49.7 44.4 45.6 40.3 39 40C45.6 39.7 49.7 35.6 50 29Z"
      />
    </svg>
  );
}

function Cell({ cell }: { cell: AwardCell }) {
  const { c, r, w, h = 1 } = cell.at;
  const style = { gridColumn: `${c} / span ${w}`, gridRow: `${r} / span ${h}`, "--c0": c - 1 } as React.CSSProperties;

  if (cell.kind === "hatch") return <li className="aw-cell aw-hatch" style={style} aria-hidden="true" />;
  if (cell.kind === "seal") {
    return (
      <li className="aw-cell aw-seal" style={style} aria-hidden="true">
        <Seal />
        <Star className="aw-corner aw-corner-tl" />
        <Star className="aw-corner aw-corner-tr" />
        <Star className="aw-corner aw-corner-bl" />
        <Star className="aw-corner aw-corner-br" />
      </li>
    );
  }

  const n = cell.shots.length;
  const inner = (
    <span className="aw-inner">
      {cell.kind === "text" && <span className="aw-tag">{cell.tag}</span>}
      {n > 0 && (
        <span className="aw-tag aw-tag-r" aria-hidden="true">
          {n > 1 ? `${n} scans` : "Scan"}
        </span>
      )}
      {cell.kind === "text" ? (
        <span className="aw-lines">
          {cell.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      ) : (
        <>
          <span className="aw-name" style={{ "--fs": cell.fs } as React.CSSProperties}>
            {cell.title.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </span>
          {cell.counts.map((line) => (
            <span key={line} className="aw-num">
              {line}
            </span>
          ))}
        </>
      )}
    </span>
  );

  return (
    <li className={`aw-cell aw-${cell.kind}`} style={style} data-masked="">
      {n > 0 ? (
        <button type="button" className="aw-hit" data-zoom-set={JSON.stringify(cell.shots)}>
          {inner}
          <span className="sr-only">{n > 1 ? ` — opens the ${n} certificates` : " — opens the certificate"}</span>
        </button>
      ) : (
        inner
      )}
      <span className="aw-mask" aria-hidden="true">
        <span className="aw-star">
          <Star />
        </span>
      </span>
    </li>
  );
}

export function CertGrid({ cells, rows, count }: { cells: AwardCell[]; rows: number; count: number }) {
  const roomRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // The masks go on before the first paint, so a cell is never seen and then covered.
  // Under reduced motion they never go on, and without JavaScript there is no mask at all.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !("IntersectionObserver" in window)) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    grid.dataset.armed = "";
    const cells = [...grid.querySelectorAll<HTMLElement>(".aw-cell[data-masked]:not([data-on])")];
    const show = (el: HTMLElement) => {
      el.dataset.on = "";
      io.unobserve(el);
    };
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) show(e.target as HTMLElement);
        // A jump - the End key, a link to the foot of the page - can carry a cell from
        // below the window to above it without it ever being seen, and the observer only
        // speaks when something crosses in. Whatever is already above the window when it
        // does speak has been passed, so it is shown too.
        for (const el of cells) if (!("on" in el.dataset) && el.getBoundingClientRect().bottom < 0) show(el);
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.3 },
    );
    for (const el of cells) io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const room = roomRef.current;
    if (!room) return;
    const wide = matchMedia("(min-width: 900px)");
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    const View = (window as unknown as { ViewTimeline?: Timeline }).ViewTimeline;
    let anims: Animation[] = [];
    let timer = 0;

    const build = () => {
      for (const a of anims) a.cancel();
      anims = [];
      const walls = [...room.querySelectorAll<HTMLElement>(".awr-wall")];
      if (!wide.matches || walls.length !== 2) return;
      const L = walls[0].offsetWidth;
      const H = walls[0].offsetHeight;
      const vh = innerHeight;
      if (L < 40 || H < 40 || vh < 200) return;
      // How far a post's ends move per pixel the eye moves, at the outer edge of the wall.
      const k = (2 * STEEP * L) / vh;
      const live = !!View && !still.matches;

      for (const wall of walls) {
        const sign = wall.classList.contains("awr-wall-r") ? -1 : 1;
        const range = live
          ? ({
              timeline: new View!({ subject: wall, axis: "block" }),
              rangeStart: "cover 0%",
              rangeEnd: "cover 100%",
              fill: "both",
              easing: "linear",
            } as KeyframeAnimationOptions)
          : null;
        // e: how far the eye is below the top of the wall, in px, at progress p.
        const eyeAt = (p: number) => p * (H + vh) - vh / 2;

        for (const post of wall.querySelectorAll<HTMLElement>(".awr-post")) {
          const f = Number(post.dataset.f);
          post.style.height = `${(H * (1 + k * f)).toFixed(1)}px`;
          const shift = (e: number) => `0 ${(-k * f * e).toFixed(2)}px`;
          if (!range) {
            post.style.translate = shift(H / 2);
            continue;
          }
          post.style.translate = "";
          anims.push(post.animate([{ translate: shift(eyeAt(0)) }, { translate: shift(eyeAt(1)) }], range));
        }

        for (const rung of wall.querySelectorAll<HTMLElement>(".awr-rung")) {
          const y = rung.offsetTop + 0.5;
          // x: how far the eye is below this rung, in half-windows. tan of the skew is STEEP * x.
          const skew = (x: number) => `skewY(${(sign * Math.atan(STEEP * x)).toFixed(4)}rad)`;
          if (!range) {
            rung.style.transform = skew((H / 2 - y) / (vh / 2));
            continue;
          }
          rung.style.transform = "";
          const xAt = (p: number) => (eyeAt(p) - y) / (vh / 2);
          const pAt = (x: number) => (x * (vh / 2) + vh / 2 + y) / (H + vh);
          // Close together where the rung is on screen, where atan bends; loose either side.
          const frames: Keyframe[] = [{ transform: skew(xAt(0)), offset: 0 }];
          for (const x of [-4, -2.5, -1.5, -1, -0.6, -0.3, 0, 0.3, 0.6, 1, 1.5, 2.5, 4]) {
            const p = pAt(x);
            if (p > frames[frames.length - 1].offset! + 0.001 && p < 0.999) frames.push({ transform: skew(x), offset: p });
          }
          frames.push({ transform: skew(xAt(1)), offset: 1 });
          anims.push(rung.animate(frames, range));
        }
      }
      room.dataset.live = live ? "" : "still";
    };

    build();
    const soon = () => {
      clearTimeout(timer);
      timer = window.setTimeout(build, 160);
    };
    addEventListener("resize", soon);
    wide.addEventListener("change", build);
    still.addEventListener("change", build);
    return () => {
      clearTimeout(timer);
      removeEventListener("resize", soon);
      wide.removeEventListener("change", build);
      still.removeEventListener("change", build);
      for (const a of anims) a.cancel();
    };
  }, []);

  return (
    <div className="awr" ref={roomRef}>
      {["l", "r"].map((side) => (
        <div key={side} className={`awr-wall awr-wall-${side}`} aria-hidden="true">
          {POSTS.map((f) => (
            <span key={f} className="awr-post" data-f={f} style={{ "--f": f } as React.CSSProperties} />
          ))}
          {Array.from({ length: rows + 1 }, (_, i) => (
            <span key={i} className="awr-rung" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      ))}
      <div className="aw" ref={gridRef}>
        <p className="aw-bar">{count} on file</p>
        <ul className="aw-grid" style={{ "--rows": rows } as React.CSSProperties}>
          {cells.map((cell) => (
            <Cell key={`${cell.at.c}-${cell.at.r}`} cell={cell} />
          ))}
        </ul>
      </div>
    </div>
  );
}
