import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { SectionHeading } from "@/components/section-heading";
import { artists, getArtistBySlug } from "@/lib/artists";
import { getArtworkImages } from "@/lib/artworks";

type ArtistPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return artists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    return {
      title: "Kunstner ikke fundet"
    };
  }

  return {
    title: artist.name,
    description: artist.metaDescription,
    openGraph: {
      title: `${artist.name} | Atelier Galleri`,
      description: artist.metaDescription,
      images: [artist.portraitSrc]
    }
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = getArtistBySlug(slug);

  if (!artist) {
    notFound();
  }

  const artworks = await getArtworkImages(artist.slug, artist.name);

  return (
    <>
      <section className="border-b border-stone-200 bg-[#f6f0e8]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:py-24">
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-stone-300/60">
            <img
              src={artist.portraitSrc}
              alt={`Portr\u00e6t af ${artist.name}`}
              loading="eager"
              decoding="async"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </div>

          <div>
            <Link
              href="/"
              className="mb-8 inline-flex rounded-full border border-stone-300 bg-white/60 px-4 py-2 text-sm text-stone-700 transition hover:bg-white hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
            >
              &larr; Tilbage til forsiden
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">{artist.role}</p>
            <h1 className="mt-5 font-serif text-6xl tracking-[-0.06em] text-stone-950 sm:text-7xl lg:text-8xl">
              {artist.name}
            </h1>
            <div className="mt-8 grid gap-5 text-base leading-8 text-stone-700 sm:text-lg">
              {artist.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Galleri"
            title={`V\u00e6rker af ${artist.name}`}
            description="Galleriet l&aelig;ser automatisk alle billedfiler i kunstnerens artworks-mappe og tilpasser layoutet efter antallet af billeder."
          />
          <div className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm text-stone-600 shadow-sm">
            {artworks.length} {artworks.length === 1 ? "billede" : "billeder"}
          </div>
        </div>

        <ArtworkGallery
          artworks={artworks}
          emptyHint={`Tilf\u00f8j billeder i public/artists/${artist.slug}/artworks for at fylde galleriet.`}
        />
      </section>
    </>
  );
}
