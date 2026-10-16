import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import portrait from "@/assets/images/portrait-bw.webp";
import { EntryList } from "@/components/entry-list";
import { HowIWork } from "@/components/how-i-work";
import { Marquee } from "@/components/marquee";
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

      <section className="band" aria-labelledby="method-h">
        <div className="frame">
          <div className="column">
            <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-16">
              <div>
                <h2 id="method-h" className="h-sec reveal">
                  How I work
                </h2>
                <p className="lede reveal mt-5 max-w-[34rem]">
                  Three steps, in the order they actually happen. Most of the work is in the first one.
                </p>
              </div>
              <div className="photo reveal self-start">
                <Image src={portrait} alt={profile.name} sizes="(min-width: 768px) 17rem, 70vw" placeholder="blur" />
              </div>
            </div>
            <HowIWork />
          </div>
        </div>
      </section>

      <section className="band band-ink" aria-labelledby="exp-h">
        <div className="frame">
          <div className="column">
            <h2 id="exp-h" className="h-sec reveal">
              Experience
            </h2>
            <div className="mt-12 grid gap-5">
              {experience.map((e, i) => (
                <article key={e.role} className="sticker sticker-ink entry reveal">
                  <p className="entry-n">{String(i + 1).padStart(2, "0")}</p>
                  <div>
                    <p className="meta opacity-70">{e.period}</p>
                    <h3 className="work-title mt-1.5">{e.role}</h3>
                    <p className="mt-1 opacity-80">{e.org}</p>
                    <ul className="mt-4 grid gap-2.5">
                      {e.points.map((pt) => (
                        <li key={pt} className="leading-relaxed">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="band" aria-labelledby="org-h">
        <div className="frame">
          <div className="column">
            <h2 id="org-h" className="h-sec reveal">
              Organisations
            </h2>
            <p className="lede reveal mt-5 max-w-[38rem]">
              Seats in an organisation, not jobs for one event. Those are listed separately.
            </p>
            <div className="mt-12">
              <EntryList
                entries={leadership.map((l) => ({ title: l.role, org: l.org, period: l.period, body: l.body }))}
              />
            </div>
            <p className="mt-12">
              <Link href="/about/activities" className="pill pill-solid" transitionTypes={["nav-forward"]}>
                Event committees &amp; volunteering
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Marquee text="Education" />

      <section className="band" aria-labelledby="edu-h">
        <div className="frame">
          <div className="column">
            <h2 id="edu-h" className="h-sec reveal">
              Education
            </h2>
            <article className="sticker entry reveal mt-12">
              <p className="entry-n">01</p>
              <div>
                <p className="meta opacity-70">{education.period}</p>
                <h3 className="work-title mt-1.5">{education.degree}</h3>
                <p className="mt-1 opacity-80">{education.school}</p>
                <p className="mt-4 leading-relaxed">{education.coursework}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="band band-slate" aria-labelledby="tools-h">
        <div className="frame">
          <div className="column">
            <h2 id="tools-h" className="h-sec reveal">
              Tools, grouped by the job they do
            </h2>
            <div className="cards cards-2 mt-12">
              {toolbox.map((t) => (
                <div key={t.group} className="tool reveal">
                  <b>{t.group}</b>
                  <span>{t.items.join(" · ")}</span>
                </div>
              ))}
            </div>
            <p className="mt-12">
              <Link href="/about/competitions" className="pill pill-yellow" transitionTypes={["nav-forward"]}>
                Competitions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
