import Image from "next/image";
import type { ReactNode } from "react";
import type { Figure, Project, Section } from "@/content/projects";
import { PipelineDiagram, StarSchemaDiagram } from "./diagrams";
import { ExternalIcon } from "./icons";
import { Rich } from "./rich";

function Heading({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">{children}</h2>;
}

export function FigureBlock({ figure, preload = false }: { figure: Figure; preload?: boolean }) {
  return (
    <figure className={figure.narrow ? "mx-auto max-w-md" : undefined}>
      <Image
        src={figure.src}
        alt={figure.alt}
        preload={preload}
        sizes="(min-width: 1024px) 1100px, 100vw"
        className="h-auto w-full rounded-xl border border-line bg-card"
      />
      <figcaption className="mt-2 text-sm text-muted">{figure.caption}</figcaption>
    </figure>
  );
}

export function DiagramFigure({ diagram, caption }: { diagram: "pipeline" | "star-schema"; caption: string }) {
  return (
    <figure className="rounded-xl border border-line bg-bg p-4 sm:p-6">
      {diagram === "pipeline" ? <PipelineDiagram /> : <StarSchemaDiagram />}
      <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

function SectionBlock({ section }: { section: Section }) {
  switch (section.kind) {
    case "text":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          <div className="space-y-3 leading-relaxed">
            {section.body.map((p) => (
              <p key={p}>
                <Rich text={p} />
              </p>
            ))}
          </div>
        </section>
      );
    case "steps":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          <ol className="space-y-3">
            {section.items.map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand">
                  {i + 1}
                </span>
                <span className="leading-relaxed">
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ol>
        </section>
      );
    case "list":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          <ul className="space-y-2.5">
            {section.items.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                <span>
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      );
    case "decisions":
      return (
        <section>
          <Heading>{section.heading}</Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.items.map((d) => (
              <div key={d.title} className="rounded-xl border border-line border-l-4 border-l-brand bg-card p-4">
                <p className="font-semibold text-brand">{d.title}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </section>
      );
    case "figures":
      return (
        <div className={`grid gap-6 ${section.columns === 2 ? "sm:grid-cols-2" : ""}`}>
          {section.figures.map((f) => (
            <FigureBlock key={f.alt} figure={f} />
          ))}
        </div>
      );
    case "diagram":
      return <DiagramFigure diagram={section.diagram} caption={section.caption} />;
    case "note":
      return (
        <p className="text-sm text-muted">
          <Rich text={section.body} />
        </p>
      );
  }
}

export function CaseStudyBody({ project }: { project: Project }) {
  return (
    <div className="space-y-10">
      {project.sections.map((s, i) => (
        <SectionBlock key={i} section={s} />
      ))}
    </div>
  );
}

export function ProjectFacts({ project }: { project: Project }) {
  const facts = [
    { label: "Type", value: project.teamLabel },
    { label: "Context", value: project.context },
    { label: "Timeline", value: project.period },
    { label: "My role", value: project.role },
  ];
  return (
    <aside className="rounded-xl border border-line bg-card p-6 lg:sticky lg:top-24">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-brand">Project facts</h2>
      <dl className="space-y-4 text-[0.95rem]">
        {facts.map((f) => (
          <div key={f.label}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{f.label}</dt>
            <dd className="mt-1 leading-relaxed">{f.value}</dd>
          </div>
        ))}
        <div>
          <dt className="text-xs font-semibold uppercase tracking-wider text-muted">Tools</dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.tools.map((t) => (
              <span key={t} className="rounded-full border border-line bg-bg px-2.5 py-0.5 text-sm">
                {t}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div className="mt-6 flex flex-col gap-2">
        {project.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-solid px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {l.label} <ExternalIcon width={16} height={16} />
          </a>
        ))}
      </div>
    </aside>
  );
}
