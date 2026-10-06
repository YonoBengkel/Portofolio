import { profile } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="frame flex flex-col gap-1 py-10 text-[0.95rem] text-ash sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>{profile.location}</p>
    </footer>
  );
}
