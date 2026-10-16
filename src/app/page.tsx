import Link from "next/link";
import { AboutCard } from "@/components/about-card";
import { Certificates } from "@/components/certificates";
import { Hero } from "@/components/hero";
import { Tape } from "@/components/tape";
import { PageTransition } from "@/components/page-transition";
import { Toolbelt } from "@/components/toolbelt";
import { WorkGrid } from "@/components/work-grid";
import { projects } from "@/content/projects";
import { Timeline, buildTimeline } from "@/components/timeline";
import { competitions, education, experience, leadership } from "@/content/site";

/**
 * The order is the reference's, and Ilham asked for it by name: who he is, what he has
 * done and why, what he works with, what he built, then what he has been given.
 *
 * Every band is full bleed and alternates paper and ink, so no section ever blurs into
 * the one above it. The projects band is ink rather than the slate it used to be: the
 * reference puts its own grid on #5A6F84 and this site's slate is #4A5A6B, which is the
 * same colour to anyone who opens both - and the same lecturers will open both.
 */
export default function Home() {
  // Work, then the organisation seats, then the degree. The full list lives on /about;
  // the home page shows the four most recent so the section stays one screen deep.
  const timeline = buildTimeline(experience, leadership, education).slice(0, 4);

  return (
    <PageTransition>
      <Hero />

      {/* 1 — who he is. Carries its own marquee band, so it needs no divider above it. */}
      <AboutCard />

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
              <Link href="/about" className="pill">
                The rest of it
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* 3 — what he works with */}
      <section className="band" aria-labelledby="tools-h">
        <div className="frame">
          <div className="column text-center">
            <h2 id="tools-h" className="h-sec rise">
              Tools &amp; skills
            </h2>
            <div className="draw rule mx-auto mt-6 w-[min(34rem,100%)]" />
          </div>
        </div>
        {/* Full bleed: the rows run past the edge of the page, not inside a column. */}
        <div className="mt-12">
          <Toolbelt />
        </div>
      </section>

      <Tape text="Projects" tilt={1.6} />

      {/* 4 — what he built */}
      <section className="band band-ink" aria-labelledby="work-h">
        <div className="frame">
          <div className="pwide">
            <div className="plaque-row">
              <h2 id="work-h" className="plaque">
                Projects
              </h2>
              <p className="plaque-tag">Case studies</p>
            </div>
            <p className="lede rise mt-8 max-w-[38rem] opacity-85">
              Each one written from what it actually does rather than from the stack it was built with.
            </p>
            <div className="mt-14">
              <WorkGrid projects={projects} />
            </div>
            <p className="mt-14">
              <Link href="/work" className="pill pill-yellow">
                See all {projects.length} in full
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
            <div className="draw rule mt-6" />
            <p className="lede rise mt-6 max-w-[38rem]">
              Awards, courses and the competitions he entered, each with the body that gave them and the
              certificate where there is one. Every competition card reads <b>Participant</b>, because that
              is what every one of them was.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <Certificates />
        </div>
        <div className="frame">
          <div className="column">
            <p className="mt-12">
              <Link href="/about/competitions" className="pill pill-solid">
                {competitions.length} competitions
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
