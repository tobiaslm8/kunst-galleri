import Link from "next/link";
import { ArtistCard } from "@/components/artist-card";
import { ArtworkGallery } from "@/components/artwork-gallery";
import { SectionHeading } from "@/components/section-heading";
import { artists } from "@/lib/artists";
import { getFeaturedArtworks } from "@/lib/artworks";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default async function HomePage() {
  const featuredArtworks = await getFeaturedArtworks(2);
  const heroImages = featuredArtworks.slice(0, 3);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    about: artists.map((artist) => ({
      "@type": "Person",
      name: artist.name,
      url: `${siteConfig.url}/artists/${artist.slug}/`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      <section className="hero">
        <div className="heroGlow" aria-hidden="true" />
        <div className="container heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">Et digitalt rum for kunst</p>
            <h1>Kunst med ro, dybde og karakter.</h1>
            <p className="heroLead">
              Oplev tre selvstændige kunstneriske universer i et enkelt og sanseligt
              onlinegalleri, hvor værkerne får lov til at fylde.
            </p>
            <div className="heroActions">
              <Link className="button button--dark" href="#kunstnere">
                Mød kunstnerne
              </Link>
              <Link className="button button--light" href="#udvalgte-vaerker">
                Se udvalgte værker
              </Link>
            </div>
            <div className="heroMeta" aria-label="Om galleriet">
              <span>03 kunstnere</span>
              <span>Dynamiske gallerier</span>
              <span>Mobilvenlig visning</span>
            </div>
          </div>

          <div className="heroCollage" aria-label="Udvalgte kunstværker">
            {heroImages.map((artwork, index) => (
              <figure key={artwork.src} className={`heroFrame heroFrame--${index + 1}`}>
                <img
                  src={artwork.src}
                  alt={artwork.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
                <figcaption>{artwork.artistName}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="kunstnere" className="section section--artists">
        <div className="container">
          <div className="sectionTopline">
            <SectionHeading
              eyebrow="Kunstnere"
              title="Tre kunstnere. Tre selvstændige billedrum."
              description="Hver kunstner har sin egen side med portræt, introduktion og et galleri, der automatisk følger antallet af billeder i kunstnerens mappe."
            />
            <p className="sectionAside">
              Et roligt layout med stor luft omkring motiverne giver plads til både detaljer,
              farver og materialitet.
            </p>
          </div>

          <div className="artistGrid">
            {artists.map((artist, index) => (
              <ArtistCard
                key={artist.slug}
                artist={artist}
                index={index}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="udvalgte-vaerker" className="section section--gallery">
        <div className="container">
          <div className="sectionTopline sectionTopline--gallery">
            <SectionHeading
              eyebrow="Udvalgte værker"
              title="Et galleri, der vokser sammen med kunsten."
              description="Forsiden samler automatisk et udvalg fra alle tre kunstnere. Klik på et værk for at se det i stor visning."
            />
            <Link className="textLink textLink--large" href={`/artists/${artists[0].slug}`}>
              Gå til første kunstner <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ArtworkGallery
            artworks={featuredArtworks}
            showArtistName
            density="compact"
            priorityCount={2}
          />
        </div>
      </section>

      <section className="statementSection">
        <div className="container statementGrid">
          <p className="eyebrow">Om galleriet</p>
          <blockquote>
            Et værk behøver ikke forklare alt. Nogle gange skal det blot have et rum,
            hvor man kan blive stående lidt længere.
          </blockquote>
        </div>
      </section>
    </>
  );
}
