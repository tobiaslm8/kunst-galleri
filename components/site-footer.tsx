export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="font-serif text-3xl tracking-[-0.03em]">Atelier Galleri</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
            En rolig digital ramme om tre kunstneres malerier, processer og visuelle universer.
            Udskift nemt kunstnere, tekster og billeder i projektets datafil og billedmapper.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-400">Kontakt</p>
          <div className="mt-4 space-y-2 text-sm text-stone-300">
            <p>kontakt@galleri.dk</p>
            <p>+45 12 34 56 78</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-400">Sociale medier</p>
          <div className="mt-4 space-y-2 text-sm text-stone-300">
            <p>Instagram</p>
            <p>Facebook</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-stone-500 sm:px-8">
        &copy; {new Date().getFullYear()} Atelier Galleri. Alle rettigheder forbeholdes.
      </div>
    </footer>
  );
}
