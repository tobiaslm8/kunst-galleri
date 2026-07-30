import Link from "next/link";
import type { Artist } from "@/lib/types";

type ArtistCardProps = {
  artist: Artist;
  priority?: boolean;
  index: number;
};

export function ArtistCard({ artist, priority = false, index }: ArtistCardProps) {
  return (
    <article className="artistCard">
      <Link href={`/artists/${artist.slug}`} className="artistCardLink">
        <div className="artistPortraitWrap">
          <img
            src={artist.portraitSrc}
            alt={`Portræt af ${artist.name}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="artistPortrait"
          />
          <span className="artistNumber" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="artistCardBody">
          <p className="eyebrow">{artist.role}</p>
          <h3>{artist.name}</h3>
          <p>{artist.shortDescription}</p>
          <span className="textLink">
            Se kunstnerens galleri <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
