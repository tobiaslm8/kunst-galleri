import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { artists } from "@/lib/artists";

export const metadata: Metadata = {
  title: {
    default: "Atelier Galleri | Kunst fra tre kunstnere",
    template: "%s | Atelier Galleri"
  },
  description:
    "En professionel, moderne og responsiv galleri-hjemmeside, der pr\u00e6senterer kunst fra tre kunstnere.",
  openGraph: {
    title: "Atelier Galleri",
    description: "Et minimalistisk digitalt galleri for tre kunstnere.",
    type: "website",
    images: ["/og-image.jpg"]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="da">
      <body className="min-h-screen bg-stone-50 text-stone-950 antialiased">
        <SiteHeader artists={artists} />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
