"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Shot = { src: string; alt: string; caption: string };

/**
 * One viewer for every picture on the site: the case-study figures and the certificate
 * scans both open here.
 *
 * It is a real `<dialog>`, opened with showModal(), and that is the whole reason this
 * component exists. The browser then gives Escape, the focus trap, the inert background
 * and the backdrop for free - and Escape was the thing that was missing. A figure used to
 * be an `<a href>` to the image file, which navigated away from the page entirely: there
 * was nothing to press Escape on, only a back button, and the curtain in curtain.tsx was
 * intercepting the click as a same-origin navigation on its way there.
 *
 * Anything on the page can open it by carrying `data-zoom-src`; this listens on the
 * document rather than being wired at each call site. That listener runs in the capture
 * phase for the same reason the curtain's does - so the curtain does not treat a zoom as
 * a page change first.
 *
 * A trigger can carry a whole set instead, as JSON in `data-zoom-set`: the chess cell in
 * the certificates grid stands for three tournaments, so it opens on the first scan with
 * Previous and Next, and the arrow keys, to the other two. Added 9 Nov 2026.
 */
export function Lightbox() {
  const ref = useRef<HTMLDialogElement>(null);
  const [view, setView] = useState<{ shots: Shot[]; at: number } | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as HTMLElement | null)?.closest?.("[data-zoom-src], [data-zoom-set]");
      if (!el) return;
      let shots: Shot[] = [];
      const set = el.getAttribute("data-zoom-set");
      if (set) {
        try {
          shots = (JSON.parse(set) as Shot[]).filter((s) => s && typeof s.src === "string" && s.src);
        } catch {
          shots = [];
        }
      } else {
        shots = [
          {
            src: el.getAttribute("data-zoom-src") ?? "",
            alt: el.getAttribute("data-zoom-alt") ?? "",
            caption: el.getAttribute("data-zoom-caption") ?? "",
          },
        ];
      }
      if (!shots.length || !shots[0].src) return;
      e.preventDefault();
      e.stopPropagation();
      setView({ shots, at: 0 });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (view && !dialog.open) dialog.showModal();
  }, [view]);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  const step = useCallback((by: number) => {
    setView((v) => (v && v.shots.length > 1 ? { ...v, at: (v.at + by + v.shots.length) % v.shots.length } : v));
  }, []);

  const shot = view ? view.shots[view.at] : null;
  const many = !!view && view.shots.length > 1;

  return (
    <dialog
      ref={ref}
      className="zoom"
      onClose={() => setView(null)}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          step(1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          step(-1);
        }
      }}
      aria-label={many ? "Full-size pictures" : "Full-size picture"}
    >
      {view && shot && (
        <>
          {/* Clicking anywhere outside the picture closes it, which is what everyone
              tries first; the button is there for anyone who does not. */}
          <button type="button" className="zoom-field" onClick={close} aria-label="Close the picture" />
          <figure className="zoom-figure">
            {/* A plain img: the source is already an optimised asset and next/image would
                only re-wrap something that is being shown at its natural size. The key
                makes a step to the next scan a new image rather than a src swap, so the
                old one is not left on screen while the new one loads. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={shot.src} src={shot.src} alt={shot.alt} />
            {(shot.caption || many) && (
              <figcaption className="caption zoom-cap">
                {many && (
                  <span className="zoom-count" aria-live="polite">
                    {view.at + 1} / {view.shots.length}
                  </span>
                )}
                {shot.caption}
              </figcaption>
            )}
          </figure>
          {/* Outside the figure, so its caption stays its last child; pinned top left,
              opposite the close button. */}
          {many && (
            <div className="zoom-steps">
              <button type="button" className="zoom-step" onClick={() => step(-1)}>
                <span aria-hidden="true">←</span> Previous
              </button>
              <button type="button" className="zoom-step" onClick={() => step(1)}>
                Next <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
          <button type="button" className="zoom-close" onClick={close}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </>
      )}
    </dialog>
  );
}
