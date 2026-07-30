import Link from "next/link";
import { artists } from "@/lib/artists";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="container footerGrid">
        <div className="footerIntro">
          <p className="eyebrow">{siteConfig.name}</p>
          <h2>Kunst fortjener plads, ro og et nærværende blik.</h2>
          <p>
            Kontaktoplysningerne er placeholders og kan nemt ændres i filen
            <code> lib/site.ts</code>.
          </p>
        </div>

        <div>
          <p className="footerTitle">Kunstnere</p>
          <nav className="footerLinks" aria-label="Kunstnere">
            {artists.map((artist) => (
              <Link key={artist.slug} href={`/artists/${artist.slug}`}>
                {artist.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="footerTitle">Kontakt</p>
          <div className="footerLinks">
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noreferrer">
              {siteConfig.instagramLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="container footerBottom">
        <span>&copy; {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Bygget som statisk Next.js-side til Cloudflare Pages</span>
      </div>
    </footer>
  );
}
