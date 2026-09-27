import { Fragment, type CSSProperties } from "react";
import { howIWork, profile } from "@/content/site";

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

type Kind = "process" | "data" | "decision";
const KINDS: Kind[] = ["process", "data", "decision"];

const SMALL: Record<Kind, string[]> = {
  process: ["M4 6H116V50H4Z"],
  data: ["M24 12A36 8 0 1 0 96 12A36 8 0 1 0 24 12", "M24 12V44A36 8 0 0 0 96 44V12"],
  decision: ["M22 30L60 4L98 30L60 56Z"],
};

function MethodShape({ kind }: { kind: Kind }) {
  return (
    <svg viewBox="0 0 120 68" className="route h-14 w-auto" aria-hidden>
      {Array.from({ length: 5 }, (_, k) => (
        <g key={k} transform={`translate(0 ${k * 2.2})`} opacity={1 - k * 0.19}>
          {SMALL[kind].map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      ))}
    </svg>
  );
}

export function Hero({ hasCv }: { hasCv: boolean }) {
  const words = profile.name.split(" ");

  return (
    <section className="bg-mist">
      <div className="frame pb-20 pt-28 sm:pb-24 sm:pt-32">
        <div className="hero-art">
          <svg viewBox="0 0 1100 530" className="route route-draw absolute inset-0 h-full w-full" aria-hidden>
            {Array.from({ length: ECHOES }, (_, k) => (
              <g key={k} transform={`translate(0 ${k * ECHO_STEP})`} opacity={1 - k * 0.066}>
                {ROUTE.map((piece) => (
                  <path
                    key={piece.d}
                    d={piece.d}
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

        <p className="mx-auto mt-10 max-w-[36rem] text-center text-[1.2rem] font-medium leading-relaxed sm:text-[1.35rem]">
          {profile.tagline}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="#work" className="btn btn-solid">
            Read the case studies
          </a>
          {hasCv && (
            <a href={profile.cvPath} className="btn btn-line">
              Download CV
            </a>
          )}
          <a href={`mailto:${profile.email}`} className="btn btn-line">
            Email me
          </a>
        </div>

        <div className="mx-auto mt-24 max-w-[1100px]">
          <h2 className="sr-only">How I work</h2>
          <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {howIWork.map((step, i) => (
              <li key={step.title}>
                <MethodShape kind={KINDS[i]} />
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-graphite">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
