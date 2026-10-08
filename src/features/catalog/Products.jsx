import ProductCard from "../../components/ProductCard.jsx";

const products = [];

export default function Products() {
  return (
    <section className="container content-section">
      <p className="eyebrow">The collection</p>
      <h1 className="page-heading">Shop products</h1>
      {products.length ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2 className="section-heading">Your catalog starts here</h2>
          <p className="placeholder-copy">
            Connect the product service to display your products.
          </p>
        </div>
      )}
    </section>
  );
}
