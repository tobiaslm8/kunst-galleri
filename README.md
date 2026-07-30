# Atelier Galleri

Professionel, moderne og responsiv Next.js-hjemmeside til at praesentere kunst fra 3 kunstnere.

Projektet indeholder:

- Forside med hero-sektion, kunstnerkort og udvalgte vaerker
- Individuel side for hver kunstner
- Dynamisk galleri, der scanner billeder i `public/artists/[slug]/artworks`
- Masonry-lignende billedgrid med CSS columns
- Lightbox/modal med tastaturstyring: Escape, pil venstre og pil hoejre
- Lazy loading af billeder via browserens `loading="lazy"`
- SEO metadata, sitemap og robots
- Tailwind CSS 4 setup via `@import "tailwindcss"`

## Installation

```bash
npm install
npm run dev
```

Aabn derefter:

```bash
http://localhost:3000
```

## Produktion

```bash
npm run build
npm run start
```

## Filstruktur

```text
app/
  layout.tsx
  page.tsx
  globals.css
  sitemap.ts
  robots.ts
  artists/
    [slug]/
      page.tsx
components/
  artist-card.tsx
  artwork-gallery.tsx
  section-heading.tsx
  site-footer.tsx
  site-header.tsx
lib/
  artists.ts
  artworks.ts
  types.ts
public/
  artists/
    kunstner-1/
      portrait.jpg
      artworks/
        billede-1.jpg
        billede-2.jpg
    kunstner-2/
      portrait.jpg
      artworks/
        billede-1.jpg
    kunstner-3/
      portrait.jpg
      artworks/
        billede-1.jpg
```

## Saadan opdaterer du kunstnere

Rediger `lib/artists.ts`.

Her kan du aendre:

- navn
- slug
- kort beskrivelse
- intro-tekst
- SEO-beskrivelse
- sti til portraetbillede

Slug skal passe med mappenavnet i `public/artists`.

Eksempel:

```ts
{
  name: "Anna Eksempel",
  slug: "anna-eksempel",
  portraitSrc: "/artists/anna-eksempel/portrait.jpg"
}
```

Du skal saa oprette denne mappe:

```text
public/artists/anna-eksempel/
  portrait.jpg
  artworks/
    billede-1.jpg
    billede-2.jpg
```

## Saadan tilfoejer du nye billeder

Laeg billeder i kunstnerens `artworks`-mappe:

```text
public/artists/kunstner-1/artworks/
```

Understoettede formater:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`
- `.avif`
- `.gif`

Galleriet sorterer filerne naturligt, saa `billede-2.jpg` kommer foer `billede-10.jpg`.

Ved lokal udvikling kan du typisk bare genindlaese siden. Ved statisk deployment skal siden bygges og deployes igen, naar du tilfoejer eller fjerner filer i `public`.

## Miljoevariabel til sitemap

Saet denne i produktion:

```bash
NEXT_PUBLIC_SITE_URL=https://ditdomane.dk
```

Hvis den ikke er sat, bruger projektet `http://localhost:3000` i sitemap og robots.
