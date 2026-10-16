import Link from "next/link";
import { AboutCard } from "@/components/about-card";
import { EntryList } from "@/components/entry-list";
import { Hero } from "@/components/hero";
import { Tape } from "@/components/tape";
import { PageTransition } from "@/components/page-transition";
import { WorkGrid } from "@/components/work-grid";
import { projects } from "@/content/projects";
import { Timeline, buildTimeline } from "@/components/timeline";
import { achievements, competitions, education, experience, leadership, toolbox } from "@/content/site";

/**
 * The order is the reference's, and Ilham asked for it by name: who he is, what he has
 * done and why, what he works with, what he built, then what he has been given.
 *
 * Every band is full bleed and alternates paper / ink / paper / slate, so no section
 * ever blurs into the one above it. The hazard tape between them is the only thing that
 * moves without being scrolled, and even that waits for the switch.
 */
export default function Home() {
  // Work, then the organisation seats, then the degree. The full list lives on /about;
  // the home page shows the four most recent so the section stays one screen deep.
  const timeline = buildTimeline(experience, leadership, education).slice(0, 4);

  return (
    <PageTransition>
      <Hero />

      <Tape text="About me" />

      {/* 1 — who he is */}
      <section className="band" aria-labelledby="about-h">
        <div className="frame">
          <div className="column tilt">
            <h2 id="about-h" className="sr-only">
              About
            </h2>
            <AboutCard />
          </div>
        </div>
      </section>

      {/* 2 — what he has done, and why it mattered */}
      <section className="band band-ink" aria-labelledby="exp-h">
        <div className="frame">
          <div className="column">
            <h2 id="exp-h" className="h-sec rise">
              Experience &amp; education
            </h2>
            <div className="draw rule mt-6" />
            <div className="mt-12">
              <Timeline entries={timeline} dark />
            </div>
            <p className="mt-10">
              <Link href="/about" className="pill" transitionTypes={["nav-forward"]}>
                The rest of it
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 3 — what he works with */}
      <section className="band" aria-labelledby="tools-h">
        <div className="frame">
          <div className="column">
            <h2 id="tools-h" className="h-sec rise">
              Tools &amp; skills
            </h2>
            <div className="draw rule mt-6" />
            <div className="stagger cards cards-2 cards-3 mt-12">
              {toolbox.map((group, i) => (
                <div key={group.group} className="tool" style={{ "--i": i } as React.CSSProperties}>
                  <b>{group.group}</b>
                  <span>{group.items.join(" · ")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Tape text="Projects" tilt={1.6} />

      {/* 4 — what he built */}
      <section className="band band-slate" aria-labelledby="work-h">
        <div className="frame">
          <div className="column">
            <h2 id="work-h" className="h-sec rise">
              Projects
            </h2>
            <p className="lede rise mt-5 max-w-[38rem] opacity-85">
              Four case studies, each written from what it actually does rather than from the stack it was
              built with.
            </p>
            <div className="mt-12">
              <WorkGrid projects={projects} />
            </div>
            <p className="mt-12">
              <Link href="/work" className="pill pill-yellow" transitionTypes={["nav-forward"]}>
                See all four in full
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Tape text="Certificates &amp; achievements" tilt={-1.4} />

      {/* 5 — what he has been given */}
      <section className="band" aria-labelledby="awards-h">
        <div className="frame">
          <div className="column">
            <h2 id="awards-h" className="h-sec rise">
              Certificates &amp; achievements
            </h2>
            <p className="lede rise mt-5 max-w-[38rem]">
              Awards and certificates with the body that gave them. Competitions are listed separately,
              because every one of those was a team entry at participant level.
            </p>
            <div className="mt-12">
              <EntryList
                entries={achievements.map((a) => ({
                  title: a.title,
                  org: a.org,
                  period: a.year,
                  body: a.body,
                }))}
              />
            </div>
            <p className="mt-12">
              <Link href="/about/competitions" className="pill pill-solid" transitionTypes={["nav-forward"]}>
                {competitions.length} competitions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
