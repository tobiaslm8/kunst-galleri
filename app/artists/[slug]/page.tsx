import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { SectionHeading } from "@/components/section-heading";
import { artists, getArtistBySlug } from "@/lib/artists";
import { getArtworkImages } from "@/lib/artworks";
import { siteConfig } from "@/lib/site";

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
    alternates: {
      canonical: `/artists/${artist.slug}/`
    },
    openGraph: {
      title: `${artist.name} | ${siteConfig.name}`,
      description: artist.metaDescription,
      type: "profile",
      images: [
        {
          url: artist.portraitSrc,
          alt: `Portræt af ${artist.name}`
        }
      ]
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
  const artistIndex = artists.findIndex((item) => item.slug === artist.slug);
  const previousArtist = artists[(artistIndex - 1 + artists.length) % artists.length];
  const nextArtist = artists[(artistIndex + 1) % artists.length];

  const artistJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: artist.metaDescription,
    image: `${siteConfig.url}${artist.portraitSrc}`,
    url: `${siteConfig.url}/artists/${artist.slug}/`
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(artistJsonLd) }}
      />

      <section className="artistHero">
        <div className="container artistHeroGrid">
          <figure className="artistHeroPortrait">
            <img
              src={artist.portraitSrc}
              alt={`Portræt af ${artist.name}`}
              loading="eager"
              decoding="async"
            />
          </figure>

          <div className="artistHeroCopy">
            <Link className="backLink" href="/">
              <span aria-hidden="true">&larr;</span> Tilbage til forsiden
            </Link>
            <p className="eyebrow">{artist.role}</p>
            <h1>{artist.name}</h1>
            <div className="artistIntro">
              {artist.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section artistGallerySection">
        <div className="container">
          <div className="sectionTopline sectionTopline--gallery">
            <SectionHeading
              eyebrow="Galleri"
              title={`Værker af ${artist.name}`}
              description="Klik på et billede for at se det i stor visning. Galleriet opdateres automatisk, når billeder tilføjes eller fjernes fra kunstnerens mappe og siden bygges igen."
            />
            <p className="artworkCount">
              {artworks.length} {artworks.length === 1 ? "værk" : "værker"}
            </p>
          </div>

          <ArtworkGallery artworks={artworks} priorityCount={2} />
        </div>
      </section>

      <nav className="artistPager" aria-label="Skift mellem kunstnere">
        <div className="container artistPagerGrid">
          <Link href={`/artists/${previousArtist.slug}`}>
            <small>Forrige kunstner</small>
            <strong><span aria-hidden="true">&larr;</span> {previousArtist.name}</strong>
          </Link>
          <Link href={`/artists/${nextArtist.slug}`}>
            <small>Næste kunstner</small>
            <strong>{nextArtist.name} <span aria-hidden="true">&rarr;</span></strong>
          </Link>
        </div>
      </nav>
    </>
  );
}
