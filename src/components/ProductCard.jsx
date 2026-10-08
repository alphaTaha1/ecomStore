import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="product-image"
        />
      ) : (
        <div className="product-image-placeholder">
          No Image
        </div>
      )}

      <div className="product-info">
        <div className="product-category">
          {product.category || "Product"}
        </div>

        <h3 className="product-name">
          {product.name}
        </h3>

        <p className="product-description">
          {product.description || "No description available."}
        </p>

        <div className="product-bottom">
          <span className="product-price">
            ${Number(product.price || 0).toFixed(2)}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="btn btn-primary"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;