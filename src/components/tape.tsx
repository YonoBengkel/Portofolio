/**
 * Hazard tape.
 *
 * The divider between sections, striped like the tape across a doorway you are not
 * supposed to walk through. It is the accent doing a second job: yellow and near-black
 * at 45 degrees is the one pattern everyone already reads as "something is happening
 * here", and it costs no asset - it is a repeating-linear-gradient.
 *
 * It only runs once the switch is on, and the words are hidden from the accessibility
 * tree because the heading underneath says the same thing.
 */
export function Tape({ text, tilt = -2 }: { text: string; tilt?: number }) {
  // Fourteen, not ten. The keyframe moves the strip by half its width, so that half has
  // to be at least as wide as the strip's 108vw - and at ten it measured 1846px against
  // 2076px at a 1920 window, so the last tenth of every cycle was bare stripe.
  const run = Array.from({ length: 14 }, (_, i) => (
    <span key={i}>
      {text} <span aria-hidden="true">✦</span>
    </span>
  ));

  // The strip is wider than the window so the tilt never exposes a bare corner, and the slot
  // clips it so the document itself is never wider than the viewport.
  return (
    <div className="tape-slot marquee-run" role="presentation">
      <div className="tape" style={{ rotate: `${tilt}deg` }}>
        <div className="tape-run" aria-hidden="true">
          {run}
          {run}
        </div>
      </div>
    </div>
  );
}
