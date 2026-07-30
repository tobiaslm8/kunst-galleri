export type Artist = {
  name: string;
  slug: string;
  role: string;
  portraitSrc: string;
  shortDescription: string;
  intro: string[];
  metaDescription: string;
};

export type ArtworkImage = {
  src: string;
  alt: string;
  title: string;
  artistName: string;
  artistSlug: string;
  fileName: string;
};
