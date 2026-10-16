import Link from "next/link";

/**
 * The opening of every page below the home page: a back link, the title at poster size
 * on the dark band, and one line saying what the page is for.
 *
 * It is a band rather than a heading so that every inner page starts with the same hard
 * edge the home page uses between its sections, and so the fixed header always has a
 * dark field under it instead of landing on whatever happens to be there.
 */
export function PageHeader({
  title,
  lede,
  back,
}: {
  title: string;
  lede: string;
  back?: { href: string; label: string };
}) {
  return (
    <header className="band-ink">
      <div className="frame pb-20 pt-36 sm:pb-24 sm:pt-44">
        <div className="column">
          {back && (
            <Link href={back.href} className="pill">
              ← {back.label}
            </Link>
          )}
          <h1 className={`display text-[clamp(2.6rem,9vw,7rem)] ${back ? "mt-8" : ""}`}>{title}</h1>
          <p className="lede mt-6 max-w-[38rem] opacity-80">{lede}</p>
        </div>
      </div>
    </header>
  );
}
