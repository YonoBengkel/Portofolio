/**
 * A divider that says what is coming next, running across the page.
 *
 * Both reference sites use one between sections; it is the only thing on either page
 * that moves on its own. The text is duplicated so the loop has no seam, and the copy
 * is hidden from the accessibility tree because the heading underneath already says it.
 */
export function Marquee({ text, repeat = 8 }: { text: string; repeat?: number }) {
  const run = Array.from({ length: repeat }, (_, i) => (
    <span key={i}>
      {text} <span aria-hidden="true">·</span>
    </span>
  ));

  return (
    <div className="marquee" role="presentation">
      <div aria-hidden="true">
        {run}
        {run}
      </div>
    </div>
  );
}
