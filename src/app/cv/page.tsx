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

      <section className="lit">
        <div className="column pb-10">
          {hasCv ? (
            <a href={profile.cvPath} download className="btn btn-solid">
              Download the PDF
            </a>
          ) : (
            <p className="text-ash">The PDF is not published yet. The summary below says the same thing.</p>
          )}
        </div>
      </section>

      {/* The page still answers the question if the PDF fails to load or is skipped. */}
      <section aria-labelledby="summary-title" className="lit">
        <div className="column pb-20">
          <h2 id="summary-title" className="display text-[clamp(1.7rem,4vw,2.5rem)]">
            In short
          </h2>
          <dl className="mt-10 grid gap-7">
            <div className="recede-rule border-t border-concrete pt-4">
              <dt className="meta">Studying</dt>
              <dd className="mt-2 leading-snug">
                {education.degree}, {education.school}, {education.period}
              </dd>
            </div>
            {experience.map((e) => (
              <div key={e.role} className="recede-rule border-t border-concrete pt-4">
                <dt className="meta">{e.period}</dt>
                <dd className="mt-2 leading-snug">
                  {e.role}, {e.org}
                </dd>
              </div>
            ))}
            <div className="recede-rule border-t border-concrete pt-4">
              <dt className="meta">Based in</dt>
              <dd className="mt-2 leading-snug">{profile.location}</dd>
            </div>
          </dl>
        </div>
      </section>

      {hasCv && (
        <section aria-label="CV preview" className="lit">
          <div className="frame pb-24">
            <object data={profile.cvPath} type="application/pdf" className="cv-frame recede" aria-label="CV preview">
              <p className="p-6 text-ash">
                Your browser will not show the PDF here.{" "}
                <a href={profile.cvPath} className="link" download>
                  Download it instead
                </a>
                .
              </p>
            </object>
          </div>
        </section>
      )}
    </PageTransition>
  );
}
