import Link from "next/link";
import type { Artist } from "@/lib/types";

export function SiteHeader({ artists }: { artists: Artist[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:py-5">
        <Link href="/" className="group inline-flex w-fit flex-col leading-none">
          <span className="font-serif text-2xl tracking-[-0.03em] text-stone-950 transition group-hover:opacity-70">
            Atelier Galleri
          </span>
          <span className="mt-1 text-xs uppercase tracking-[0.28em] text-stone-500">
            Contemporary Art
          </span>
        </Link>

        <nav aria-label="Hovednavigation" className="flex flex-wrap items-center gap-2 text-sm text-stone-700">
          <Link
            href="/"
            className="rounded-full px-4 py-2 transition hover:bg-stone-200/70 hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
          >
            Forside
          </Link>

          {artists.map((artist) => (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="rounded-full px-4 py-2 transition hover:bg-stone-200/70 hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
            >
              {artist.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
