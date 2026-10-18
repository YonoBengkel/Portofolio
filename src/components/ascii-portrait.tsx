"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { asciiPortraits } from "@/content/ascii-portraits";

/**
 * The portrait in the about card: Ilham drawn in characters, changing every few seconds,
 * and the photograph underneath when you put the cursor on it.
 *
 * The ASCII has no background. A portrait a hundred characters wide has no room to spend
 * on a room - rendered at the frame's real size, a busy background does not read as a
 * background, it reads as noise over the face, and taking it out is what turned a shape
 * into a person. The photograph on hover is the opposite case: it is a real picture at
 * real resolution, and a cut-out figure floating on paper there would look like a
 * mistake. So the ASCII is cut and the photograph is not; both are the same crop, so the
 * frame never jumps between them.
 *
 * Every frame is in the DOM at once and crossfades, rather than one node whose text is
 * replaced. Replacing text cannot be animated - it is a cut, and a cut between two
 * portraits reads as a glitch. It also means the photographs are already decoded when the
 * cursor arrives rather than starting to load under it.
 *
 * The characters are hidden from the accessibility tree: a screen reader given this would
 * read several thousand punctuation marks. The name is carried once, in text, beside it.
 */

// Long enough to look at one, short enough that a visitor sees a second before leaving.
const HOLD = 4200;

export function AsciiPortrait({ alt }: { alt: string }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (asciiPortraits.length < 2) return;
    // An animation with no end is exactly what this setting exists to stop, so it does
    // not start. The first portrait stays, and the hover still works.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setShown((n) => (n + 1) % asciiPortraits.length), HOLD);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="ascii-shot">
      <span className="sr-only">{alt}</span>
      {asciiPortraits.map((portrait, i) => (
        <pre key={i} className="ascii-frame" data-on={i === shown ? "" : undefined} aria-hidden="true">
          {portrait.ascii}
        </pre>
      ))}
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
