import { achievements, chess, competitions } from "@/content/site";
import type { Scan } from "@/content/site";
import type { Shot } from "./lightbox";

/**
 * Certificates and achievements, laid out as Antoine Wodniack's awards grid
 * (wodniack.dev). Ilham picked the format on 9 Nov 2026 to replace the corridor, because
 * it could be lighter and, in his words, classier. The grid itself is drawn by
 * cert-grid.tsx; this file decides what goes in which cell.
 *
 * His format has three kinds of cell, and so does this one:
 *   - a text cell: one award in two lines of light serif, centred ("GSAP SOTM /
 *     October 2024");
 *   - a counter cell: a name in display type, set low, over its counts in brackets
 *     ("AWWWARDS (SOTD x 16)") - used here where one name stands for more than one
 *     certificate, or where the number is the point (TOEFL);
 *   - the holes: hatched cells, plus one drawn cell (his globe, a seal here).
 *
 * Every word in a cell comes from the frozen lists in site.ts - titles, bodies, years and
 * results - and nothing is re-worded there. What is written by hand here is only how the
 * long names are shortened to fit a cell (ITS for Institut Teknologi Sepuluh Nopember),
 * and where each one sits. The counts are counted, not typed.
 *
 * The rules the old belt kept still hold: every data competition is marked Participant,
 * because that is what every one of them was; the chess keeps its own results, because
 * one of them is a second place. Committee seats and training are not here - they are at
 * the foot of /about/activities.
 *
 * A cell with a scan opens it in the site's viewer (lightbox.tsx); the chess cell opens
 * its three. If a certificate is added to site.ts and not placed here, the build stops
 * and says which one.
 */

export type Area = { c: number; r: number; w: number; h?: number };

export type AwardCell =
  | { kind: "text"; at: Area; tag: string; lines: string[]; shots: Shot[] }
  | { kind: "count"; at: Area; title: string[]; fs: number; counts: string[]; shots: Shot[] }
  | { kind: "hatch"; at: Area }
  | { kind: "seal"; at: Area };

/** Rows in the grid. Four columns, each row 4:3 of a column. */
export const AWARD_ROWS = 9;

function must<T>(found: T | undefined, what: string): T {
  if (found === undefined) throw new Error(`Certificates grid: "${what}" is not in site.ts any more.`);
  return found;
}

/** A string cut in two after a word that has to be in it. */
function cutAfter(s: string, word: string): [string, string] {
  const at = s.indexOf(word);
  if (at < 0) throw new Error(`Certificates grid: "${word}" is not in "${s}".`);
  return [s.slice(0, at + word.length).trim(), s.slice(at + word.length).trim()];
}

function shotOf(scan: Scan | undefined, title: string, org: string, year: string): Shot[] {
  return scan ? [{ src: scan.src, alt: `Certificate: ${title}, ${org}, ${year}`, caption: `${title} — ${org}, ${year}` }] : [];
}

export function awardCells(): { cells: AwardCell[]; count: number } {
  const used = new Set<object>();
  const take = <T extends object>(found: T | undefined, what: string): T => {
    const x = must(found, what);
    used.add(x);
    return x;
  };
  const award = (start: string) => take(achievements.find((a) => a.title.startsWith(start)), start);
  const entry = (name: string, year?: string) =>
    take(
      competitions.find((c) => c.name.startsWith(name) && (!year || c.year === year)),
      year ? `${name} ${year}` : name,
    );

  const medal = award("Bronze Medal");
  const sic = award("Samsung Innovation Campus");
  const sql = award("Guide to Learn SQL");
  const toefl = award("TOEFL");
  const satria = entry("Satria Data");
  const compfest = entry("Data Analytics Dash");
  const gelar24 = entry("Gelar Rasa", "2024");
  const gelar25 = entry("Gelar Rasa", "2025");
  const ara = entry("Data Science ARA");
  const gamma = entry("Gammafest");
  const ristek = entry("Datathon by RISTEK");
  for (const c of chess) used.add(c);

  const total = achievements.length + competitions.length + chess.length;
  if (used.size !== total) {
    const missing = [...achievements, ...competitions, ...chess]
      .filter((x) => !used.has(x))
      .map((x) => ("title" in x ? x.title : x.name));
    throw new Error(`Certificates grid: not placed yet - ${missing.join("; ")}.`);
  }

  const comp = (c: (typeof competitions)[number]) => shotOf(c.scan, c.name, c.org, c.year);
  const ach = (a: (typeof achievements)[number]) => shotOf(a.scan, a.title, a.org, a.year);

  // The medal's title, cut where Wodniack would cut it: the body on one line, the rest
  // with the year on the next.
  const [medal1, medal2] = cutAfter(medal.title, "International");
  const [sic1, sic2] = sic.title.split(" — ");
  const [toeflName, toeflScore] = toefl.title.split(" ");
  const satriaYears = satria.year.match(/\d{4}/g) ?? [];

  // The chess results, counted in the order they first appear: (2nd place x 1)(Participant x 2).
  const results = new Map<string, number>();
  for (const c of chess) results.set(c.result, (results.get(c.result) ?? 0) + 1);

  const cells: AwardCell[] = [
    // 1
    { kind: "text", at: { c: 1, r: 1, w: 4 }, tag: "Award", lines: [medal1, `${medal2} ${medal.year}`], shots: ach(medal) },
    // 2-3
    {
      kind: "count",
      at: { c: 1, r: 2, w: 2, h: 2 },
      title: satria.name.split(",")[0].split(" "),
      fs: 16.4,
      counts: [`(Participant × ${satriaYears.length})`, `(${satria.year})`],
      shots: comp(satria),
    },
    {
      kind: "text",
      at: { c: 3, r: 2, w: 2 },
      tag: "Participant",
      lines: [compfest.name, `${compfest.org.split(",")[0]}, ${compfest.year}`],
      shots: comp(compfest),
    },
    { kind: "hatch", at: { c: 3, r: 3, w: 1 } },
    {
      kind: "count",
      at: { c: 4, r: 3, w: 1 },
      title: [toeflName],
      fs: 9.6,
      counts: [`(Score ${toeflScore})`, `(${toefl.year})`],
      shots: ach(toefl),
    },
    // 4
    { kind: "text", at: { c: 1, r: 4, w: 4 }, tag: "Award", lines: [sic1, `${sic2} ${sic.year}`], shots: ach(sic) },
    // 5
    { kind: "seal", at: { c: 1, r: 5, w: 1 } },
    {
      kind: "count",
      at: { c: 2, r: 5, w: 2 },
      title: ["Chess"],
      // His single-row counters are 80px at 512 (15.6cqi); 14.6 is 80px on this 547px
      // column, and on a phone it keeps the name clear of the "3 scans" label above it.
      fs: 14.6,
      counts: [...results].map(([result, n]) => `(${result} × ${n})`),
      shots: chess.flatMap((c) => shotOf(c.scan, `${c.name}, ${c.result}`, c.org, c.year)),
    },
    { kind: "hatch", at: { c: 4, r: 5, w: 1 } },
    // 6: the two years of one competition side by side, as his two GSAP months are
    { kind: "text", at: { c: 1, r: 6, w: 2 }, tag: "Participant", lines: [gelar24.name, `UPN Veteran, ${gelar24.year}`], shots: comp(gelar24) },
    { kind: "text", at: { c: 3, r: 6, w: 2 }, tag: "Participant", lines: [gelar25.name, `UPN Veteran, ${gelar25.year}`], shots: comp(gelar25) },
    // 7
    { kind: "hatch", at: { c: 1, r: 7, w: 1 } },
    {
      kind: "text",
      at: { c: 2, r: 7, w: 3 },
      tag: "Course",
      lines: [sql.title, `${sql.org.split(",")[0]}, ${sql.year}`],
      shots: ach(sql),
    },
    // 8
    { kind: "text", at: { c: 1, r: 8, w: 3 }, tag: "Participant", lines: [ara.name, `HMIT ITS, ${ara.year}`], shots: comp(ara) },
    { kind: "hatch", at: { c: 4, r: 8, w: 1 } },
    // 9
    { kind: "text", at: { c: 1, r: 9, w: 2 }, tag: "Participant", lines: [gamma.name, `IPB, ${gamma.year}`], shots: comp(gamma) },
    { kind: "text", at: { c: 3, r: 9, w: 2 }, tag: "Participant", lines: [ristek.name, `Fasilkom UI, ${ristek.year}`], shots: comp(ristek) },
  ];

  return { cells, count: total };
}
