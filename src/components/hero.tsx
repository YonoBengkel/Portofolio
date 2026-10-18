import Link from "next/link";
import { RunSwitch } from "@/components/run-switch";
import { openTo, profile } from "@/content/site";

/**
 * One screen: the name at the size of a poster, what he does, and two ways in - and a
 * switch that swaps the whole ground underneath it.
 *
 * Flipping it brings nine full-bleed bands in along their own diagonals, and the name
 * goes down into the floor letter by letter rather than fading out. Those are two
 * different things and the difference is the whole feel: a fade says the text stopped
 * existing, a sink says it went somewhere. Each letter rides inside its own clipped
 * slot, so what you see is a letter sliding under a line, not dissolving on the spot.
 *
 * There are no permanent corner bands. They were tried and removed: a strip cropped into
 * the corner of an otherwise empty page reads as something that failed to get out of the
 * way rather than as a deliberate mark.
 *
 * The split text is hidden from the accessibility tree and the real string sits beside
 * it, because a screen reader given one letter per element reads out one letter at a
 * time.
 */

/*
  The ground is a lattice, not a stack.

  It used to be two sets of near-parallel strips separated by even cream gaps, because an
  even gap is only possible between strips that are parallel. That constraint is gone:
  the bands now cross each other outright, the way tape actually lands on a floor, and the
  cream is whatever triangle no band happens to cover. Nothing here is a gap, so nothing
  here can be a wedge - the failure mode that shaped the last four versions of this file
  does not exist in this arrangement.

  Each band carries its own tilt and its own height up the hero, and they overlap freely.
  Two rules hold it together:

    - z is given per band rather than derived from the tilt. The order it encodes was
      specified crossing by crossing, and one pair of it could not be honoured: the
      bottom three ask for Evidence over Process, Process over Decisions, and Decisions
      over Evidence, which is a cycle. Real tape can do that - it is what a weave is -
      but a flat layer cannot, since each element has one z and nothing else. The cycle
      is broken at its least visible link: Evidence and the lower Decisions overlap over
      0.3% of the screen, against 3.9% and 5.4% for the other two crossings;
    - the words run along the band, and the direction alternates, so the lattice reads as
      several lines of tape moving past each other rather than one sheet scrolling;
    - pad is the band's own thickness, in rem of padding around the same type. No two
      are equal and the spread is small on purpose: 210 to 226px, a seventh between the
      thinnest and the thickest, which reads as tape cut by hand rather than as a set of
      deliberately different widths.

  side is which edge a band comes in from, +1 for the left and -1 for the right. It is
  not a shared direction: the bands arrive from both sides at once, which is what stops
  the entry reading as one sheet being dragged on.

  cos is cos(tilt) precomputed, because how far a band must slide to leave the window
  depends on its angle and CSS has no trigonometry.
*/
const BANDS = [
  { word: "Process", tilt: -13, y: 0.1, side: 1, reverse: false, z: 5, pad: 1.35 },
  { word: "Data", tilt: 6, y: 0.26, side: -1, reverse: true, z: 6, pad: 1.7 },
  { word: "Decisions", tilt: -5, y: 0.42, side: 1, reverse: false, z: 4, pad: 1.45 },
  { word: "Evidence", tilt: 16, y: 0.57, side: -1, reverse: true, z: 3, pad: 1.85 },
  { word: "Process", tilt: -9, y: 0.74, side: 1, reverse: false, z: 2, pad: 1.55 },
  { word: "Decisions", tilt: 4, y: 0.9, side: -1, reverse: true, z: 1, pad: 1.75 },
].map((b) => ({ ...b, cos: Math.cos((b.tilt * Math.PI) / 180) }));

// Enough repeats that half a track is wider than any window, since the keyframe moves
// each band by half its own width - the same arithmetic as every other marquee here.
const PER_BAND = 8;

/*
  Which words come out in the accent. Not Math.random: the server and the browser have to
  agree on the markup or React replaces it on hydration, and a wall that reshuffles itself
  on every render is a different thing from one that looks hand-placed. This is a fixed
  pattern chosen to have no visible period - the gaps run 3, 4, 2, 5, 3 - so it reads as
  irregular without being unstable.
*/
const LIT = new Set([2, 6, 9, 15, 19]);

function Band({ band, i }: { band: (typeof BANDS)[number]; i: number }) {
  const { word, tilt, y, side, reverse, cos, z, pad } = band;
  return (
    <div
      className="hero-band"
      style={
        {
          "--i": i,
          "--tilt": `${tilt}deg`,
          "--y": `${y * 100}svh`,
          "--side": side,
          "--cos": cos.toFixed(4),
          "--z": z,
          "--pad": `${pad}rem`,
          "--dir": reverse ? "reverse" : "normal",
        } as React.CSSProperties
      }
    >
      <div className="hero-band-in">
        <div className="hero-band-run">
          {[0, 1].map((copy) => (
            <span className="hero-band-set" key={copy}>
              {Array.from({ length: PER_BAND }, (_, k) => (
                <b key={k} className={LIT.has((i * 3 + k) % 21) ? "lit" : undefined}>
                  {word}
                </b>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * One line of hero copy, cut into pieces that each sink into their own slot. `--i` is the
 * piece's place in the queue and `--n` the length, so the stagger can run forwards going
 * down and backwards coming back up.
 */
function Sink({
  text,
  by = "letter",
  lead = 0,
  total,
}: {
  text: string;
  by?: "letter" | "word";
  lead?: number;
  total?: number;
}) {
  const pieces = by === "word" ? text.split(" ") : [...text];
  /*
    --n is the length of the whole queue, not of this line. The two lines of the name are
    one queue - the second carries a `lead` so its pieces keep counting on from the first
    - and the rise reads `--n - --i` to run the stagger backwards. With --n set per line,
    the second line's indices ran past its own length and that subtraction went negative:
    "Satria" started 84ms before the wait it was supposed to sit behind, which put it back
    on screen while the tape was still crossing it. A line that is its own queue can leave
    `total` out.
  */
  return (
    <span className="sink-line" style={{ "--n": total ?? pieces.length } as React.CSSProperties}>
      {pieces.map((piece, i) =>
        piece === " " ? (
          <span key={i}> </span>
        ) : (
          <span className="sink" key={i} style={{ "--i": i + lead } as React.CSSProperties}>
            <span>{piece}</span>
            {by === "word" && i < pieces.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        ),
      )}
    </span>
  );
}

export function Hero() {
  const words = profile.name.split(" ");
  const first = words.slice(0, 2).join(" ");
  const last = words.slice(2).join(" ");
  // Both lines of the name are one queue, so they share its length.
  const queue = [...first].length + [...last].length;

  return (
    <section className="hero frame" aria-label="Introduction">
      <div className="dots" aria-hidden="true" />

      <div className="hero-alt marquee-run" aria-hidden="true">
        {BANDS.map((band, i) => (
          <Band key={`${band.word}-${i}`} band={band} i={i} />
        ))}
      </div>

      <div className="hero-copy">
        <h1 className="display hero-name">
          <span className="sr-only">{profile.name}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={first} total={queue} />
            <br />
            <span className="marker marker-split">
              <Sink text={last} lead={first.length} total={queue} />
            </span>
          </span>
        </h1>

        <RunSwitch />

        <p className="hero-role">
          <span className="sr-only">{profile.label}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={profile.label} by="word" />
          </span>
        </p>

        <p className="hero-line">
          <span className="sr-only">{profile.tagline}</span>
          <span className="hero-out" aria-hidden="true">
            <Sink text={profile.tagline} by="word" />
          </span>
        </p>

        {/* These two are not split, so they go down as blocks inside their own clip. */}
        <div className="sink-block hero-out mt-10">
          <div className="hero-cta">
            <Link href="/work" className="pill pill-solid">
              See the work
            </Link>
            <Link href="/cv" className="pill">
              Download CV
            </Link>
          </div>
        </div>
        <div className="sink-block hero-out mt-8">
          <p className="meta opacity-70">{openTo}</p>
        </div>
      </div>
    </section>
  );
}
