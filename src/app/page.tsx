import fs from "node:fs";
import path from "node:path";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/content/projects";
import { atAGlance, education, experience, leadership, otherWork, profile, toolbox } from "@/content/site";

function BigWord({ id, children }: { id: string; children: string }) {
  return (
    <h2 id={id} className="big-word">
      {children}
      <span className="stop">.</span>
    </h2>
  );
}

export default function Home() {
  // The "Download CV" button only appears once public/cv.pdf exists.
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));
  const [emailName, emailDomain] = profile.email.split("@");

  return (
    <>
      <Hero hasCv={hasCv} />

      <section id="work" aria-labelledby="work-title" className="frame scroll-mt-6 pt-24 sm:pt-32">
        <BigWord id="work-title">Case studies</BigWord>
        <div className="mosaic">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} wide={i === 0 || i === projects.length - 1} />
          ))}
        </div>

        <div className="mt-20 sm:mt-24">
          <h3 className="text-[1.75rem] font-extrabold tracking-[-0.025em] sm:text-4xl">Other projects</h3>
          <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {otherWork.map((w) => (
              <li key={w.title} className="border-t border-concrete pt-5">
                <h4 className="text-lg font-bold leading-snug">
                  {w.href ? (
                    <a href={w.href} target="_blank" rel="noopener noreferrer" className="link">
                      {w.title}
                    </a>
                  ) : (
                    w.title
                  )}
                </h4>
                <p className="mt-2 leading-relaxed text-ash">{w.body}</p>
                <p className="mt-3 text-[0.95rem] font-semibold">{w.meta}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="experience" aria-labelledby="experience-title" className="frame scroll-mt-6 pt-28 sm:pt-40">
        <BigWord id="experience-title">Experience</BigWord>
        {experience.map((e) => (
          <article
            key={e.role}
            className="grid gap-8 bg-brass px-6 pb-12 pt-16 text-on-brass sm:px-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-16 lg:pb-20 lg:pt-24"
          >
            <div>
              <h3 className="text-[2rem] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2.6rem]">{e.role}</h3>
              <p className="mt-4 text-lg font-semibold">{e.org}</p>
              <p className="mt-1">{e.period}</p>
            </div>
            <ul className="space-y-5 text-lg leading-relaxed lg:pt-2">
              {e.points.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </article>
        ))}

        <div className="mt-20 sm:mt-24">
          <h3 className="text-[1.75rem] font-extrabold tracking-[-0.025em] sm:text-4xl">Leadership</h3>
          <ul className="mt-8 grid gap-10 md:grid-cols-3 md:gap-8">
            {leadership.map((l) => (
              <li key={l.role} className="border-t border-concrete pt-5">
                <p className="text-[0.95rem] text-ash">{l.period}</p>
                <h4 className="mt-2 text-lg font-bold leading-snug">{l.role}</h4>
                <p className="mt-1 font-semibold">{l.org}</p>
                <p className="mt-3 leading-relaxed text-ash">{l.body}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 grid gap-14 sm:mt-24 lg:grid-cols-2 lg:gap-8">
          <div>
            <h3 className="text-[1.75rem] font-extrabold tracking-[-0.025em] sm:text-4xl">Education</h3>
            <div className="mt-8 border-t border-concrete pt-5">
              <p className="text-lg font-bold">{education.degree}</p>
              <p className="mt-1 font-semibold">{education.school}</p>
              <p className="mt-1 text-[0.95rem] text-ash">{education.period}</p>
              <p className="mt-4 max-w-[36rem] leading-relaxed text-ash">
                <span className="font-bold text-bone">Coursework: </span>
                {education.coursework}
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-[1.75rem] font-extrabold tracking-[-0.025em] sm:text-4xl">Toolbox</h3>
            <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-concrete pt-5 sm:grid-cols-2">
              {toolbox.map((t) => (
                <div key={t.group}>
                  <dt className="font-bold">{t.group}</dt>
                  <dd className="mt-1 leading-relaxed text-ash">{t.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="frame scroll-mt-6 pb-16 pt-28 sm:pt-40">
        <BigWord id="contact-title">Contact</BigWord>
        <div className="grid lg:grid-cols-2">
          <div className="bg-brass px-6 pb-14 pt-16 text-on-brass sm:px-10 lg:px-16 lg:pb-20 lg:pt-24">
            <a
              href={`mailto:${profile.email}`}
              aria-label={profile.email}
              className="link-quiet block text-[clamp(1.55rem,3.7vw,3.1rem)] font-extrabold leading-[1.12] tracking-[-0.03em]"
            >
              {emailName}@
              <br />
              {emailDomain}
            </a>
            <p className="mt-10 max-w-[34rem] text-lg font-semibold leading-relaxed">
              I would be glad to walk through any of these projects in more detail.
            </p>
            <p className="mt-4 max-w-[34rem] leading-relaxed">{profile.intro}</p>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2 font-bold">
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="link">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="link">
                  GitHub
                </a>
              </li>
              {hasCv && (
                <li>
                  <a href={profile.cvPath} className="link">
                    Download CV
                  </a>
                </li>
              )}
            </ul>
          </div>
          <dl className="space-y-7 bg-soot px-6 py-14 sm:px-10 lg:px-16 lg:py-24">
            {atAGlance.map((item) => (
              <div key={item.label}>
                <dt className="text-[0.95rem] font-bold text-ash">{item.label}</dt>
                <dd className="mt-1 text-lg font-semibold leading-snug">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
