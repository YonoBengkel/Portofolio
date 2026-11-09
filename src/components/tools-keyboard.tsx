"use client";

import { useEffect, useRef, useState } from "react";
import { KEY_COLUMNS, keyTools, type KeyTool } from "@/content/keyboard-tools";
import type { KeyboardHandle } from "./keyboard-3d";
import { ToolMark } from "./tool-marks";

/**
 * Tools and skills as Naresh Khatri's 3D keyboard, with Ilham's own tools on the keys.
 *
 * The page always starts with a plain grid of the same keys - the tools as a list,
 * which is what a screen reader reads and what anyone without WebGL, or with reduced
 * motion, keeps. When the section is a screen and a half away the 3D module is fetched
 * (three.js is the heaviest thing on the site, so it is never in the first load), and
 * once the board has drawn, the grid steps back to being a list for assistive technology
 * only and the keyboard takes its place. Ilham was fine with the weight: by the time a
 * visitor scrolls this far there has been plenty of time to load it.
 *
 * The keys drop into the board the first time it comes into view. After that a key
 * goes down under the pointer, under a finger, or from the real keyboard - the rows are
 * 1-6, Q-Y, A-H and Z-N, only while the section is on screen and never while typing in
 * a field - and the screen says which tool it is. A click, a tap or a real key also
 * clicks; hovering is silent.
 *
 * The screen is a strip at the top of the stage. From 760px, once the board has drawn,
 * it moves onto the board - a display standing on the back of the case, drawn by
 * keyboard-3d.ts at the board's own angle, as Ilham asked on 9 Nov 2026 - and the strip
 * keeps its place but goes invisible, so nothing on the page moves when it does. Below
 * 760px the text on the board would be too small to read, so the strip stays.
 */
const SCREEN_QUERY = "(min-width: 760px)";
const CODES = [
  ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6"],
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN"],
].flat();

function Mark({ tool, size }: { tool: KeyTool; size: number }) {
  if (tool.official) return <ToolMark tool={tool.name} size={size} uid="key" />;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <path d={tool.path} fill={tool.dark ? "#20232a" : "#ffffff"} />
    </svg>
  );
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));

export function ToolsKeyboard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const stripRef = useRef<HTMLParagraphElement>(null);
  const handle = useRef<KeyboardHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const grid = gridRef.current;
    if (!wrap || !canvas || !grid) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) return;
    let cancelled = false;
    let inView = false;
    let press: HTMLAudioElement | null = null;
    let release: HTMLAudioElement | null = null;

    const play = (down: boolean) => {
      const a = down ? press : release;
      if (!a) return;
      const c = a.cloneNode() as HTMLAudioElement;
      c.volume = 0.35;
      c.play().catch(() => {});
    };

    const start = async () => {
      try {
        const { mountKeyboard } = await import("./keyboard-3d");
        if (cancelled) return;
        // Each key's mark as a document of its own: the grid already has them drawn.
        const logos = [...grid.querySelectorAll<SVGSVGElement>(".tk-mark svg")].map((svg) => {
          const copy = svg.cloneNode(true) as SVGSVGElement;
          copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          copy.setAttribute("width", "256");
          copy.setAttribute("height", "256");
          return new XMLSerializer().serializeToString(copy);
        });
        const h = await mountKeyboard({
          canvas,
          logos,
          colors: keyTools.map((t) => t.hex),
          columns: KEY_COLUMNS,
          still: false,
          onSelect: (i) => setSel(i),
          screen: {
            labels: keyTools.map((t) => ({ name: t.name, group: t.group })),
            idle: `${keyTools.length} tools · hover, tap, or type a key`,
            font: stripRef.current ? getComputedStyle(stripRef.current).fontFamily : "monospace",
            query: SCREEN_QUERY,
          },
        });
        if (cancelled) return h.dispose();
        handle.current = h;
        press = new Audio("/assets/keyboard/press.mp3");
        release = new Audio("/assets/keyboard/release.mp3");
        setReady(true);
        if (inView) h.reveal();
      } catch (err) {
        // No WebGL, a lost context, a failed fetch: the grid simply stays.
        console.warn("Tools keyboard unavailable", err);
      }
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: "150% 0px" },
    );
    near.observe(wrap);
    const seen = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) handle.current?.reveal();
      },
      { threshold: 0.35 },
    );
    seen.observe(wrap);

    const down = (e: KeyboardEvent) => {
      if (!inView || !handle.current || e.repeat || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      const i = CODES.indexOf(e.code);
      if (i < 0 || i >= keyTools.length) return;
      handle.current.press(i, true, `key:${e.code}`);
      play(true);
    };
    const up = (e: KeyboardEvent) => {
      if (!handle.current || !CODES.includes(e.code)) return;
      handle.current.press(-1, false, `key:${e.code}`);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (e.target === canvas) play(true);
    };
    addEventListener("keydown", down);
    addEventListener("keyup", up);
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelled = true;
      near.disconnect();
      seen.disconnect();
      removeEventListener("keydown", down);
      removeEventListener("keyup", up);
      canvas.removeEventListener("pointerdown", onPointerDown);
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  const on = sel !== null ? keyTools[sel] : null;

  return (
    <div className="tk" ref={wrapRef} data-ready={ready ? "" : undefined}>
      <div className="tk-stage">
        <p className="kb-screen tk-screen" ref={stripRef} aria-hidden="true">
          <span className="kb-prompt">&gt;</span>{" "}
          {on ? (
            <>
              <b>{on.name}</b> <span className="kb-dim">· {on.group}</span>
            </>
          ) : (
            <span className="kb-dim">{keyTools.length} tools · hover, tap, or type a key</span>
          )}
          <span className="kb-caret" />
        </p>
        <div className="tk-pad">
          <canvas ref={canvasRef} className="tk-canvas" aria-hidden="true" />
          <ul className="tk-grid" ref={gridRef} aria-label="Tools">
            {keyTools.map((t) => (
              <li
                key={t.name}
                className="tk-key"
                data-light={t.dark || t.official ? "" : undefined}
                style={{ "--cap": t.hex } as React.CSSProperties}
              >
                <span className="tk-mark">
                  <Mark tool={t} size={30} />
                </span>
                <span className="tk-name">{t.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="tk-hint" aria-hidden="true">
        Keys 1–6, Q–Y, A–H and Z–N press the rows.
      </p>
    </div>
  );
}
