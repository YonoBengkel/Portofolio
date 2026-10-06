import Link from "next/link";

/**
 * The opening of every page below the home page: a quiet back link, a display
 * title, and one sentence saying what the page is for. Nothing else, so each
 * page starts the same way and the reader learns where to look.
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
    <header className="lit">
      <div className="column pb-10 pt-32 sm:pb-14 sm:pt-40">
        {back && (
          <Link href={back.href} className="meta link-quiet hover:text-bone" transitionTypes={["nav-back"]}>
            {back.label}
          </Link>
        )}
        <h1 className="display mt-6 text-[clamp(2.6rem,7vw,5rem)]">{title}</h1>
        <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-ash">{lede}</p>
      </div>
    </header>
  );
}
