# Atelier Galleri - version 2

En professionel, responsiv og statisk Next.js-hjemmeside til at praesentere kunst fra tre kunstnere.
Version 2 er lavet specifikt til en enkel deployment paa Cloudflare Pages.

## Det vigtigste i version 2

- Next.js 16.2.12 og React 19.2.8 er laast til konkrete versioner.
- TypeScript er laast til 6.0.2, saa npm ikke automatisk henter TypeScript 7.
- Siden bruger statisk eksport og bygger alle filer til mappen `out`.
- Ingen database og ingen Node.js-server er noedvendig efter build.
- Gallerierne scanner automatisk kunstnernes billedmapper ved build.
- Responsivt masonry-layout og lightbox med tastaturstyring.
- Grundlaeggende SEO, sitemap, robots, Open Graph og strukturerede data.
- Ingen eksterne skrifttyper eller tredjeparts scripts.
- Ingen Tailwind-afhaengighed; designet ligger i almindelig CSS og er nemmere at holde stabilt.

## Lokal installation

Brug Node.js 22, og koer derefter:

```powershell
npm install
npm run dev
```

Aabn:

```text
http://localhost:3000
```

## Test produktionsversionen

```powershell
npm run build
```

Et vellykket build opretter mappen:

```text
out
```

Det er indholdet i `out`, Cloudflare Pages udgiver.

## Hvor aendres kunstnerne?

Rediger:

```text
lib/artists.ts
```

Her aendres navn, kunstnerisk beskrivelse, intro, SEO-tekst og portraetsti.

## Hvor laegges billederne?

```text
public/artists/kunstner-1/portrait.jpg
public/artists/kunstner-1/artworks/

public/artists/kunstner-2/portrait.jpg
public/artists/kunstner-2/artworks/

public/artists/kunstner-3/portrait.jpg
public/artists/kunstner-3/artworks/
```

Filnavne bruges automatisk som titler. Eksempel:

```text
01-stille-landskab.jpg
```

vises som:

```text
Stille landskab
```

## Kontakt og hjemmesidens navn

Rediger:

```text
lib/site.ts
```

Her aendres gallerinavn, e-mail og Instagram-link.

## Vigtig SEO-indstilling

Lokalt bruger siden `http://localhost:3000`. Paa Cloudflare boer du tilfoeje denne build-variabel:

```text
NEXT_PUBLIC_SITE_URL=https://din-adresse.dk
```

Du kan foerst bruge den endelige `pages.dev`-adresse, naar Cloudflare har oprettet projektet.
Se `CLOUDFLARE.md`.
