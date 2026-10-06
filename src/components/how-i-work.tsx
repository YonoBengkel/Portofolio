import { howIWork } from "@/content/site";

// The same three flowchart symbols as the hero drawing, small: a process box,
// a data store and a decision, in the order of the three steps.
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

export function HowIWork() {
  return (
    <ol className="mt-10 grid gap-12 sm:gap-14">
      {howIWork.map((step, i) => (
        <li key={step.title} className="reveal grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-8">
          <div className="recede">
            <MethodShape kind={KINDS[i]} />
          </div>
          <div>
            <h3 className="display text-[1.6rem] sm:text-[1.9rem]">{step.title}</h3>
            <p className="mt-3 max-w-[32rem] leading-relaxed text-ash">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
