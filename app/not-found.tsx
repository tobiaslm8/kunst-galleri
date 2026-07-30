import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-5 py-24 text-center sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">404</p>
      <h1 className="mt-5 font-serif text-5xl tracking-[-0.04em] text-stone-950 sm:text-6xl">
        Siden findes ikke
      </h1>
      <p className="mt-5 text-base leading-8 text-stone-600">
        Den kunstner eller side, du leder efter, findes ikke i projektets datafil.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-stone-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-950/20"
      >
        G&aring; til forsiden
      </Link>
    </section>
  );
}
