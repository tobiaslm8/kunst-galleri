import Link from "next/link";

export default function NotFoundPage() {
  return (
    <section className="notFound">
      <div className="container notFoundInner">
        <p className="eyebrow">404</p>
        <h1>Siden blev ikke fundet.</h1>
        <p>Linket kan være forældet, eller siden kan være blevet flyttet.</p>
        <Link className="button button--dark" href="/">
          Gå til forsiden
        </Link>
      </div>
    </section>
  );
}
