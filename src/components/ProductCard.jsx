import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      {product.imageUrl ? (
        <img
          alt={product.name}
          className="product-card-image"
          loading="lazy"
          src={product.imageUrl}
        />
      ) : (
        <div
          aria-label={`${product.name} image unavailable`}
          className="product-card-image product-image-placeholder"
          role="img"
        >
          Image unavailable
        </div>
      )}
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="price">${Number(product.price).toFixed(2)}</p>
        <Link className="text-link" to={`/products/${product.id}`}>
          View product
        </Link>
      </div>
    </article>
  );
}
