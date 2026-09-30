import Image from "next/image";
import type { Figure, Project, Section } from "@/content/projects";
import { PipelineDiagram, StarSchemaDiagram } from "./diagrams";
import { Rich } from "./rich";

// Case-study building blocks. Every block is a direct child of .article-grid, so it can
// choose its width: the 42rem text column (default) or the 64rem "wide" column.

/** Each picture links to its original file, so it can be opened at full size without any script. */
function Img({ figure, preload = false }: { figure: Figure; preload?: boolean }) {
  return (
    <a
      href={figure.src.src}
      className={`block cursor-zoom-in rounded-[10px] ${figure.narrow ? "mx-auto max-w-[28rem]" : ""}`}
    >
      <Image
        src={figure.src}
        alt={figure.alt}
        preload={preload}
        sizes={figure.narrow ? "(min-width: 640px) 28rem, 100vw" : "(min-width: 1080px) 1024px, 100vw"}
        className="h-auto w-full rounded-[10px] border border-rule bg-paper"
      />
      <span className="sr-only"> (opens the full-size image)</span>
    </a>
  );
}

/** On phones the wide pipeline keeps a readable size and scrolls sideways. */
function Diagram({ kind }: { kind: "pipeline" | "star-schema" }) {
  if (kind === "star-schema") return <StarSchemaDiagram />;
  return (
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <div className="min-w-[34rem]">
        <PipelineDiagram />
      </div>
    </div>
  );
}

function Caption({ children }: { children: string }) {
  return <figcaption className="mt-4 text-[0.95rem] leading-relaxed text-graphite">{children}</figcaption>;
}

/** The first picture on the page. It overlaps the bottom of the coloured band. */
export function CoverFigure({ project }: { project: Project }) {
  if (project.heroDiagram) {
    return (
      <figure className="wide panel relative z-10 -mt-[clamp(5rem,12vw,9rem)] p-5 sm:p-10">
        <Diagram kind={project.heroDiagram.diagram} />
        <Caption>{project.heroDiagram.caption}</Caption>
      </figure>
    );
  }
  return (
    <figure className="wide relative z-10 -mt-[clamp(5rem,12vw,9rem)]">
      <Img figure={project.cover} preload />
      <Caption>{project.cover.caption}</Caption>
    </figure>
  );
}

function SectionBlocks({ section }: { section: Section }) {
  switch (section.kind) {
    case "text":
      return (
        <>
          <h2>{section.heading}</h2>
          {section.body.map((p) => (
            <p key={p} className="mt-4">
              <Rich text={p} />
            </p>
          ))}
        </>
      );
    case "steps":
      return (
        <>
          <h2>{section.heading}</h2>
          <ol className="mt-2 space-y-3">
            {section.items.map((item, i) => (
              <li key={item} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-2">
                <span className="font-extrabold tabular-nums">{i + 1}</span>
                <span>
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ol>
        </>
      );
    case "list":
      return (
        <>
          <h2>{section.heading}</h2>
          <ul className="mt-2 list-disc space-y-3 pl-6 marker:text-graphite">
            {section.items.map((item) => (
              <li key={item} className="pl-1">
                <Rich text={item} />
              </li>
            ))}
          </ul>
        </>
      );
    case "decisions":
      return (
        <>
          <h2>{section.heading}</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[1.05rem] leading-relaxed">
              <thead>
                <tr className="border-b-2 border-ink">
                  <th scope="col" className="w-[38%] py-3 pr-6 text-[0.95rem] font-bold">
                    Decision
                  </th>
                  <th scope="col" className="py-3 text-[0.95rem] font-bold">
                    Why
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.items.map((d) => (
                  <tr key={d.title} className="border-b border-rule align-top">
                    <th scope="row" className="py-4 pr-6 font-bold">
                      {d.title}
                    </th>
                    <td className="py-4 text-graphite">{d.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "figures":
      return (
        <div className={`wide panel mt-12 grid gap-8 p-5 sm:p-10 ${section.columns === 2 ? "sm:grid-cols-2" : ""}`}>
          {section.figures.map((f) => (
            <figure key={f.alt}>
              <Img figure={f} />
              <Caption>{f.caption}</Caption>
            </figure>
          ))}
        </div>
      );
    case "diagram":
      return (
        <figure className="wide panel mt-12 p-5 sm:p-10">
          <Diagram kind={section.diagram} />
          <Caption>{section.caption}</Caption>
        </figure>
      );
    case "note":
      return (
        <p className="mt-12 border-t border-rule pt-5 text-[0.95rem] text-graphite">
          <Rich text={section.body} />
        </p>
      );
  }
}

export function CaseStudyBody({ project }: { project: Project }) {
  return (
    <>
      {project.sections.map((s, i) => (
        <SectionBlocks key={i} section={s} />
      ))}
    </>
  );
}

/** Role, team, timeline and the rest, shown in the coloured band at the top of the page. */
export function ProjectFacts({ project }: { project: Project }) {
  const facts = [
    { label: "Project type", value: project.teamLabel, long: false },
    { label: "Timeline", value: project.period, long: false },
    { label: "Context", value: project.context, long: true },
    { label: "Field", value: project.category, long: true },
  ];
  return (
    <div className="mx-auto mt-14 max-w-[64rem] text-left">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:gap-x-10 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-4">
          <dt className="text-[0.95rem] font-bold">My role</dt>
          <dd className="mt-1 max-w-[48rem] text-lg leading-relaxed sm:text-xl">{project.role}</dd>
        </div>
        {facts.map((f) => (
          <div key={f.label} className={f.long ? "col-span-2 sm:col-span-1" : undefined}>
            <dt className="text-[0.95rem] font-bold">{f.label}</dt>
            <dd className="mt-1 leading-snug">{f.value}</dd>
          </div>
        ))}
        <div className="col-span-2 lg:col-span-4">
          <dt className="text-[0.95rem] font-bold">Tools</dt>
          <dd className="mt-1 leading-snug">{project.tools.join(", ")}</dd>
        </div>
      </dl>
      {project.links.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn btn-tile">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
