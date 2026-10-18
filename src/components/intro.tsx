import { Logo } from "./logo";

/**
 * The title sequence: a dot that spins up into the mark, then slides aside and lets the
 * name out of itself.
 *
 * The move fits this mark rather than being imposed on it. A four-fold shape spun fast
 * at small size blurs into a disc, so the dot is not a stand-in for the logo - it is the
 * logo, going too fast to read. And the diamond is cut by a vertical slot, which is an
 * aperture; the words have somewhere to come from. The same sequence on a wordmark or an
 * asymmetric glyph would be a trick.
 *
 * It is CSS alone, and that is a safety property rather than a preference. The whole
 * sequence is one set of keyframes ending in `visibility: hidden; pointer-events: none`
 * with a forwards fill, so it finishes and uncovers the page whatever happens to the
 * script - including the script never running at all. An overlay that needs JavaScript
 * to get out of the way is a door, not a welcome.
 *
 * What the script in layout.tsx does is only ever to take it away sooner: it is not
 * drawn at all on a second visit in the same session, on any page but the home page, or
 * under prefers-reduced-motion. It cannot be clicked away - Ilham asked for that, having
 * found he could not photograph it - so ?intro forces it to play again on demand, which
 * is what the skip was being used for.
 *
 * Hidden from the accessibility tree. Everything it says - the name, the three words -
 * is in the hero behind it, in text, and a screen reader should be reading that.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-stage">
        <span className="intro-ring" />
        <span className="intro-mark">
          <Logo size={112} />
        </span>
        <p className="intro-words">
          <b>Ilham Satria</b>
          <span>Process &middot; Data &middot; Decisions</span>
        </p>
      </div>
    </div>
  );
}
