"use client";

import { useEffect, useMemo, useState } from "react";
import type { ArtworkImage } from "@/lib/types";

type ArtworkGalleryProps = {
  artworks: ArtworkImage[];
  emptyHint?: string;
  showArtistName?: boolean;
  columns?: "compact" | "standard";
};

export function ArtworkGallery({
  artworks,
  emptyHint = "Laeg billeder i kunstnerens artworks-mappe for at vise dem her.",
  showArtistName = false,
  columns = "standard"
}: ArtworkGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedArtwork = selectedIndex === null ? null : artworks[selectedIndex];

  const columnClassName = useMemo(() => {
    if (columns === "compact") {
      return "columns-1 gap-5 sm:columns-2 lg:columns-3";
    }

    return "columns-1 gap-5 sm:columns-2 xl:columns-3";
  }, [columns]);

  useEffect(() => {
    if (selectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((currentIndex) =>
          currentIndex === null ? null : (currentIndex + 1) % artworks.length
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((currentIndex) =>
          currentIndex === null ? null : (currentIndex - 1 + artworks.length) % artworks.length
        );
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [artworks.length, selectedIndex]);

  if (artworks.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white/70 p-10 text-center">
        <p className="font-serif text-3xl tracking-[-0.03em] text-stone-950">Galleriet er klar</p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">{emptyHint}</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex - 1 + artworks.length) % artworks.length
    );
  };

  const goToNext = () => {
    setSelectedIndex((currentIndex) =>
      currentIndex === null ? null : (currentIndex + 1) % artworks.length
    );
  };

  return (
    <>
      <div className={columnClassName}>
        {artworks.map((artwork, index) => (
          <button
            key={artwork.src}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] bg-white text-left shadow-sm ring-1 ring-stone-200 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-200/80 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
            aria-label={`Vis ${artwork.title} i stor st\u00f8rrelse`}
          >
            <img
              src={artwork.src}
              alt={artwork.alt}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
            <span className="block border-t border-stone-100 px-5 py-4">
              <span className="block text-sm font-medium text-stone-950">{artwork.title}</span>
              {showArtistName ? (
                <span className="mt-1 block text-xs uppercase tracking-[0.22em] text-stone-500">
                  {artwork.artistName}
                </span>
              ) : null}
            </span>
          </button>
        ))}
      </div>

      {selectedArtwork ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Billedvisning"
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 p-4 text-white backdrop-blur"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            aria-label="Luk billedvisning"
          >
            Luk &times;
          </button>

          {artworks.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-2xl backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 sm:block"
                aria-label="Forrige billede"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-2xl backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 sm:block"
                aria-label="N\u00e6ste billede"
              >
                &rarr;
              </button>
            </>
          ) : null}

          <figure
            className="w-full max-w-6xl"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <img
              src={selectedArtwork.src}
              alt={selectedArtwork.alt}
              className="mx-auto max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl shadow-black/40"
            />
            <figcaption className="mx-auto mt-5 max-w-3xl text-center">
              <span className="block font-serif text-3xl tracking-[-0.03em]">{selectedArtwork.title}</span>
              <span className="mt-2 block text-sm uppercase tracking-[0.28em] text-stone-300">
                {selectedArtwork.artistName}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </>
  );
}
