import type { CSSProperties } from "react";

/**
 * Experience and education in one numbered list.
 *
 * Alief runs these as a single section and Ilham asked for the same, but his three kinds of
 * entry are not interchangeable the way a list of cloud jobs is: a paid internship, a seat in a
 * student organisation and a degree make very different claims. So each entry carries its kind
 * as a chip. A reader scanning for work experience can find it without reading every card, and
 * nothing is dressed up as something it is not.
 *
 * Work first, then the organisations, then the degree — the order a hiring reader looks in.
 */
export type TimelineEntry = {
  kind: "Work" | "Organisation" | "Education";
  title: string;
  org: string;
  period: string;
  body: string;
};

export function Timeline({ entries, dark = false }: { entries: TimelineEntry[]; dark?: boolean }) {
  return (
    <ol className="stagger grid gap-5">
      {entries.map((e, i) => (
        <li
          key={`${e.title}-${e.period}`}
          className={`entry sticker ${dark ? "sticker-ink" : ""}`}
          style={{ "--i": i } as CSSProperties}
        >
          <p className="entry-n">{String(i + 1).padStart(2, "0")}</p>
          <div>
            <p className="entry-head">
              <span className={`chip ${e.kind === "Work" ? "chip-live" : ""}`}>{e.kind}</span>
              <span className="meta opacity-80">{e.period}</span>
            </p>
            <h3 className="work-title mt-3">{e.title}</h3>
            <p className="mt-1 opacity-80">{e.org}</p>
            <p className="mt-4 leading-relaxed">{e.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Built once, used by the home page and by /about. */
export function buildTimeline(
  experience: { role: string; org: string; period: string; points: string[] }[],
  leadership: { role: string; org: string; period: string; body: string }[],
  education: { degree: string; school: string; period: string; coursework: string },
): TimelineEntry[] {
  return [
    ...experience.map((e) => ({
      kind: "Work" as const,
      title: e.role,
      org: e.org,
      period: e.period,
      body: e.points.join(" "),
    })),
    ...leadership.map((l) => ({
      kind: "Organisation" as const,
      title: l.role,
      org: l.org,
      period: l.period,
      body: l.body,
    })),
    {
      kind: "Education" as const,
      title: education.degree,
      org: education.school,
      period: education.period,
      body: education.coursework,
    },
  ];
}
