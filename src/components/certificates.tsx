import Image from "next/image";
import { achievements, chess, competitions } from "@/content/site";
import type { Scan } from "@/content/site";

/**
 * Certificates and achievements, as one belt that never stops.
 *
 * Ilham asked for it to run slowly and continuously rather than wait to be clicked, so
 * it is the same mechanism as the tools rows: a track holding the set twice, translated
 * by half its width, at a measured speed. 28 px/s, slower than the tools' 50, because
 * these cards carry a document to look at rather than a word to read.
 *
 * It shows the awards, the courses, the data competitions and the chess together,
 * because that is what a certificate folder is - but each card says what it actually was.
 * A data-competition card is labelled Participant rather than Competition, because that
 * is what every one of them was; the chess cards carry their own result, because one of
 * them is a second place. The site used to make that point in a sentence beside a
 * separate list, and the point has to survive the merge.
 *
 * What is NOT here: the committee seats and the training he sat in. He asked for the
 * non-competitive certificates to go with the organisations, and they do - at the foot
 * of /about/activities, where somebody looking for that kind of thing would go.
 *
 * Where there is a scan, the card is the scan. Where there is not - the olympiad medal,
 * the language test, two of the competitions - the slot carries the year at display size
 * instead, so every card is the same height and nothing pretends to a document it does
 * not have.
 */

export type Certificate = {
  kind: string;
  title: string;
  org: string;
  year: string;
  note: string;
  scan?: Scan;
};

// The two frozen lists, read as one. Neither is re-worded here: the card shows the same
// strings the competitions page shows, so there is nothing to drift apart.
export function buildCertificates(): Certificate[] {
  const awards: Certificate[] = achievements.map((a) => ({
    kind: a.scan && a.org.includes("DQLab") ? "Course" : "Award",
    title: a.title,
    org: a.org,
    year: a.year,
    note: a.body,
    scan: a.scan,
  }));
  const entered: Certificate[] = competitions.map((c) => ({
    kind: "Participant",
    title: c.name,
    org: c.org,
    year: c.year,
    note: c.body,
    scan: c.scan,
  }));
  // Chess carries its own result, because one of them is a second place and a blanket
  // "Participant" would be the opposite of the rule it was written to keep.
  const board: Certificate[] = chess.map((c) => ({
    kind: c.result,
    title: c.name,
    org: c.org,
    year: c.year,
    note: c.body,
    scan: c.scan,
  }));
  return [...awards, ...entered, ...board];
}

const SPEED = 28; // px per second
const CARD = 384; // .cert-card width in px, kept in step with globals.css
const GAP = 20;

function Card({ item }: { item: Certificate }) {
  return (
    <article className="cert-card">
      <div className="cert-shot">
        {item.scan ? (
          <Image src={item.scan} alt={`Certificate: ${item.title}, ${item.org}, ${item.year}`} sizes="384px" />
        ) : (
          <p className="cert-noscan display" aria-hidden="true">
            {item.year}
          </p>
        )}
      </div>
      <div className="cert-meta">
        <span className={`chip ${item.kind === "Participant" ? "" : "chip-live"}`}>{item.kind}</span>
        <span className="meta opacity-70">{item.year}</span>
      </div>
      <h3 className="cert-name">{item.title}</h3>
      <p className="cert-org">{item.org}</p>
    </article>
  );
}

export function Certificates() {
  const items = buildCertificates();
  // One cycle covers one set, so the duration is the set's own width over the speed.
  const seconds = Math.round((items.length * (CARD + GAP)) / SPEED);

  return (
    <div className="certbelt marquee-run">
      <div className="certbelt-track" style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map((copy) => (
          <div className="certbelt-set" key={copy} aria-hidden={copy === 1 ? "true" : undefined}>
            {items.map((item) => (
              <Card key={`${item.title}-${item.year}`} item={item} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
