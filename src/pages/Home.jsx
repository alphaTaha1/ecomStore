import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container hero">
      <p className="eyebrow">Thoughtfully selected</p>
      <h1>Find something you’ll love.</h1>
      <p className="hero-copy">
        Welcome to ecomStore. Explore the collection and discover your next
        favorite.
      </p>
      <Link className="button" to="/products">
        Explore products
      </Link>
    </section>
  );
}
