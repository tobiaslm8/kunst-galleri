# Atelier Galleri – version 2.2

En professionel, responsiv galleri-hjemmeside til tre kunstnere, bygget specifikt til **Cloudflare Pages**.

Version 2.2 bruger en lille Node.js-buildfil uden eksterne kodepakker. Det betyder:

- ingen Next.js- eller TypeScript-konflikter
- ingen `npm audit`-problemer
- et stabilt build til Cloudflare Pages
- automatisk scanning af kunstnernes billedmapper
- responsivt masonry-galleri
- lightbox med næste/forrige, piletaster, Escape og swipe på mobil
- SEO-metadata, `robots.txt`, `sitemap.xml`, Open Graph og strukturerede data
- kunstnertekster samlet i én JSON-fil

## Start hjemmesiden lokalt

Åbn en terminal i projektmappen og kør:

```powershell
npm run dev
```

Åbn derefter:

```text
http://localhost:3000
```

Stop serveren med:

```text
Ctrl + C
```

Der er ingen eksterne dependencies, så `npm install` er ikke nødvendigt. Det skader dog ikke at køre det.

## Test et produktionsbuild

```powershell
npm run build
```

Et vellykket build slutter med teksten:

```text
Kunstgalleriet er bygget uden fejl.
```

De færdige hjemmesidefiler bliver lagt i:

```text
out/
```

## Rediger kunstnere

Alle kunstneroplysninger findes i:

```text
data/artists.json
```

Her ændres blandt andet:

- navn
- slug/mappe-navn
- kunstnerisk beskrivelse
- introafsnit
- SEO-beskrivelse
- portrættets filnavn

JSON-filen skal beholde korrekt komma- og citationstegnsstruktur.

## Rediger galleriets navn og kontakt

Rediger:

```text
data/site.json
```

Her ændres blandt andet:

- gallerinavn
- beskrivelse
- hjemmesideadresse
- e-mail
- Instagram-link

## Tilføj eller fjern kunstværker

Billeder lægges i:

```text
public/artists/kunstner-1/artworks/
public/artists/kunstner-2/artworks/
public/artists/kunstner-3/artworks/
```

Portrætter ligger som eksempel her:

```text
public/artists/kunstner-1/portrait.jpg
```

Galleriet finder selv alle understøttede billeder ved næste build.

Et filnavn som:

```text
01-stille-landskab.jpg
```

bliver vist som titlen:

```text
Stille landskab
```

Understøttede formater er `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` og `.gif`.

## Cloudflare Pages

Se den komplette begynderguide i:

```text
CLOUDFLARE.md
```

De rigtige build-indstillinger er:

```text
Framework preset: None
Build command: npm run build
Build output directory: out
Root directory: tom
```

## Vigtig regel

Kør ikke `npm audit fix --force`. Projektet har ingen eksterne dependencies, så kommandoen er ikke nødvendig.
