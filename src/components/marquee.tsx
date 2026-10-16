/**
 * A divider that says what is coming next, running across the page.
 *
 * Both reference sites use one between sections. The text is duplicated so the loop has
 * no seam, and the copy is hidden from the accessibility tree because the heading
 * underneath already says it.
 *
 * `repeat` has to be high enough that one run is wider than the window, because the
 * keyframe moves the track by half its width: too few and the words run out before the
 * loop wraps, leaving bare page for the last part of every cycle.
 */
export function Marquee({ text, repeat = 12 }: { text: string; repeat?: number }) {
  const run = Array.from({ length: repeat }, (_, i) => (
    <span key={i}>
      {text} <span aria-hidden="true">·</span>
    </span>
  ));

  return (
    <div className="marquee marquee-run" role="presentation">
      <div className="marquee-track" aria-hidden="true">
        {run}
        {run}
      </div>
    </div>
  );
}
