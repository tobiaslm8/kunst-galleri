import Link from "next/link";
import type { Artist } from "@/lib/types";
import { siteConfig } from "@/lib/site";

type SiteHeaderProps = {
  artists: Artist[];
};

export function SiteHeader({ artists }: SiteHeaderProps) {
  return (
    <header className="siteHeader">
      <div className="container headerInner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} - forside`}>
          <span className="brandMark" aria-hidden="true">
            A
          </span>
          <span>
            <strong>{siteConfig.name}</strong>
            <small>Kunst fra tre kunstnere</small>
          </span>
        </Link>

        <nav className="desktopNav" aria-label="Hovedmenu">
          <Link href="/">Forside</Link>
          {artists.map((artist) => (
            <Link key={artist.slug} href={`/artists/${artist.slug}`}>
              {artist.name}
            </Link>
          ))}
        </nav>

        <details className="mobileNav">
          <summary>Menu</summary>
          <nav aria-label="Mobilmenu">
            <Link href="/">Forside</Link>
            {artists.map((artist) => (
              <Link key={artist.slug} href={`/artists/${artist.slug}`}>
                {artist.name}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
