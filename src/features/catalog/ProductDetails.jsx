import { Link, useParams } from "react-router-dom";

export default function ProductDetails() {
  const { productId } = useParams();

  return (
    <section className="container content-section">
      <p className="eyebrow">Product details</p>
      <h1 className="page-heading">Product {productId}</h1>
      <p className="placeholder-copy">
        Load product information and add-to-cart actions here.
      </p>
      <Link className="text-link" to="/products">
        Back to products
      </Link>
    </section>
  );
}
