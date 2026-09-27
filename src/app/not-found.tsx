import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">404</p>
      <h1 className="mt-3 font-serif text-4xl font-bold text-brand">This page does not exist</h1>
      <p className="mt-4 text-lg text-muted">The link may be outdated. The case studies are on the home page.</p>
      <Link href="/#work" className="mt-8 inline-block rounded-lg bg-brand-solid px-5 py-3 font-semibold text-white hover:opacity-90">
        Back to my work
      </Link>
    </div>
  );
}
