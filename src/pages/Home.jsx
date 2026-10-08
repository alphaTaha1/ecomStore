import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Home({ products }) {
  const dummyProducts = [
    {
      id: "dummy-1",
      name: "Wireless Headphones",
      price: 4999,
      imageUrl:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
      description: "Premium wireless headphones with clear sound and deep bass.",
    },
    {
      id: "dummy-2",
      name: "Smart Watch",
      price: 7999,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      description: "Modern smartwatch with fitness tracking and notifications.",
    },
    {
      id: "dummy-3",
      name: "Running Shoes",
      price: 6499,
      imageUrl:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      description: "Comfortable running shoes designed for everyday activity.",
    },
    {
      id: "dummy-4",
      name: "Backpack",
      price: 3499,
      imageUrl:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
      description: "Durable backpack with plenty of space for everyday essentials.",
    },
  ];

  // Use Firebase products when available.
  // Otherwise, display dummy products.
  const productsToDisplay =
    products && products.length > 0 ? products : dummyProducts;

  const featuredProducts = productsToDisplay.slice(0, 4);

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

          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* View All Products */}
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