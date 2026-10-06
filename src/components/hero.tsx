import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { profile } from "@/content/site";

// The route through the three flowchart symbols behind the name: a process box,
// a data store and a decision, in the same order as "How I work".
// It is drawn once on load, piece by piece (start and duration in seconds), with CSS only.
// With reduced motion, or before the CSS applies, the finished drawing is simply there.
const ROUTE = [
  { d: "M40 40H400V250H40Z", start: 0, dur: 0.55 },
  { d: "M400 145H560V174", start: 0.5, dur: 0.2 },
  { d: "M450 200A110 26 0 1 0 670 200A110 26 0 1 0 450 200", start: 0.68, dur: 0.35 },
  { d: "M450 200V420A110 26 0 0 0 670 420V200", start: 0.72, dur: 0.45 },
  { d: "M670 330H760", start: 1.12, dur: 0.18 },
  { d: "M760 330L910 180L1060 330L910 480Z", start: 1.28, dur: 0.6 },
];
// Each echo starts a moment after the one above it, so the stack draws like a wave.
const ECHO_DELAY = 0.022;

// Each outline is repeated a few pixels lower and fainter, like a stack of tracing paper.
const ECHOES = 14;
const ECHO_STEP = 3.2;

export function Hero({ hasCv }: { hasCv: boolean }) {
  const words = profile.name.split(" ");
  const lamp = ROUTE.length - 1; // the decision diamond: the one warm thing on the page

  return (
    <>
      <section className="lit">
        <div className="column pb-24 pt-32 sm:pb-32 sm:pt-40">
          <div className="hero-art recede">
            <svg viewBox="0 0 1100 530" className="route route-draw absolute inset-0 h-full w-full" aria-hidden>
              {Array.from({ length: ECHOES }, (_, k) => (
                <g key={k} transform={`translate(0 ${k * ECHO_STEP})`} opacity={1 - k * 0.066}>
                  {ROUTE.map((piece, i) => (
                    <path
                      key={piece.d}
                      d={piece.d}
                      className={k === 0 && i === lamp ? "lamp" : undefined}
                      pathLength={1}
                      style={{ "--d": `${(piece.start + k * ECHO_DELAY).toFixed(3)}s`, "--t": `${piece.dur}s` } as CSSProperties}
                    />
                  ))}
                </g>
              ))}
            </svg>
            <h1 className="hero-name">
              {words.map((word, i) => (
                <Fragment key={word}>
                  {i > 0 && " "}
                  <span className={`w${i + 1}`}>{word}</span>
                </Fragment>
              ))}
            </h1>
          </div>

          <p className="mt-12 max-w-[32rem] text-[1.1rem] leading-relaxed sm:text-[1.2rem]">{profile.tagline}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-solid" transitionTypes={["nav-forward"]}>
              See the work
            </Link>
            {hasCv && (
              <Link href="/cv" className="btn btn-line" transitionTypes={["nav-forward"]}>
                CV
              </Link>
            )}
            <Link href="/contact" className="btn btn-line" transitionTypes={["nav-forward"]}>
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
