const environmentUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Atelier Galleri",
  shortName: "Atelier",
  description:
    "Et roligt, moderne og responsivt onlinegalleri med kunst fra tre kunstnere.",
  url: (environmentUrl || "http://localhost:3000").replace(/\/$/, ""),
  email: "kontakt@example.com",
  instagramUrl: "https://www.instagram.com/",
  instagramLabel: "Instagram"
} as const;

export function absoluteUrl(pathname = "/"): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.url}${normalizedPath}`;
}
