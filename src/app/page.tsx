import fs from "node:fs";
import path from "node:path";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { atAGlance, education, experience, howIWork, leadership, otherWork, profile, toolbox } from "@/content/site";

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}

export default function Home() {
  // The "Download CV" button only appears once public/cv.pdf exists.
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* Hero */}
      <section className="grid items-end gap-12 pb-16 pt-16 sm:pb-24 sm:pt-24 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{profile.label}</p>
          <h1 className="mt-4 font-serif text-5xl font-bold tracking-tight text-brand sm:text-7xl">{profile.name}</h1>
          <div className="mt-6 h-1 w-24 rounded-full bg-brand-solid" aria-hidden />
          <p className="mt-8 max-w-3xl font-serif text-2xl leading-snug text-fg sm:text-3xl">{profile.tagline}</p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#work" className="rounded-lg bg-brand-solid px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90">
              See my work
            </a>
            {hasCv && (
              <a
                href={profile.cvPath}
                className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 font-semibold transition-colors hover:bg-card"
              >
                <DownloadIcon /> Download CV
              </a>
            )}
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 font-semibold transition-colors hover:bg-card"
            >
              <MailIcon /> Email me
            </a>
          </div>
        </div>
        <dl className="grid gap-4 rounded-2xl border border-line bg-card p-6">
          {atAGlance.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-bold uppercase tracking-[0.14em] text-brand">{item.label}</dt>
              <dd className="mt-1 leading-snug">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* How I work */}
      <section className="border-t border-line py-16 sm:py-20">
        <SectionTitle eyebrow="Approach" title="How I work" />
        <ol className="grid gap-6 md:grid-cols-3">
          {howIWork.map((step, i) => (
            <li key={step.title} className="rounded-xl border border-line bg-card p-6">
              <span className="font-serif text-4xl font-bold text-brand">{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Selected work */}
      <section id="work" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
        <SectionTitle eyebrow="Selected work" title="Case studies" />
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>

        <h3 className="mt-16 text-xs font-bold uppercase tracking-[0.16em] text-brand">Also worth a look</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {otherWork.map((w) => {
            const body = (
              <>
                <p className="font-semibold">{w.title}</p>
                <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{w.body}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted">{w.meta}</p>
              </>
            );
            return w.href ? (
              <a key={w.title} href={w.href} className="rounded-xl border border-line p-5 transition-colors hover:bg-card">
                {body}
              </a>
            ) : (
              <div key={w.title} className="rounded-xl border border-line p-5">
                {body}
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience & leadership */}
      <section id="experience" className="scroll-mt-20 border-t border-line py-16 sm:py-20">
        <SectionTitle eyebrow="Experience" title="Work and leadership" />
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            {experience.map((e) => (
              <article key={e.role} className="rounded-xl border border-line border-l-4 border-l-brand bg-card p-6">
                <p className="text-sm text-muted">{e.period}</p>
                <h3 className="mt-1 text-xl font-semibold">{e.role}</h3>
                <p className="text-brand">{e.org}</p>
                <ul className="mt-4 space-y-2">
                  {e.points.map((pt) => (
                    <li key={pt} className="flex gap-3 leading-relaxed">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <ol className="space-y-6 border-l border-line pl-6">
            {leadership.map((l) => (
              <li key={l.role} className="relative">
                <span className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-bg bg-brand-solid" aria-hidden />
                <p className="text-sm text-muted">{l.period}</p>
                <h3 className="font-semibold">{l.role}</h3>
                <p className="text-sm text-brand">{l.org}</p>
                <p className="mt-1 leading-relaxed text-muted">{l.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Education & toolbox */}
      <section className="border-t border-line py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Education" title={education.degree} />
            <p className="-mt-4 text-brand">{education.school}</p>
            <p className="text-sm text-muted">{education.period}</p>
            <p className="mt-4 leading-relaxed text-muted">
              <span className="font-semibold text-fg">Coursework: </span>
              {education.coursework}
            </p>
          </div>
          <div>
            <SectionTitle eyebrow="Toolbox" title="What I work with" />
            <dl className="-mt-2 grid gap-5 sm:grid-cols-2">
              {toolbox.map((t) => (
                <div key={t.group}>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{t.group}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {t.items.map((item) => (
                      <span key={item} className="rounded-full border border-line px-2.5 py-0.5 text-sm">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
        <div className="rounded-2xl bg-brand-solid px-6 py-12 text-white sm:px-12">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Let&apos;s talk</h2>
          <p className="mt-3 max-w-xl text-lg text-white/80">
            I would be glad to walk through any of these projects in more detail.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-[#001f5f] transition-opacity hover:opacity-90">
              <MailIcon /> {profile.email}
            </a>
            <a href={profile.links.linkedin} className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 font-semibold transition-colors hover:bg-white/10">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={profile.links.github} className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-3 font-semibold transition-colors hover:bg-white/10">
              <GitHubIcon /> GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
