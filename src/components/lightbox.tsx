"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string; caption: string };

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
 */
export function Lightbox() {
  const ref = useRef<HTMLDialogElement>(null);
  const [shot, setShot] = useState<Shot | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as HTMLElement | null)?.closest?.("[data-zoom-src]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      setShot({
        src: el.getAttribute("data-zoom-src") ?? "",
        alt: el.getAttribute("data-zoom-alt") ?? "",
        caption: el.getAttribute("data-zoom-caption") ?? "",
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (shot && !dialog.open) dialog.showModal();
  }, [shot]);

  const close = useCallback(() => {
    ref.current?.close();
  }, []);

  return (
    <dialog ref={ref} className="zoom" onClose={() => setShot(null)} aria-label="Full-size picture">
      {shot && (
        <>
          {/* Clicking anywhere outside the picture closes it, which is what everyone
              tries first; the button is there for anyone who does not. */}
          <button type="button" className="zoom-field" onClick={close} aria-label="Close the picture" />
          <figure className="zoom-figure">
            {/* A plain img: the source is already an optimised asset and next/image would
                only re-wrap something that is being shown at its natural size. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={shot.src} alt={shot.alt} />
            {shot.caption && <figcaption className="meta">{shot.caption}</figcaption>}
          </figure>
          <button type="button" className="zoom-close" onClick={close}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </>
      )}
    </dialog>
  );
}
