import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../features/auth/firebase/config";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const productsSnapshot = await getDocs(
          collection(db, "products")
        );

        const productsData = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Products from Firebase:", productsData);

        setProducts(productsData);
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <>
      {/* Hero Section */}
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

      {/* Featured Products */}
      <section className="section">
        <div className="page-container">

          <div className="section-title">
            <h2>Featured Products</h2>
            <p>Check out some of our latest products.</p>
          </div>

          {loading && (
            <p>Loading products...</p>
          )}

          {error && (
            <p className="auth-error">{error}</p>
          )}

          {!loading && !error && products.length === 0 && (
            <p>No products found.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}

          <div className="section-action">
            <Link to="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}

export default Home;