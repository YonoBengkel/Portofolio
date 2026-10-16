import Link from "next/link";
import { profile } from "@/content/site";
import { SocialIcon } from "./social-icons";
import { Logo } from "./logo";

/**
 * The last band, built to the structure measured off the reference: a hard seam with no
 * rule or gradient into it, then two rows. Row one splits in half - the name at display
 * size on the left, a short bio pinned to the right edge - and closes with a hairline.
 * Row two is a three-column grid whose first column is deliberately empty, so the link
 * cluster sits optically centre while the credit line still pins right.
 *
 * Two things here are on purpose different from the reference. Its own name sits at 32px,
 * which is an accident of an inherited line-height rather than a decision, so this one is
 * set at a real display size. And its link buttons carry a border and a hard shadow in
 * the band colour, which makes both invisible; here the offset is the accent, so the same
 * mechanic actually shows - and pressing a button closes the gap onto the yellow.
 *
 * The bio is `profile.intro`, not the tagline. The tagline already appears in the hero
 * and in the link preview; a third printing of the same sentence on one page made it
 * read as a slogan rather than a description.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot-frame">
        <div className="foot-row foot-split">
          <div className="foot-name-w">
            <Logo size={26} />
            <p className="foot-name display">{profile.name}</p>
          </div>
          <div className="foot-bio">
            <p>{profile.intro}</p>
            <p className="mt-4">{profile.location}</p>
          </div>
        </div>

        <div className="foot-row foot-grid">
          <div aria-hidden="true" />
          <div className="foot-centre">
            <nav className="foot-links" aria-label="Elsewhere">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="foot-link"
                aria-label="Ilham Bintang Satria on GitHub"
              >
                <SocialIcon name="github" />
                GitHub
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="foot-link"
                aria-label="Ilham Bintang Satria on LinkedIn"
              >
                <SocialIcon name="linkedin" />
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`} className="foot-link" aria-label={`Email ${profile.email}`}>
                <SocialIcon name="email" />
                Email
              </a>
              <Link href="/cv" className="foot-link" transitionTypes={["nav-forward"]}>
                CV
              </Link>
            </nav>
            <p className="foot-fine">
              © {year} {profile.name}
            </p>
          </div>
          <p className="foot-credit">Built with Next.js. Set in Anton, Archivo and IBM Plex Mono.</p>
        </div>
      </div>
    </footer>
  );
}
