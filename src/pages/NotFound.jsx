import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container content-section">
      <p className="eyebrow">404 error</p>
      <h1 className="page-heading">Page not found</h1>
      <p className="placeholder-copy">
        The page you’re looking for doesn’t exist.
      </p>
      <Link className="text-link" to="/">
        Return home
      </Link>
    </section>
  );
}
