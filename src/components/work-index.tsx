import Link from "next/link";
import type { Project } from "@/content/projects";
import type { OtherWork } from "@/content/site";

/**
 * The contents page for the work: every piece in one numbered list, the way Toriq's own
 * portfolio opens, rather than a grid followed by a second grid labelled "also".
 *
 * Splitting them was a judgement the reader never asked for. Everything is here in one
 * list; what differs is whether a row leads anywhere, and the row says which. A piece
 * with a case study is a link, a piece without one is a line of text with its own note,
 * and nothing is hidden under a heading that quietly means "the lesser ones".
 */
export function WorkIndex({ projects, other }: { projects: Project[]; other: OtherWork[] }) {
  const rows = [
    ...projects.map((p) => ({
      key: p.slug,
      n: p.number,
      title: p.cardTitle,
      meta: p.category,
      note: p.teamLabel,
      href: `/work/${p.slug}`,
    })),
    ...other.map((o, i) => ({
      key: o.title,
      n: String(projects.length + i + 1).padStart(2, "0"),
      title: o.title,
      meta: o.meta,
      note: "No case study",
      href: undefined,
    })),
  ];

  return (
    <ol className="windex">
      {rows.map((row) => {
        const body = (
          <>
            <span className="windex-n">{row.n}</span>
            <span className="windex-title">{row.title}</span>
            <span className="windex-meta">{row.meta}</span>
            <span className="windex-note">{row.note}</span>
          </>
        );
        return (
          <li key={row.key} className="windex-row">
            {row.href ? (
              <Link href={row.href} className="windex-link">
                {body}
                <span className="windex-go" aria-hidden="true">
                  →
                </span>
              </Link>
            ) : (
              <span className="windex-link windex-flat">{body}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
