import { useEffect, useState } from "react";

import Loader from "../../components/Loader.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { getProducts } from "./productService.js";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    getProducts()
      .then((result) => {
        if (isCurrent) setProducts(result);
      })
      .catch((loadError) => {
        if (isCurrent) {
          setError(loadError.message || "Unable to load products.");
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter((product) =>
    [product.name, product.description, product.category]
      .filter((value) => typeof value === "string")
      .some((value) => value.toLowerCase().includes(normalizedSearch))
  );

  return (
    <section className="container content-section">
      <p className="eyebrow">The collection</p>
      <h1 className="page-heading">Shop products</h1>

      <div className="catalog-toolbar">
        <label className="field-label" htmlFor="product-search">
          Search products
        </label>
        <input
          autoComplete="off"
          className="form-input search-input"
          id="product-search"
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by name, description, or category"
          type="search"
          value={searchTerm}
        />
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : error ? (
        <div className="feedback-message feedback-error" role="alert">
          Unable to load products: {error}
        </div>
      ) : filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 className="section-heading">
            {normalizedSearch
              ? "No matching products"
              : "Your catalog starts here"}
          </h2>
          <p className="placeholder-copy">
            {normalizedSearch
              ? "Try a different name, description, or category."
              : "There are no products to display yet."}
          </p>
        </div>
      )}
    </section>
  );
}
