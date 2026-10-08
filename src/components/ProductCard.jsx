import { Link } from "react-router-dom";
import AddToCartButton from "./AddToCartButton.jsx";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div aria-label={product.name} className="product-card-image" role="img">
        Product image
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <Link className="text-link" to={`/products/${product.id}`}>
          View product
        </Link>
        <AddToCartButton className="product-card-action" product={product} />
      </div>
    </article>
  );
}
