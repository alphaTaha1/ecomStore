import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loader from "../../components/Loader.jsx";
import { formatCurrency } from "../../utils/helpers.js";
import { getProductById } from "./productService.js";

export default function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    setLoading(true);
    setError("");
    getProductById(productId)
      .then((result) => {
        if (isCurrent) setProduct(result);
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(loadError.message || "Unable to load this product.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [productId]);

  return (
    <section className="container content-section">
      <p className="eyebrow">Product details</p>
      {loading ? (
        <Loader label="Loading product..." />
      ) : error ? (
        <div className="feedback-message feedback-error" role="alert">
          Unable to load this product: {error}
        </div>
      ) : product ? (
        <article className="product-details">
          {product.imageUrl ? (
            <img
              alt={product.name}
              className="product-details-image"
              src={product.imageUrl}
            />
          ) : (
            <div
              aria-label="Product image unavailable"
              className="product-details-image product-image-placeholder"
              role="img"
            >
              Image unavailable
            </div>
          )}
          <div className="product-details-copy">
            {product.category && <p className="eyebrow">{product.category}</p>}
            <h1 className="page-heading">{product.name}</h1>
            <p className="price product-details-price">
              {formatCurrency(Number(product.price))}
            </p>
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            {Number.isFinite(Number(product.stock)) && (
              <p className="stock-status">
                {Number(product.stock) > 0
                  ? `${Number(product.stock)} in stock`
                  : "Out of stock"}
              </p>
            )}
          </div>
        </article>
      ) : (
        <div className="empty-state">
          <h1 className="section-heading">Product not found</h1>
          <p className="placeholder-copy">
            This product may have been removed or is no longer available.
          </p>
        </div>
      )}
      <Link className="text-link" to="/products">
        Back to products
      </Link>
    </section>
  );
}
