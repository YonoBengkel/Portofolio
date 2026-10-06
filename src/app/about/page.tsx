import type { Metadata } from "next";
import Link from "next/link";
import { EntryList } from "@/components/entry-list";
import { HowIWork } from "@/components/how-i-work";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { education, experience, leadership, profile, toolbox } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "How I work, where I study, what I use, and what I lead.",
};

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHeader title="About" lede={profile.intro} />

      <section aria-labelledby="method-title" className="lit">
        <div className="column band">
          <h2 id="method-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            How I work
          </h2>
          <HowIWork />
        </div>
      </section>

      <section aria-labelledby="experience-title" className="lit">
        <div className="column band">
          <h2 id="experience-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            Experience
          </h2>
          {experience.map((e) => (
            <article key={e.role} className="reveal mt-10">
              <p className="meta">{e.period}</p>
              <h3 className="mt-2 text-[1.3rem] font-semibold">{e.role}</h3>
              <p className="mt-1 text-ash">{e.org}</p>
              <ul className="mt-6 grid gap-4">
                {e.points.map((pt) => (
                  <li key={pt} className="recede-rule border-t border-concrete pt-4 leading-relaxed">
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="leadership-title" className="lit">
        <div className="column band">
          <h2 id="leadership-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            Organisations
          </h2>
          <EntryList
            entries={leadership.map((l) => ({ title: l.role, org: l.org, meta: l.period, body: l.body }))}
          />
          <p className="mt-8">
            <Link href="/about/activities" className="link" transitionTypes={["nav-forward"]}>
              Event committees are listed separately
            </Link>
          </p>
        </div>
      </section>

      <section aria-labelledby="education-title" className="lit">
        <div className="column band">
          <h2 id="education-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            Education
          </h2>
          <div className="reveal mt-10 recede-rule border-t border-concrete pt-5">
            <p className="meta">{education.period}</p>
            <h3 className="mt-2 text-[1.15rem] font-semibold">{education.degree}</h3>
            <p className="mt-1 text-ash">{education.school}</p>
            <p className="mt-4 max-w-[34rem] leading-relaxed text-ash">{education.coursework}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="toolbox-title" className="lit">
        <div className="column band">
          <h2 id="toolbox-title" className="display text-[clamp(1.9rem,4.5vw,3rem)]">
            Tools, grouped by the job they do
          </h2>
          <dl className="mt-10 grid gap-7">
            {toolbox.map((t) => (
              <div key={t.group} className="reveal recede-rule border-t border-concrete pt-4">
                <dt className="meta">{t.group}</dt>
                <dd className="mt-2 leading-relaxed">{t.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-10">
            <Link href="/about/competitions" className="link" transitionTypes={["nav-forward"]}>
              Competitions
            </Link>
          </p>
        </div>
      </section>
    </PageTransition>
  );
}
