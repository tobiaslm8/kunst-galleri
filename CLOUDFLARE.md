# Cloudflare Pages - build-indstillinger

Projektet er en statisk Next.js-side. Brug Cloudflare Pages, ikke en Worker.

Vaelg disse indstillinger:

```text
Framework preset: Next.js (Static HTML Export)
Production branch: main
Build command: npm run build
Build output directory: out
Root directory: lad feltet vaere tomt
```

Projektets `.node-version` beder Cloudflare om at bruge Node.js 22.22.2.

## Build-variabel til korrekte SEO-links

Efter Cloudflare har vist din adresse, for eksempel:

```text
https://kunst-galleri.pages.dev
```

opret build-variablen:

```text
NEXT_PUBLIC_SITE_URL=https://kunst-galleri.pages.dev
```

Ved eget domaene bruges i stedet det endelige domaene:

```text
NEXT_PUBLIC_SITE_URL=https://ditdomaene.dk
```

Koer derefter en ny deployment. Variablen bruges kun under build til canonical-links, sitemap og Open Graph.

## Hver opdatering bagefter

1. Rediger filer eller billeder lokalt.
2. Test med `npm run dev`.
3. Koer gerne `npm run build`.
4. Commit i GitHub Desktop.
5. Push til GitHub.
6. Cloudflare bygger og udgiver automatisk den nye version.
