import Image from "next/image";
import Link from "next/link";
import type { Figure, Project } from "@/content/projects";
import { SocialIcon } from "./social-icons";

/**
 * The front page's projects as case files: one manila folder per project, its number on
 * the tab, and the papers inside it. Point at a folder and it opens, the flap tipping
 * forward and the papers coming up out of it; click and the case study opens behind the
 * page curtain, the same as any other link here.
 *
 * Ilham picked it on 9 Nov 2026 from a set of real references (the folder that drops its
 * flap and fans its pages is React Bits' Folder) because the site already calls these
 * case studies and already speaks in tape, stamps and evidence. It is the front page's
 * version only. /work keeps the full cards, where every fact and link is laid out.
 *
 * What is in a folder is what the project actually has, nothing made up for the effect:
 *   - its screenshots, up to two, starting with the cover the case study opens on;
 *   - a typed sheet with the project's own flow, the steps its case study is built on;
 *   - a typed sheet with its tools. A project with one screenshot gets both sheets, so
 *     every folder carries three papers and no folder looks emptier than another.
 *
 * The folder is one link, named by its title and the line under it. The papers are a
 * picture of the contents and are hidden from the accessibility tree; the case study
 * carries every one of them with its caption. The code and live links sit outside the
 * folder, because a link cannot hold another link.
 *
 * No overshoot: the papers come up on a hard ease-out and stop. The run switch is the
 * one spring on this site and it stays the only one.
 */
type Paper = { kind: "shot"; figure: Figure } | { kind: "flow"; steps: string[] } | { kind: "tools"; tools: string[] };

function papers(project: Project): Paper[] {
  const shots: Figure[] = [project.cover];
  for (const s of project.sections) {
    if (s.kind !== "figures") continue;
    for (const f of s.figures) if (!shots.some((g) => g.src.src === f.src.src)) shots.push(f);
  }
  const out: Paper[] = shots.slice(0, 2).map((figure) => ({ kind: "shot", figure }));
  out.push({ kind: "flow", steps: project.flow });
  if (out.length < 3) out.push({ kind: "tools", tools: project.tools });
  // The cover goes in the middle, on top, where the eye lands when the folder opens.
  return out.length === 3 ? [out[1], out[0], out[2]] : out;
}

function PaperFace({ paper }: { paper: Paper }) {
  if (paper.kind === "shot") {
    return <Image src={paper.figure.src} alt="" sizes="(min-width: 860px) 22vw, 70vw" className="cf-shot" />;
  }
  const title = paper.kind === "flow" ? "How it runs" : "Tools";
  const lines = paper.kind === "flow" ? paper.steps : paper.tools;
  return (
    <div className="cf-typed">
      <p className="cf-typed-h">{title}</p>
      <ol>
        {lines.map((l, i) => (
          <li key={l}>
            <span>{String(i + 1).padStart(2, "0")}</span> {l}
          </li>
        ))}
      </ol>
    </div>
  );
}

function links(project: Project) {
  const code = project.links.find((l) => l.href.includes("github.com"));
  const live = project.links.find((l) => !l.href.includes("github.com"));
  return { code, live };
}

function Folder({ project }: { project: Project }) {
  const { code, live } = links(project);
  return (
    <div className="cf-item">
      <Link href={`/work/${project.slug}`} className="cf">
        <span className="cf-back" aria-hidden="true" />
        <span className="cf-tab" aria-hidden="true">
          Case {project.number}
        </span>
        <span className="cf-papers" aria-hidden="true">
          {papers(project).map((p, i) => (
            <span className="cf-paper" key={i} style={{ "--p": i } as React.CSSProperties}>
              <PaperFace paper={p} />
            </span>
          ))}
        </span>
        <span className="cf-front">
          <span className="cf-label">
            <span className="cf-no" aria-hidden="true">
              {project.number}
            </span>
            <span className="cf-stamp" data-status={project.status} aria-hidden="true">
              {project.status}
            </span>
            <span className="cf-title">{project.cardTitle}</span>
            <span className="cf-sub">{project.cardSubtitle ?? project.subtitle}</span>
            <span className="cf-meta">
              {project.teamLabel} · {project.period}
            </span>
          </span>
        </span>
      </Link>
      <div className="cf-acts">
        {code ? (
          <a href={code.href} target="_blank" rel="noopener noreferrer" className="stamp stamp-sm">
            <SocialIcon name="github" size={15} />
            Code
          </a>
        ) : (
          <span className="pcard-absent">No public repo</span>
        )}
        {live ? (
          <a href={live.href} target="_blank" rel="noopener noreferrer" className="stamp stamp-sm stamp-fill">
            Open it
          </a>
        ) : (
          <span className="pcard-absent">Not deployed</span>
        )}
      </div>
    </div>
  );
}

export function CaseFiles({ projects }: { projects: Project[] }) {
  return (
    <div className="cfgrid stagger">
      {projects.map((project, i) => (
        <div key={project.slug} style={{ "--i": i } as React.CSSProperties}>
          <Folder project={project} />
        </div>
      ))}
    </div>
  );
}
