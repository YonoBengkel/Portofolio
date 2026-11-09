"use client";

import { useEffect, useRef } from "react";
import type { TimelineEntry } from "./timeline";

/**
 * Experience and education as a case log: a rail of stations on the left and a desk on
 * the right. Scrolling runs the rail down to the next station, and that entry's file
 * drops onto the pile from above the screen and is stamped. When the last one is down
 * the pile is spread out into a list, so the section ends readable rather than as one
 * file on top of three.
 *
 * Ilham broke this section down himself on 9 Nov 2026, combining two options from the
 * research board: A, files slammed onto a desk and stamped, and B, a process line with
 * the dates as its stations. He chose this shape - the desk and the rail - kept the
 * order the site already uses (work, then the organisations, then the degree), and took
 * the 2023 olympiad entry off the front page so that the degree, which the heading has
 * always promised, is finally on it. Every entry he keeps is still running, so every
 * stamp says ONGOING; the start date inside the stamp is what tells them apart.
 *
 * Two things he changed after seeing it, the same evening:
 *   - the files are not there until they fall. They used to wait just above the pinned
 *     screen, and before the screen pinned that put them over the about section above
 *     it. Now the screen clips them and they are hidden until their turn, so a file
 *     arrives out of nothing at the top of the window and drops;
 *   - the heading moved inside the pinned screen and everything was tightened, so from
 *     "Experience & education" to the last station is one screen.
 *
 * One structure, two layouts. Where it can be walked - 900px and up, motion allowed -
 * the script adds is-pinned and the section becomes a sticky screen over a few screens
 * of scroll. Everywhere else, and before the script runs, it is a flowing list: the rail
 * down the left of the cards, each card landing and stamped as it comes into view, or
 * simply the finished list under reduced motion. The heading is rendered once and serves
 * both.
 *
 * The scroll position becomes a step - which files are down, whether the pile is spread
 * - written as attributes and left to CSS, so scrolling back up takes the files back off
 * the pile in reverse. The screen gives one jolt per file that lands, never on the way up.
 */
type Props = { entries: TimelineEntry[]; children: React.ReactNode };

/*
  Where each file lies on the pile: a few degrees and a few pixels off true, the way a
  file thrown onto a stack lands. Fixed, so the server and the browser agree.
*/
const PILE = [
  { rot: -4, px: -12, py: -6 },
  { rot: 3, px: 14, py: 4 },
  { rot: -2, px: -6, py: 12 },
  { rot: 5, px: 9, py: -3 },
  { rot: -3, px: -14, py: 6 },
];

/** Where file k goes when the pile is spread: two columns, rows below the heading. */
function spreadAt(k: number, n: number) {
  const rows = Math.ceil(n / 2);
  const col = k % 2;
  const row = Math.floor(k / 2);
  return { sx: col ? 73 : 27, sy: 34 + ((row + 0.5) * 58) / rows };
}

function stampFor(period: string) {
  const [from, to] = period.split("–").map((s) => s.trim());
  return /present/i.test(to ?? "") ? { word: "Ongoing", line: `Since ${from}` } : { word: "Closed", line: period };
}

function File({ e, i }: { e: TimelineEntry; i: number }) {
  const stamp = stampFor(e.period);
  return (
    <>
      <p className="logfile-tab">
        <span>File {String(i + 1).padStart(2, "0")}</span>
        <span className={`chip ${e.kind === "Work" ? "chip-live" : ""}`}>{e.kind}</span>
      </p>
      <p className="meta logfile-period">{e.period}</p>
      <h3 className="logfile-title">{e.title}</h3>
      <p className="logfile-org">{e.org}</p>
      <p className="logfile-body">{e.body}</p>
      <span className="logfile-stamp" aria-hidden="true">
        <b>{stamp.word}</b>
        <small>{stamp.line}</small>
      </span>
    </>
  );
}

const PINNED = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

export function CaseLog({ entries, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const n = entries.length;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>(".log-sticky");
    const files = [...root.querySelectorAll<HTMLElement>(".log-desk .logfile")];
    const stations = [...root.querySelectorAll<HTMLElement>(".log-station")];
    const flowItems = [...root.querySelectorAll<HTMLElement>(".logflow-item")];
    const pinned = matchMedia(PINNED);
    const still = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let last = 0;
    let visible = false;

    // ----- pinned: scroll position to step
    const update = () => {
      raf = 0;
      if (!root.classList.contains("is-pinned")) return;
      const r = root.getBoundingClientRect();
      const run = r.height - innerHeight;
      const p = run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
      /*
        n landings and one spread, spaced evenly through the run. Each lands 0.4 of a
        share into its own share, so the first file is not dropped the instant the screen
        pins and the last has room before the spread. The rail reaches station k exactly
        as file k lands.
      */
      const t = p * (n + 1);
      const down = Math.min(n, Math.max(0, Math.floor(t + 0.6)));
      root.style.setProperty("--fill", String(Math.min(1, Math.max(0, (t - 0.4) / Math.max(1, n - 1)))));
      if (down !== last) {
        files.forEach((f, k) => f.toggleAttribute("data-landed", k < down));
        stations.forEach((s, k) => s.toggleAttribute("data-on", k < down));
        root.dataset.down = String(down);
        // One jolt per file that lands; nothing on the way back up.
        if (down > last && stage) {
          stage.classList.remove("is-thud");
          // The class has to be off for a frame for the animation to replay.
          void stage.offsetWidth;
          stage.classList.add("is-thud");
        }
        last = down;
      }
      root.toggleAttribute("data-spread", t >= n + 0.4);
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(root);
    addEventListener("scroll", onScroll, { passive: true });

    // ----- flowing: each card lands as it comes into view, once
    const flowIo = new IntersectionObserver(
      (list) => {
        for (const e of list) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-in", "");
          flowIo.unobserve(e.target);
        }
      },
      // Early enough that a card lands as it comes up the screen, not after a stretch of
      // empty rail: at -30% the next station sat on screen with nothing beside it.
      { rootMargin: "0px 0px -12% 0px" },
    );

    /*
      The spread row, every file the same height - Ilham's request, 9 Nov 2026. Each file
      is placed on its own, absolutely, so nothing in CSS can make them match; instead
      copies of the four are set at the row's width out of sight, the tallest is measured,
      and that height goes to all of them as --file-h. The shorter files keep their stamp
      at the foot, level with the others.
    */
    const measure = () => {
      if (!stage || !root.classList.contains("is-pinned")) {
        root.style.removeProperty("--file-h");
        return;
      }
      // The spread's own width rule (.log[data-spread] .logfile[data-landed] in globals.css).
      const padx = parseFloat(getComputedStyle(stage).paddingLeft) || 0;
      const width = (stage.clientWidth - 2 * padx - (n - 1) * 22) / n;
      const probe = document.createElement("div");
      probe.className = "log-probe";
      probe.setAttribute("aria-hidden", "true");
      for (const f of files) {
        const copy = f.cloneNode(true) as HTMLElement;
        copy.removeAttribute("style");
        copy.removeAttribute("data-landed");
        copy.style.width = `${width}px`;
        probe.appendChild(copy);
      }
      stage.appendChild(probe);
      const tallest = Math.max(...[...probe.children].map((c) => (c as HTMLElement).offsetHeight));
      probe.remove();
      root.style.setProperty("--file-h", `${Math.ceil(tallest)}px`);
      /*
        Where the row does not fit between the heading and the foot of the screen - a
        laptop's 720px, say, where four narrow files run taller than the room - it is
        moved to the middle of that band and made smaller as a whole, just enough. Where it
        fits it stays as drawn, centred at 60% of the screen (top: 60% on each file).
      */
      const head = root.querySelector<HTMLElement>(".log-head");
      const box = stage.getBoundingClientRect();
      const H = stage.clientHeight;
      const headFoot = head ? head.getBoundingClientRect().bottom - box.top + 18 : 0;
      const foot = H - (parseFloat(getComputedStyle(stage).paddingBottom) || 0) - 8;
      const centre = 0.6 * H;
      const fits = 2 * Math.min(centre - headFoot, foot - centre) >= tallest;
      const fit = fits ? 1 : Math.max(0.5, Math.min(1, (foot - headFoot) / tallest));
      const shift = fits ? 0 : (headFoot + foot) / 2 - centre;
      root.style.setProperty("--file-fit", fit.toFixed(3));
      root.style.setProperty("--file-shift", `${shift.toFixed(1)}px`);
    };
    let resizeTimer = 0;
    const onResize = () => {
      onScroll();
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 150);
    };
    addEventListener("resize", onResize);

    const arrange = () => {
      const pin = pinned.matches;
      root.classList.toggle("is-pinned", pin);
      // Armed, the flowing cards wait out of sight until they land; unarmed, or under
      // reduced motion, they are simply there.
      root.toggleAttribute("data-armed", !pin && !still.matches);
      if (!pin && !still.matches) for (const li of flowItems) if (!li.hasAttribute("data-in")) flowIo.observe(li);
      measure();
      onScroll();
    };
    arrange();
    pinned.addEventListener("change", arrange);
    // The page's faces may arrive after the first measurement; measure again when they do.
    let gone = false;
    document.fonts?.ready.then(() => {
      if (!gone) measure();
    });

    return () => {
      gone = true;
      io.disconnect();
      flowIo.disconnect();
      pinned.removeEventListener("change", arrange);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(raf);
    };
  }, [n]);

  return (
    <div className="log" ref={rootRef} data-down="0" style={{ "--n": n } as React.CSSProperties}>
      <div className="log-sticky">
        <div className="log-head">
          {children}
          <p className="log-kicker" aria-hidden="true">
            Case log · {n} files
          </p>
        </div>

        {/* The pinned layout: the rail and the desk. */}
        <ol className="log-rail" aria-hidden="true">
          {entries.map((e, i) => (
            <li key={e.title} className="log-station" style={{ "--k": i } as React.CSSProperties}>
              <span className="log-dot" />
              <span className="log-when">
                {e.kind} · {e.period}
              </span>
              <span className="log-what">{e.title}</span>
            </li>
          ))}
        </ol>
        <ol className="log-desk">
          {entries.map((e, i) => {
            const pile = PILE[i % PILE.length];
            const { sx, sy } = spreadAt(i, n);
            return (
              <li
                key={e.title}
                className="logfile"
                style={
                  {
                    "--k": i,
                    "--rot": `${pile.rot}deg`,
                    "--px": `${pile.px}px`,
                    "--py": `${pile.py}px`,
                    "--sx": `${sx}%`,
                    "--sy": `${sy}%`,
                  } as React.CSSProperties
                }
              >
                <File e={e} i={i} />
              </li>
            );
          })}
        </ol>

        {/* The flowing layout: the same entries down a rail. */}
        <ol className="logflow">
          {entries.map((e, i) => (
            <li key={e.title} className="logflow-item">
              <span className="logflow-dot" aria-hidden="true" />
              <div className="logfile logfile-flow">
                <File e={e} i={i} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
