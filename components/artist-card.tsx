import Link from "next/link";
import type { Artist } from "@/lib/types";

type ArtistCardProps = {
  artist: Artist;
  priority?: boolean;
};

export function ArtistCard({ artist, priority = false }: ArtistCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-200/70">
      <Link href={`/artists/${artist.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-stone-950/20">
        <div className="aspect-[4/5] overflow-hidden bg-stone-200">
          <img
            src={artist.portraitSrc}
            alt={`Portr\u00e6t af ${artist.name}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-7 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">{artist.role}</p>
          <h3 className="mt-4 font-serif text-3xl tracking-[-0.03em] text-stone-950">{artist.name}</h3>
          <p className="mt-4 text-sm leading-7 text-stone-600">{artist.shortDescription}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-stone-950">
            Se kunstnerens galleri
            <span aria-hidden="true" className="transition group-hover:translate-x-1">
              &rarr;
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
