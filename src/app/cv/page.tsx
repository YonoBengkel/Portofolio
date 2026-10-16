import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { education, experience, openTo, profile } from "@/content/site";

export const metadata: Metadata = {
  title: "CV",
  description: "Read the CV in the page or download the PDF.",
};

export default function CvPage() {
  const hasCv = fs.existsSync(path.join(process.cwd(), "public", profile.cvPath));

  return (
    <PageTransition>
      <PageHeader title="CV" lede={openTo} />

      <section className="band">
        <div className="frame">
          <div className="column">
            {hasCv ? (
              <a href={profile.cvPath} download className="pill pill-solid">
                Download the PDF
              </a>
            ) : (
              <p className="lede">The PDF is not published yet. The summary below says the same thing.</p>
            )}

            {/* The page still answers the question if the PDF fails to load or is skipped. */}
            <div className="sticker reveal mt-12 p-7 sm:p-10">
              <h2 className="h-sec">In short</h2>
              <dl className="mt-8 grid gap-0">
                <div className="grid gap-2 pb-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
                  <dt className="meta opacity-70">Studying</dt>
                  <dd className="leading-snug">
                    {education.degree}, {education.school}, {education.period}
                  </dd>
                </div>
                {experience.map((e) => (
                  <div
                    key={e.role}
                    className="grid gap-2 border-t-2 border-line py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline"
                  >
                    <dt className="meta opacity-70">{e.period}</dt>
                    <dd className="leading-snug">
                      {e.role}, {e.org}
                    </dd>
                  </div>
                ))}
                <div className="grid gap-2 border-t-2 border-line pt-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-baseline">
                  <dt className="meta opacity-70">Based in</dt>
                  <dd className="leading-snug">{profile.location}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {hasCv && (
        <section aria-label="CV preview" className="band band-slate pt-0">
          <div className="frame">
            <div className="column">
              <object
                data={profile.cvPath}
                type="application/pdf"
                className="h-[min(80svh,900px)] w-full border-2 border-ink bg-paper-2"
                aria-label="CV preview"
              >
                <p className="p-6">
                  Your browser will not show the PDF here.{" "}
                  <a href={profile.cvPath} className="underline decoration-2 underline-offset-4" download>
                    Download it instead
                  </a>
                  .
                </p>
              </object>
            </div>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
