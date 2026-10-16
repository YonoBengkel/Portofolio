import { toolbox } from "@/content/site";

/**
 * Tools and skills: the reference's movement carrying the other reference's object,
 * which is exactly the split Ilham asked for.
 *
 * The movement is Alief's - two rows running past each other in opposite directions at
 * a measured 50 px/s, with a 150px gradient the colour of the band masking each end so
 * the rows dissolve into the page instead of being cut off. 50 px/s is slow on purpose;
 * it was measured, not guessed, and it reads as drift rather than as a ticker.
 *
 * The object is Toriq's - a pill chip, one hairline rule, mono at 12px, brand casing
 * kept, with a small round badge carrying the first letter. His own chips fall back to
 * that badge whenever a tool has no brand glyph; here every chip uses it, because the
 * alternative is importing twenty vendor logos, which drags foreign colour onto a page
 * that allows one accent and makes the claim "I know these logos" rather than "I use
 * these tools".
 *
 * What is NOT the reference's: his tile is a 100x100 square with a 2px border and a hard
 * offset shadow, and his heading is centred over the band. The heading here stays left
 * with the rule under it, like every other section on this site.
 *
 * The animation is a plain CSS keyframe over a track holding the set twice, so one cycle
 * is exactly one set and the seam never shows. The duration is computed per row from the
 * measured chip-width formula rather than fixed, so both rows really do run at 50 px/s
 * however many tools end up in them.
 */

// Toriq's measured width formula for a 12px IBM Plex Mono chip carrying a letter badge:
// 45px of box (padding, border, badge, gap) plus 7.68px per character. It matched every
// one of his own chips to within 0.01px, and this section uses the same type at the same
// size, so it is the right estimate to set the duration from.
const CHIP_BASE = 45;
const CHAR_W = 7.68;
const GAP = 8;
const SPEED = 50; // px per second, measured

/*
  Four copies, not two. The keyframe translates the track by -50%, so one cycle is half
  the track - and that half has to be at least as wide as the belt, or the row runs out
  of chips before it wraps. Measured at 1440: one set is 1135px against a 1425px belt, so
  the last fifth of every cycle was bare paper. Four copies make one cycle two sets, which
  clears a 1920 window with room over. The count must stay even or the loop seams.
*/
const COPIES = 4;

function setWidth(items: string[]) {
  return items.reduce((w, item) => w + CHIP_BASE + CHAR_W * item.length + GAP, 0);
}

function Chip({ label }: { label: string }) {
  return (
    <span className="chip-tool">
      <span className="chip-badge" aria-hidden="true">
        {label[0]}
      </span>
      {label}
    </span>
  );
}

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // One cycle covers COPIES / 2 sets, so the duration scales with it to hold 50 px/s.
  const seconds = Math.round(((setWidth(items) * COPIES) / 2 / SPEED) * 10) / 10;
  return (
    <div className="belt marquee-run">
      <div
        className="belt-track"
        style={
          {
            animationDuration: `${seconds}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        {/* One cycle translates by exactly half the track, which is COPIES / 2 sets. */}
        {Array.from({ length: COPIES }, (_, copy) => (
          <span className="belt-set" key={copy} aria-hidden={copy > 0 ? "true" : undefined}>
            {items.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Toolbelt() {
  // The four groups, paired into two rows the way the reference splits its own: what the
  // work is analysed and shown with on top, what it is built and shipped with underneath.
  const rows = [
    { label: `${toolbox[0].group} · ${toolbox[1].group}`, items: [...toolbox[0].items, ...toolbox[1].items] },
    { label: `${toolbox[2].group} · ${toolbox[3].group}`, items: [...toolbox[2].items, ...toolbox[3].items] },
  ];

  return (
    <div className="belts">
      {rows.map((row, i) => (
        <div key={row.label}>
          <div className="frame">
            <div className="column">
              <p className="belt-label">{row.label}</p>
            </div>
          </div>
          <Row items={row.items} reverse={i === 1} />
        </div>
      ))}
    </div>
  );
}
