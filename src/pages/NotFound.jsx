import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home({ products = [] }) {
  const featuredProducts = products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="hero-container">

          <div className="hero-content">
            <h1>
              Shop smarter.
              <br />
              <span>Live better.</span>
            </h1>

            <p>
              Discover quality products at great prices.
              Browse our collection and find something you'll love.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">
                Shop Now
              </Link>

              <Link to="/register" className="btn btn-outline">
                Create Account
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <h3>Everything you need</h3>

            <p>
              Browse products, add your favorites to the cart,
              checkout easily, and track your orders from one place.
            </p>
          </div>

        </div>
      </section>

      <section className="section">
        <div className="page-container">

          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Check out some of our latest products.</p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No products yet</h2>
              <p>
                Products will appear here once the catalog is populated.
              </p>

              <Link
                to="/products"
                className="btn btn-primary"
              >
                Browse Products
              </Link>
            </div>
          )}

        </div>
      </section>
    </>
  );
}

export default Home;