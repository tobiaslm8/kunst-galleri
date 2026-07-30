import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { SectionHeading } from "@/components/section-heading";
import { artists } from "@/lib/artists";
import { getFeaturedArtworks } from "@/lib/artworks";

export default async function HomePage() {
  const featuredArtworks = await getFeaturedArtworks(2);
  const heroImages = featuredArtworks.slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-stone-200 bg-[#f6f0e8]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(120,113,108,0.18),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.7),rgba(214,204,190,0.45))]" />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.32em] text-stone-600">
              Skandinavisk gallerioplevelse
            </p>
            <h1 className="max-w-4xl font-serif text-6xl tracking-[-0.06em] text-stone-950 sm:text-7xl lg:text-8xl">
              Kunst med ro, dybde og karakter.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-stone-700">
              En professionel digital ramme til at pr&aelig;sentere tre kunstneres malerier,
              processer og visuelle universer med store billeder, luftig typografi og fokus p&aring;
              selve v&aelig;rkerne.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="#kunstnere"
                className="rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
              >
                Udforsk kunstnerne
              </Link>
              <Link
                href="#udvalgte-vaerker"
                className="rounded-full border border-stone-300 bg-white/70 px-6 py-3 text-sm font-medium text-stone-950 transition hover:-translate-y-0.5 hover:bg-white focus:outline-none focus:ring-2 focus:ring-stone-950/20"
              >
                Se udvalgte v&aelig;rker
              </Link>
            </div>
          </div>

          <div className="grid min-h-[520px] grid-cols-6 grid-rows-6 gap-4">
            {heroImages.map((artwork, index) => (
              <div
                key={artwork.src}
                className={
                  index === 0
                    ? "col-span-4 row-span-4 overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-stone-300/60"
                    : index === 1
                      ? "col-span-2 row-span-3 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-300/50"
                      : "col-span-3 row-span-3 col-start-4 overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-stone-300/50"
                }
              >
                <img
                  src={artwork.src}
                  alt={artwork.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kunstnere" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="Kunstnere"
            title="Tre kunstnere. Tre selvst&aelig;ndige billedrum."
            description="Hver kunstner har sin egen side med portr&aelig;t, introduktion og et automatisk opdateret galleri baseret p&aring; billederne i kunstnerens mappe."
          />
          <p className="max-w-sm text-sm leading-7 text-stone-500">
            Layoutet er bygget til at lade kunsten fylde mest muligt, uanset om der ligger f&aring;
            eller mange billeder i galleriet.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {artists.map((artist, index) => (
            <ArtistCard key={artist.slug} artist={artist} priority={index === 0} />
          ))}
        </div>
      </section>

      <section id="udvalgte-vaerker" className="border-y border-stone-200 bg-white/60">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Udvalgte v&aelig;rker"
              title="Et fleksibelt galleri, der skalerer med indholdet."
              description="Forsiden viser automatisk de f&oslash;rste udvalgte billeder fra hver kunstners billedmappe. P&aring; de enkelte kunstnersider vises hele mappen."
            />
            <Link
              href={`/artists/${artists[0].slug}`}
              className="w-fit rounded-full border border-stone-300 px-6 py-3 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-stone-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-stone-950/20"
            >
              G&aring; til f&oslash;rste galleri
            </Link>
          </div>

          <ArtworkGallery artworks={featuredArtworks} showArtistName columns="compact" />
        </div>
      </section>
    </>
  );
}
