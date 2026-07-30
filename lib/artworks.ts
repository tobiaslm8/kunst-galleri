import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { artists } from "@/lib/artists";
import type { ArtworkImage } from "@/lib/types";

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function publicPathFor(slug: string, fileName: string): string {
  return `/artists/${slug}/artworks/${fileName}`;
}

function titleFromFileName(fileName: string): string {
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  return baseName
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export async function getArtworkImages(
  slug: string,
  artistName = "Kunstner"
): Promise<ArtworkImage[]> {
  const artworksDirectory = path.join(process.cwd(), "public", "artists", slug, "artworks");

  let entries: Dirent[];

  try {
    entries = await fs.readdir(artworksDirectory, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "da", { numeric: true, sensitivity: "base" }))
    .map((fileName) => {
      const title = titleFromFileName(fileName);

      return {
        src: publicPathFor(slug, fileName),
        alt: `${title} af ${artistName}`,
        title,
        artistName,
        artistSlug: slug
      };
    });
}

export async function getFeaturedArtworks(imagesPerArtist = 2): Promise<ArtworkImage[]> {
  const galleries = await Promise.all(
    artists.map(async (artist) => {
      const artworks = await getArtworkImages(artist.slug, artist.name);
      return artworks.slice(0, imagesPerArtist);
    })
  );

  return galleries.flat();
}
