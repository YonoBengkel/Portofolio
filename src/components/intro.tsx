import { Logo } from "./logo";

/**
 * The title sequence: a dot that spins up into the mark, then slides aside and lets the
 * name out of itself - and then waits for a click.
 *
 * The move fits this mark rather than being imposed on it. A four-fold shape spun fast
 * at small size blurs into a disc, so the dot is not a stand-in for the logo - it is the
 * logo, going too fast to read. And the diamond is cut by a vertical slot, which is an
 * aperture; the words have somewhere to come from. The same sequence on a wordmark or an
 * asymmetric glyph would be a trick.
 *
 * Ilham asked for an intro that ends when he clicks and not before, which turns it from
 * something that gets out of the way into something you open. Two consequences, and both
 * are deliberate:
 *
 * The first 3500ms cannot be skipped. A click during the sequence does nothing at all -
 * this is the same request as last time, where a screenshot could dismiss it and he
 * could not photograph what he wanted to point at. At 3500ms the cue appears and the
 * click starts working, in one step, so the cue never offers something that is not there.
 *
 * And it no longer takes itself away. The whole sequence used to end in visibility:
 * hidden with a forwards fill, which opened the page even if the script never ran; now
 * only the script can end it. That is a real risk, and it is covered twice. The noscript
 * rule below removes the overlay entirely when scripting is off - unlayered, so it beats
 * the .intro rule inside @layer components no matter what that rule says. And for the
 * case noscript cannot see, scripting enabled but this one inline script blocked by a
 * CSP or an extension, globals.css gives html:not([data-intro]) .intro a lift at 4000ms.
 * A visitor never meets a door that cannot be opened.
 *
 * ?intro replays the whole thing on demand, which is what the old skip gesture was
 * actually being used for. It leaves by the ink panel that sweeps over the composition
 * and carries on off the top, which is the move the site already makes between pages;
 * ?intro=paper replays it with the other exit, where the sheet peels itself off the hero
 * instead and .intro-sweep is simply never animated.
 *
 * Hidden from the accessibility tree. Everything it says - the name, the three words -
 * is in the hero behind it, in text, and a screen reader should be reading that. Enter
 * and Space end it as well as a click, so the overlay is not a trap for anyone who is
 * not using a pointer.
 */
export function Intro() {
  return (
    <>
      <div className="intro" aria-hidden="true">
        <noscript>
          <style>{".intro{display:none}"}</style>
        </noscript>
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
        <span className="intro-cue">Click anywhere to enter</span>
      </div>
      {/*
        A sibling, not a child, and that is load-bearing rather than tidy. Inside .intro
        it inherits visibility, and the ink style hides the paper the moment the ink
        finishes covering it - so the panel vanished on that frame instead of sweeping
        off, and the page appeared as if cut to. Visibility is inherited; z-index 96 is
        what keeps it over the paper.
      */}
      <span className="intro-sweep" aria-hidden="true" />
    </>
  );
}
