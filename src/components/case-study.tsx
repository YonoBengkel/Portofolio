import Image from "next/image";
import type { Figure, Project, Section } from "@/content/projects";
import { PipelineDiagram, StarSchemaDiagram } from "./diagrams";
import { Rich } from "./rich";

// Case-study building blocks. Every block is a direct child of .article-grid, so it can
// choose its width: the 42rem text column (default) or the 64rem "wide" column.

/**
 * Each picture opens full size in the viewer, which is a real <dialog> and so closes on
 * Escape. It used to be an <a> to the image file, which navigated away from the page: no
 * Escape, only a back button.
 */
function Img({ figure, preload = false }: { figure: Figure; preload?: boolean }) {
  return (
    <button
      type="button"
      data-zoom-src={figure.src.src}
      data-zoom-alt={figure.alt}
      data-zoom-caption={figure.caption}
      className={`block w-full cursor-zoom-in overflow-clip rounded-[6px] border-2 border-ink bg-ink ${
        figure.narrow ? "mx-auto max-w-[28rem]" : ""
      }`}
    >
      <Image
        src={figure.src}
        alt={figure.alt}
        preload={preload}
        sizes={figure.narrow ? "(min-width: 640px) 28rem, 100vw" : "(min-width: 1080px) 1024px, 100vw"}
        className="h-auto w-full"
      />
      <span className="sr-only"> (opens the full-size image)</span>
    </button>
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
  // Full strength, not dimmed: on the slate band a caption at 70% measures 4.26:1,
  // and a caption is the one piece of text next to a screenshot that has to be read.
  return <figcaption className="meta mt-4">{children}</figcaption>;
}

/** The first picture on the page, lit on its own. */
export function CoverFigure({ project }: { project: Project }) {
  return (
    <section className="band band-tight band-slate">
      <div className="frame">
        <figure className="reveal mx-auto max-w-[66rem]">
          {project.heroDiagram ? (
            <div className="sticker p-5 sm:p-10">
              <Diagram kind={project.heroDiagram.diagram} />
            </div>
          ) : (
            <Img figure={project.cover} preload />
          )}
          <Caption>{project.heroDiagram ? project.heroDiagram.caption : project.cover.caption}</Caption>
        </figure>
      </div>
    </section>
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
          <ul className="mt-2 list-disc space-y-3 pl-6 marker:text-yellow">
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
          <div className="reveal mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-left text-[1.05rem] leading-relaxed">
              <thead>
                <tr className="border-b-2 border-line">
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
                  <tr key={d.title} className="border-b-2 border-line align-top">
                    <th scope="row" className="py-4 pr-6 font-bold">
                      {d.title}
                    </th>
                    <td className="py-4">{d.body}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "figures":
      return (
        <div className={`wide sticker reveal mt-12 grid gap-8 p-5 sm:p-10 ${section.columns === 2 ? "sm:grid-cols-2" : ""}`}>
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
        <figure className="wide sticker reveal mt-12 p-5 sm:p-10">
          <Diagram kind={section.diagram} />
          <Caption>{section.caption}</Caption>
        </figure>
      );
    case "note":
      return (
        <p className="mt-12 border-t-2 border-line pt-5 text-[0.95rem] opacity-75">
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

/** Role, team, timeline and the rest: a quiet grid, read before the pictures start. */
export function ProjectFacts({ project }: { project: Project }) {
  const facts = [
    { label: "Status", value: project.status },
    { label: "Project type", value: project.teamLabel },
    { label: "Timeline", value: project.period },
    { label: "Context", value: project.context },
  ];
  return (
    <section aria-label="Project facts" className="band pb-0">
      <div className="frame">
        <div className="column sticker reveal p-7 sm:p-10">
        <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="meta opacity-70">My role</dt>
            <dd className="mt-2 max-w-[36rem] leading-relaxed">{project.role}</dd>
          </div>
          {facts.map((f) => (
            <div key={f.label} className="border-t-2 border-line pt-4">
              <dt className="meta opacity-70">{f.label}</dt>
              <dd className="mt-2 leading-snug">{f.value}</dd>
            </div>
          ))}
          <div className="border-t-2 border-line pt-4 sm:col-span-2">
            <dt className="meta opacity-70">Tools</dt>
            <dd className="mt-2 leading-snug">{project.tools.join(", ")}</dd>
          </div>
        </dl>
        {project.links.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="pill">
                {l.label} ↗
              </a>
            ))}
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
