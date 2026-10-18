import { toolbox } from "@/content/site";
import { ToolMark } from "./tool-marks";

/**
 * Tools and skills: the reference's movement carrying the other reference's object,
 * which is exactly the split Ilham asked for.
 *
 * The movement is Alief's - two rows running past each other in opposite directions at
 * a measured 50 px/s, with a 150px gradient the colour of the band masking each end so
 * the rows dissolve into the page instead of being cut off. 50 px/s is slow on purpose;
 * it was measured, not guessed, and it reads as drift rather than as a ticker.
 *
 * The object is a tile: a square box holding the mark, with the name set underneath it.
 * It was a pill carrying both on one line, and the split is Ilham's - a logo and a word
 * inside one oval have to share a baseline, which makes the mark read as a bullet point
 * rather than as the thing being named. Stacked, the box is the object and the word is
 * its caption. Marks that exist render inside the box; the rest fall back to their first
 * letter at the same size (see tool-marks.tsx).
 *
 * The rows are not labelled. Ilham asked for one set rather than two named groups, so the
 * sixteen tools are dealt into two rows of eight and the heading above speaks for all of
 * them. The deal is by position, not by category, so the two rows stay the same length
 * however the list in site.ts grows.
 *
 * The animation is a plain CSS keyframe over a track holding the set twice, so one cycle
 * is exactly one set and the seam never shows. The duration is computed per row from the
 * measured chip-width formula rather than fixed, so both rows really do run at 50 px/s
 * however many tools end up in them.
 */

/*
  A tile is as wide as whichever is wider: its box, or the name under it. The duration of
  each row is computed from the total, so the belt holds its measured 50 px/s however the
  list in site.ts grows - a fixed duration would drift the moment a tool is added.

  TILE and CHAR_W are checked against the rendered width rather than assumed; see the
  note on setWidth.
*/
const TILE = 60; // the box, and the floor on a tile's width
const CHAR_W = 7.2; // one character of the name, mono at 0.7rem with its letter-spacing
const GAP = 22; // tiles need more air between them than pills did
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
  return items.reduce((w, item) => w + Math.max(TILE, CHAR_W * item.length) + GAP, 0);
}

function Chip({ label }: { label: string }) {
  return (
    <span className="chip-tool">
      <span className="chip-box">
        <ToolMark tool={label} size={26} />
      </span>
      <span className="chip-name">{label}</span>
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
  // One list, dealt alternately into two rows so both stay the same length whatever the
  // content file holds. The group names stay in site.ts for the about page, which still
  // shows them as what they are: four kinds of work rather than one heap.
  const all = toolbox.flatMap((group) => group.items);
  const rows: string[][] = [[], []];
  all.forEach((item, i) => rows[i % 2].push(item));

  return (
    <div className="belts">
      {rows.map((items, i) => (
        <Row key={i} items={items} reverse={i === 1} />
      ))}
    </div>
  );
}
