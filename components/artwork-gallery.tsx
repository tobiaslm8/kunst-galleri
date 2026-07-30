"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ArtworkImage } from "@/lib/types";

type ArtworkGalleryProps = {
  artworks: ArtworkImage[];
  showArtistName?: boolean;
  density?: "regular" | "compact";
  priorityCount?: number;
};

export function ArtworkGallery({
  artworks,
  showArtistName = false,
  density = "regular",
  priorityCount = 0
}: ArtworkGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const closeLightbox = useCallback(() => {
    const previousIndex = activeIndex;
    setActiveIndex(null);

    window.requestAnimationFrame(() => {
      if (previousIndex !== null) {
        triggerRefs.current[previousIndex]?.focus();
      }
    });
  }, [activeIndex]);

  const moveLightbox = useCallback(
    (direction: number) => {
      setActiveIndex((currentIndex) => {
        if (currentIndex === null || artworks.length === 0) {
          return currentIndex;
        }

        return (currentIndex + direction + artworks.length) % artworks.length;
      });
    },
    [artworks.length]
  );

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        moveLightbox(-1);
      }

      if (event.key === "ArrowRight") {
        moveLightbox(1);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, moveLightbox]);

  if (artworks.length === 0) {
    return (
      <div className="emptyGallery">
        <p className="eyebrow">Galleriet er klar</p>
        <h3>Der ligger endnu ingen billeder i denne mappe.</h3>
        <p>
          Tilføj billedfiler i kunstnerens <code>artworks</code>-mappe, og byg siden igen.
        </p>
      </div>
    );
  }

  const activeArtwork = activeIndex === null ? null : artworks[activeIndex];

  return (
    <>
      <div className={`artworkGrid artworkGrid--${density}`} aria-label="Galleri med kunstværker">
        {artworks.map((artwork, index) => (
          <button
            key={`${artwork.artistSlug}-${artwork.fileName}`}
            ref={(element) => {
              triggerRefs.current[index] = element;
            }}
            type="button"
            className="artworkCard"
            onClick={() => setActiveIndex(index)}
            aria-label={`Åbn ${artwork.title} i stor visning`}
          >
            <img
              src={artwork.src}
              alt={artwork.alt}
              loading={index < priorityCount ? "eager" : "lazy"}
              decoding="async"
            />
            <span className="artworkOverlay" aria-hidden="true">
              <span>
                <strong>{artwork.title}</strong>
                {showArtistName ? <small>{artwork.artistName}</small> : null}
              </span>
              <span className="zoomMark">+</span>
            </span>
          </button>
        ))}
      </div>

      {activeArtwork ? (
        <div
          className="lightboxBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightboxTitle"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              closeLightbox();
            }
          }}
        >
          <div className="lightboxPanel">
            <button
              ref={closeButtonRef}
              type="button"
              className="lightboxClose"
              onClick={closeLightbox}
              aria-label="Luk stor visning"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            {artworks.length > 1 ? (
              <>
                <button
                  type="button"
                  className="lightboxArrow lightboxArrow--previous"
                  onClick={() => moveLightbox(-1)}
                  aria-label="Forrige kunstværk"
                >
                  <span aria-hidden="true">&larr;</span>
                </button>
                <button
                  type="button"
                  className="lightboxArrow lightboxArrow--next"
                  onClick={() => moveLightbox(1)}
                  aria-label="Næste kunstværk"
                >
                  <span aria-hidden="true">&rarr;</span>
                </button>
              </>
            ) : null}

            <figure className="lightboxFigure">
              <img src={activeArtwork.src} alt={activeArtwork.alt} />
              <figcaption id="lightboxTitle">
                <span>
                  <strong>{activeArtwork.title}</strong>
                  {showArtistName ? (
                    <Link href={`/artists/${activeArtwork.artistSlug}`}>
                      {activeArtwork.artistName}
                    </Link>
                  ) : (
                    <small>{activeArtwork.artistName}</small>
                  )}
                </span>
                <small>
                  {activeIndex !== null ? activeIndex + 1 : 1} / {artworks.length}
                </small>
              </figcaption>
            </figure>
          </div>
        </div>
      ) : null}
    </>
  );
}
