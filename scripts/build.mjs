import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFile), "..");
const outDir = path.join(rootDir, "out");
const publicDir = path.join(rootDir, "public");
const sourceDir = path.join(rootDir, "src");
const dataDir = path.join(rootDir, "data");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const checkOnly = process.argv.includes("--check");

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function normalizeSiteUrl(value) {
  const candidate = String(value || "").trim().replace(/\/$/, "");
  let parsed;

  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error(`Ugyldig hjemmesideadresse: ${candidate || "(tom)"}`);
  }

  if (!new Set(["http:", "https:"]).has(parsed.protocol)) {
    throw new Error("Hjemmesideadressen skal begynde med http:// eller https://");
  }

  return parsed.toString().replace(/\/$/, "");
}

function absoluteUrl(siteUrl, pathname = "/") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPath}`;
}

function titleFromFileName(fileName) {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const normalized = baseName
    .replace(/^\d+[\s_-]*/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return "Uden titel";
  return normalized.charAt(0).toLocaleUpperCase("da-DK") + normalized.slice(1);
}

function imageWebPath(slug, fileName) {
  return `/artists/${encodeURIComponent(slug)}/artworks/${encodeURIComponent(fileName)}`;
}

async function readJson(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Kunne ikke læse ${path.relative(rootDir, filePath)}: ${error.message}`);
  }
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function validateSite(site) {
  const required = ["name", "shortName", "tagline", "description", "url", "email", "instagramUrl", "instagramLabel"];
  for (const field of required) {
    if (typeof site[field] !== "string" || !site[field].trim()) {
      throw new Error(`data/site.json mangler en gyldig tekstværdi i feltet "${field}".`);
    }
  }
}

async function validateArtists(artists) {
  if (!Array.isArray(artists) || artists.length === 0) {
    throw new Error("data/artists.json skal indeholde mindst én kunstner.");
  }

  const slugs = new Set();
  const required = ["name", "slug", "role", "portrait", "shortDescription", "metaDescription"];

  for (const [index, artist] of artists.entries()) {
    for (const field of required) {
      if (typeof artist[field] !== "string" || !artist[field].trim()) {
        throw new Error(`Kunstner ${index + 1} mangler en gyldig tekstværdi i feltet "${field}".`);
      }
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(artist.slug)) {
      throw new Error(`Sluggen "${artist.slug}" må kun indeholde små bogstaver, tal og bindestreger.`);
    }

    if (slugs.has(artist.slug)) {
      throw new Error(`Sluggen "${artist.slug}" bruges mere end én gang.`);
    }
    slugs.add(artist.slug);

    if (!Array.isArray(artist.intro) || artist.intro.length === 0 || artist.intro.some((item) => typeof item !== "string" || !item.trim())) {
      throw new Error(`Kunstneren "${artist.name}" skal have mindst ét afsnit i feltet "intro".`);
    }

    const portraitPath = path.join(publicDir, "artists", artist.slug, artist.portrait);
    if (!(await exists(portraitPath))) {
      throw new Error(`Portrættet mangler: public/artists/${artist.slug}/${artist.portrait}`);
    }
  }
}

async function getArtworks(artist) {
  const directory = path.join(publicDir, "artists", artist.slug, "artworks");
  let entries = [];

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
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
        src: imageWebPath(artist.slug, fileName),
        alt: `${title}, værk af ${artist.name}`,
        title,
        artistName: artist.name,
        artistSlug: artist.slug,
        artistUrl: `/artists/${artist.slug}/`,
        fileName
      };
    });
}

function sectionHeading({ eyebrow, title, description = "" }) {
  return `
    <div class="sectionHeading sectionHeading--left">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      ${description ? `<p class="sectionDescription">${escapeHtml(description)}</p>` : ""}
    </div>`;
}

function header(site, artists) {
  const artistLinks = artists
    .map((artist) => `<a href="/artists/${escapeHtml(artist.slug)}/">${escapeHtml(artist.name)}</a>`)
    .join("\n");

  return `
  <a class="skipLink" href="#main-content">Gå til indhold</a>
  <header class="siteHeader">
    <div class="container headerInner">
      <a class="brand" href="/" aria-label="${escapeHtml(site.name)} - forside">
        <span class="brandMark" aria-hidden="true">${escapeHtml(site.shortName.charAt(0).toUpperCase())}</span>
        <span>
          <strong>${escapeHtml(site.name)}</strong>
          <small>${escapeHtml(site.tagline)}</small>
        </span>
      </a>
      <nav class="desktopNav" aria-label="Hovedmenu">
        <a href="/">Forside</a>
        ${artistLinks}
      </nav>
      <details class="mobileNav">
        <summary>Menu</summary>
        <nav aria-label="Mobilmenu">
          <a href="/">Forside</a>
          ${artistLinks}
        </nav>
      </details>
    </div>
  </header>`;
}

function footer(site, artists) {
  const artistLinks = artists
    .map((artist) => `<a href="/artists/${escapeHtml(artist.slug)}/">${escapeHtml(artist.name)}</a>`)
    .join("\n");

  return `
  <footer class="siteFooter">
    <div class="container footerGrid">
      <div class="footerIntro">
        <p class="eyebrow">${escapeHtml(site.name)}</p>
        <h2>Kunst fortjener plads, ro og et nærværende blik.</h2>
        <p>Navn og kontaktoplysninger ændres i <code>data/site.json</code>.</p>
      </div>
      <div>
        <p class="footerTitle">Kunstnere</p>
        <nav class="footerLinks" aria-label="Kunstnere">${artistLinks}</nav>
      </div>
      <div>
        <p class="footerTitle">Kontakt</p>
        <div class="footerLinks">
          <a href="mailto:${escapeHtml(site.email)}">${escapeHtml(site.email)}</a>
          <a href="${escapeHtml(site.instagramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(site.instagramLabel)}</a>
        </div>
      </div>
    </div>
    <div class="container footerBottom">
      <span>&copy; ${new Date().getFullYear()} ${escapeHtml(site.name)}</span>
      <span>Statisk galleri bygget til Cloudflare Pages</span>
    </div>
  </footer>`;
}

function lightbox() {
  return `
  <div class="lightboxBackdrop" data-lightbox role="dialog" aria-modal="true" aria-labelledby="lightboxTitle" hidden>
    <div class="lightboxPanel">
      <button type="button" class="lightboxClose" data-lightbox-close aria-label="Luk stor visning"><span aria-hidden="true">&times;</span></button>
      <button type="button" class="lightboxArrow lightboxArrow--previous" data-lightbox-previous aria-label="Forrige kunstværk"><span aria-hidden="true">&larr;</span></button>
      <button type="button" class="lightboxArrow lightboxArrow--next" data-lightbox-next aria-label="Næste kunstværk"><span aria-hidden="true">&rarr;</span></button>
      <figure class="lightboxFigure">
        <img data-lightbox-image src="" alt="">
        <figcaption id="lightboxTitle">
          <span>
            <strong data-lightbox-title></strong>
            <a data-lightbox-artist href="#"></a>
          </span>
          <small data-lightbox-counter aria-live="polite"></small>
        </figcaption>
      </figure>
    </div>
  </div>`;
}

function gallery(artworks, { showArtistName = false, density = "regular", priorityCount = 0 } = {}) {
  if (artworks.length === 0) {
    return `
      <div class="emptyGallery">
        <p class="eyebrow">Galleriet er klar</p>
        <h3>Der ligger endnu ingen billeder i denne mappe.</h3>
        <p>Tilføj billedfiler i kunstnerens <code>artworks</code>-mappe, og byg siden igen.</p>
      </div>`;
  }

  const cards = artworks
    .map((artwork, index) => `
      <button
        type="button"
        class="artworkCard"
        data-artwork
        data-src="${escapeHtml(artwork.src)}"
        data-alt="${escapeHtml(artwork.alt)}"
        data-title="${escapeHtml(artwork.title)}"
        data-artist="${escapeHtml(artwork.artistName)}"
        data-artist-url="${escapeHtml(artwork.artistUrl)}"
        aria-label="Åbn ${escapeHtml(artwork.title)} i stor visning"
      >
        <img src="${escapeHtml(artwork.src)}" alt="${escapeHtml(artwork.alt)}" loading="${index < priorityCount ? "eager" : "lazy"}" decoding="async">
        <span class="artworkOverlay" aria-hidden="true">
          <span>
            <strong>${escapeHtml(artwork.title)}</strong>
            ${showArtistName ? `<small>${escapeHtml(artwork.artistName)}</small>` : ""}
          </span>
          <span class="zoomMark">+</span>
        </span>
      </button>`)
    .join("\n");

  return `<div class="artworkGrid artworkGrid--${density}" aria-label="Galleri med kunstværker">${cards}</div>`;
}

function pageDocument({ site, artists, title, description, canonicalPath, body, jsonLd, ogImage = "/og-image.jpg" }) {
  const canonical = absoluteUrl(site.url, canonicalPath);
  const fullTitle = title === site.name ? `${site.name} | ${site.tagline}` : `${title} | ${site.name}`;

  return `<!doctype html>
<html lang="da">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f4f0e8">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="manifest" href="/site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="da_DK">
  <meta property="og:site_name" content="${escapeHtml(site.name)}">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta property="og:image" content="${escapeHtml(absoluteUrl(site.url, ogImage))}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(absoluteUrl(site.url, ogImage))}">
  <link rel="stylesheet" href="/assets/styles.css">
  ${jsonLd ? `<script type="application/ld+json">${safeJson(jsonLd)}</script>` : ""}
  <script src="/assets/gallery.js" defer></script>
</head>
<body>
${header(site, artists)}
<main id="main-content">${body}</main>
${footer(site, artists)}
${lightbox()}
</body>
</html>\n`;
}

function artistCard(artist, index) {
  const portraitSrc = `/artists/${artist.slug}/${encodeURIComponent(artist.portrait)}`;
  return `
    <article class="artistCard">
      <a href="/artists/${escapeHtml(artist.slug)}/" class="artistCardLink">
        <div class="artistPortraitWrap">
          <img src="${escapeHtml(portraitSrc)}" alt="Portræt af ${escapeHtml(artist.name)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async" class="artistPortrait">
          <span class="artistNumber" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <div class="artistCardBody">
          <p class="eyebrow">${escapeHtml(artist.role)}</p>
          <h3>${escapeHtml(artist.name)}</h3>
          <p>${escapeHtml(artist.shortDescription)}</p>
          <span class="textLink">Se kunstnerens galleri <span aria-hidden="true">&rarr;</span></span>
        </div>
      </a>
    </article>`;
}

function homePage(site, artists, galleries) {
  const featured = galleries.flatMap(({ artworks }) => artworks.slice(0, 2));
  const heroImages = featured.slice(0, 3);
  const collage = heroImages
    .map((artwork, index) => `
      <figure class="heroFrame heroFrame--${index + 1}">
        <img src="${escapeHtml(artwork.src)}" alt="${escapeHtml(artwork.alt)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        <figcaption>${escapeHtml(artwork.artistName)}</figcaption>
      </figure>`)
    .join("\n");

  const body = `
    <section class="hero">
      <div class="heroGlow" aria-hidden="true"></div>
      <div class="container heroGrid">
        <div class="heroCopy">
          <p class="eyebrow">Et digitalt rum for kunst</p>
          <h1>Kunst med ro, dybde og karakter.</h1>
          <p class="heroLead">Oplev tre selvstændige kunstneriske universer i et enkelt og sanseligt onlinegalleri, hvor værkerne får lov til at fylde.</p>
          <div class="heroActions">
            <a class="button button--dark" href="#kunstnere">Mød kunstnerne</a>
            <a class="button button--light" href="#udvalgte-vaerker">Se udvalgte værker</a>
          </div>
          <div class="heroMeta" aria-label="Om galleriet">
            <span>${String(artists.length).padStart(2, "0")} kunstnere</span>
            <span>Dynamiske gallerier</span>
            <span>Mobilvenlig visning</span>
          </div>
        </div>
        <div class="heroCollage" aria-label="Udvalgte kunstværker">${collage}</div>
      </div>
    </section>

    <section id="kunstnere" class="section section--artists">
      <div class="container">
        <div class="sectionTopline">
          ${sectionHeading({
            eyebrow: "Kunstnere",
            title: `${artists.length === 3 ? "Tre" : artists.length} kunstnere. Selvstændige billedrum.`,
            description: "Hver kunstner har sin egen side med portræt, introduktion og et galleri, der automatisk følger antallet af billeder i kunstnerens mappe."
          })}
          <p class="sectionAside">Et roligt layout med stor luft omkring motiverne giver plads til både detaljer, farver og materialitet.</p>
        </div>
        <div class="artistGrid">${artists.map(artistCard).join("\n")}</div>
      </div>
    </section>

    <section id="udvalgte-vaerker" class="section section--gallery">
      <div class="container">
        <div class="sectionTopline sectionTopline--gallery">
          ${sectionHeading({
            eyebrow: "Udvalgte værker",
            title: "Et galleri, der vokser sammen med kunsten.",
            description: "Forsiden samler automatisk et udvalg fra alle kunstnere. Klik på et værk for at se det i stor visning."
          })}
          <a class="textLink textLink--large" href="/artists/${escapeHtml(artists[0].slug)}/">Gå til første kunstner <span aria-hidden="true">&rarr;</span></a>
        </div>
        ${gallery(featured, { showArtistName: true, density: "compact", priorityCount: 2 })}
      </div>
    </section>

    <section class="statementSection">
      <div class="container statementGrid">
        <p class="eyebrow">Om galleriet</p>
        <blockquote>Et værk behøver ikke forklare alt. Nogle gange skal det blot have et rum, hvor man kan blive stående lidt længere.</blockquote>
      </div>
    </section>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: site.name,
    description: site.description,
    url: site.url,
    about: artists.map((artist) => ({
      "@type": "Person",
      name: artist.name,
      url: absoluteUrl(site.url, `/artists/${artist.slug}/`)
    }))
  };

  return pageDocument({ site, artists, title: site.name, description: site.description, canonicalPath: "/", body, jsonLd });
}

function artistPage(site, artists, artist, artworks, index) {
  const previous = artists[(index - 1 + artists.length) % artists.length];
  const next = artists[(index + 1) % artists.length];
  const portraitSrc = `/artists/${artist.slug}/${encodeURIComponent(artist.portrait)}`;
  const body = `
    <section class="artistHero">
      <div class="container artistHeroGrid">
        <figure class="artistHeroPortrait">
          <img src="${escapeHtml(portraitSrc)}" alt="Portræt af ${escapeHtml(artist.name)}" loading="eager" decoding="async">
        </figure>
        <div class="artistHeroCopy">
          <a class="backLink" href="/"><span aria-hidden="true">&larr;</span> Tilbage til forsiden</a>
          <p class="eyebrow">${escapeHtml(artist.role)}</p>
          <h1>${escapeHtml(artist.name)}</h1>
          <div class="artistIntro">${artist.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}</div>
        </div>
      </div>
    </section>

    <section class="section artistGallerySection">
      <div class="container">
        <div class="sectionTopline sectionTopline--gallery">
          ${sectionHeading({
            eyebrow: "Galleri",
            title: `Værker af ${artist.name}`,
            description: "Klik på et billede for at se det i stor visning. Galleriet opdateres automatisk, når billeder tilføjes eller fjernes fra kunstnerens mappe, og siden bygges igen."
          })}
          <p class="artworkCount">${artworks.length} ${artworks.length === 1 ? "værk" : "værker"}</p>
        </div>
        ${gallery(artworks, { priorityCount: 2 })}
      </div>
    </section>

    <nav class="artistPager" aria-label="Skift mellem kunstnere">
      <div class="container artistPagerGrid">
        <a href="/artists/${escapeHtml(previous.slug)}/"><small>Forrige kunstner</small><strong><span aria-hidden="true">&larr;</span> ${escapeHtml(previous.name)}</strong></a>
        <a href="/artists/${escapeHtml(next.slug)}/"><small>Næste kunstner</small><strong>${escapeHtml(next.name)} <span aria-hidden="true">&rarr;</span></strong></a>
      </div>
    </nav>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    description: artist.metaDescription,
    image: absoluteUrl(site.url, portraitSrc),
    url: absoluteUrl(site.url, `/artists/${artist.slug}/`)
  };

  return pageDocument({
    site,
    artists,
    title: artist.name,
    description: artist.metaDescription,
    canonicalPath: `/artists/${artist.slug}/`,
    body,
    jsonLd,
    ogImage: portraitSrc
  });
}

function notFoundPage(site, artists) {
  const body = `
    <section class="notFound">
      <div class="container notFoundInner">
        <p class="eyebrow">404</p>
        <h1>Siden blev ikke fundet.</h1>
        <p>Linket kan være forældet, eller siden kan være blevet flyttet.</p>
        <a class="button button--dark" href="/">Gå til forsiden</a>
      </div>
    </section>`;

  return pageDocument({
    site,
    artists,
    title: "Siden blev ikke fundet",
    description: "Den ønskede side blev ikke fundet.",
    canonicalPath: "/404.html",
    body
  });
}

async function writeFile(relativePath, content) {
  const destination = path.join(outDir, relativePath);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, content, "utf8");
}

async function verifyOutput() {
  const errors = [];
  const htmlFiles = [];

  async function walk(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(fullPath);
    }
  }

  await walk(outDir);

  const referencePattern = /(?:href|src)="([^"]+)"/g;
  for (const htmlPath of htmlFiles) {
    const html = await fs.readFile(htmlPath, "utf8");
    for (const match of html.matchAll(referencePattern)) {
      const reference = match[1];
      if (!reference.startsWith("/") || reference.startsWith("//")) continue;
      const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
      let target;
      if (pathname === "/") {
        target = path.join(outDir, "index.html");
      } else if (pathname.endsWith("/")) {
        target = path.join(outDir, pathname.slice(1), "index.html");
      } else {
        target = path.join(outDir, pathname.slice(1));
      }
      if (!(await exists(target))) {
        errors.push(`${path.relative(outDir, htmlPath)} henviser til en fil, der mangler: ${reference}`);
      }
    }
  }

  if (errors.length) {
    throw new Error(`Linkkontrollen fandt fejl:\n- ${errors.join("\n- ")}`);
  }

  return htmlFiles.length;
}

async function main() {
  const site = await readJson(path.join(dataDir, "site.json"));
  const artists = await readJson(path.join(dataDir, "artists.json"));
  validateSite(site);
  await validateArtists(artists);

  site.url = normalizeSiteUrl(process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || site.url);

  const galleries = await Promise.all(
    artists.map(async (artist) => ({ artist, artworks: await getArtworks(artist) }))
  );

  await fs.rm(outDir, { recursive: true, force: true });
  await fs.mkdir(outDir, { recursive: true });
  await fs.cp(publicDir, outDir, { recursive: true });
  await fs.mkdir(path.join(outDir, "assets"), { recursive: true });
  await fs.copyFile(path.join(sourceDir, "styles.css"), path.join(outDir, "assets", "styles.css"));
  await fs.copyFile(path.join(sourceDir, "gallery.js"), path.join(outDir, "assets", "gallery.js"));

  await writeFile("index.html", homePage(site, artists, galleries));

  for (const [index, { artist, artworks }] of galleries.entries()) {
    await writeFile(path.join("artists", artist.slug, "index.html"), artistPage(site, artists, artist, artworks, index));
  }

  await writeFile("404.html", notFoundPage(site, artists));

  const date = new Date().toISOString().slice(0, 10);
  const sitemapUrls = [
    { path: "/", priority: "1.0" },
    ...artists.map((artist) => ({ path: `/artists/${artist.slug}/`, priority: "0.8" }))
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls
    .map(({ path: pathname, priority }) => `  <url>\n    <loc>${escapeHtml(absoluteUrl(site.url, pathname))}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`)
    .join("\n")}\n</urlset>\n`;
  await writeFile("sitemap.xml", sitemap);
  await writeFile("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl(site.url, "/sitemap.xml")}\n`);
  await writeFile(
    "site.webmanifest",
    `${JSON.stringify({ name: site.name, short_name: site.shortName, start_url: "/", display: "standalone", background_color: "#f4f0e8", theme_color: "#f4f0e8", icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2)}\n`
  );

  const htmlCount = await verifyOutput();
  const artworkCount = galleries.reduce((sum, galleryItem) => sum + galleryItem.artworks.length, 0);
  const report = [
    "Kunstgalleri buildrapport",
    `Bygget: ${new Date().toISOString()}`,
    `Adresse: ${site.url}`,
    `HTML-sider: ${htmlCount}`,
    `Kunstnere: ${artists.length}`,
    `Kunstværker: ${artworkCount}`,
    "Resultat: OK"
  ].join("\n");
  await writeFile("BUILD-REPORT.txt", `${report}\n`);

  console.log("\nKunstgalleriet er bygget uden fejl.");
  console.log(`- ${htmlCount} HTML-sider`);
  console.log(`- ${artists.length} kunstnere`);
  console.log(`- ${artworkCount} kunstværker`);
  console.log(`- Output: ${outDir}`);
  if (checkOnly) console.log("- Kontrol: OK");
}

main().catch((error) => {
  console.error("\nBuild fejlede:\n");
  console.error(error.stack || error.message || error);
  process.exitCode = 1;
});
