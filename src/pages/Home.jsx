import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import {
  getProducts,
  seedSampleProducts,
} from "../features/catalog/productService";

const dummyInventory = [
  {
    id: "inventory-1",
    name: "Wireless Headphones",
    description:
      "Premium wireless headphones with clear sound and deep bass.",
    price: 4999,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    sku: "AUD-001",
    category: "Electronics",
    stock: 24,
  },
  {
    id: "inventory-2",
    name: "Smart Watch",
    description:
      "Modern smartwatch with fitness tracking and notifications.",
    price: 7999,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    sku: "WAT-002",
    category: "Electronics",
    stock: 8,
  },
  {
    id: "inventory-3",
    name: "Running Shoes",
    description:
      "Comfortable running shoes designed for everyday activity.",
    price: 6499,
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    sku: "SHO-003",
    category: "Footwear",
    stock: 4,
  },
  {
    id: "inventory-4",
    name: "Backpack",
    description:
      "Durable backpack with plenty of space for everyday essentials.",
    price: 3499,
    imageUrl:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    sku: "BAG-004",
    category: "Accessories",
    stock: 16,
  },
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        await seedSampleProducts(dummyInventory);
        setProducts(await getProducts());
      } catch (error) {
        console.error("Error seeding or loading products:", error);
        setError("Unable to load products or save sample inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productsToDisplay =
    products.length > 0 ? products : dummyInventory;

  const featuredProducts = productsToDisplay.slice(0, 4);
  const inventoryToDisplay =
    products.filter(
      (product) =>
        typeof product.sku === "string" && typeof product.stock === "number"
    );
  const inventoryItems =
    inventoryToDisplay.length > 0 ? inventoryToDisplay : dummyInventory;

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

          {loading ? (
            <p>Loading products...</p>
          ) : (
            <>
              {error && (
                <p className="auth-error">
                  {error} Showing sample products instead.
                </p>
              )}

              <div className="product-grid">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}

          <div className="section-action">
            <Link
              to="/products"
              className="btn btn-primary"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Sample Inventory */}
      <section className="section inventory-section">
        <div className="page-container">
          <div className="section-title">
            <h2>Sample Inventory</h2>
            <p>A list of sample items currently stored in inventory.</p>
          </div>

          <div className="inventory-table-wrapper">
            <table className="inventory-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">SKU</th>
                  <th scope="col">Category</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td>{item.category}</td>
                    <td>{item.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.stock <= 5 ? "status-pending" : "status-paid"
                        }`}
                      >
                        {item.stock <= 5 ? "Low stock" : "In stock"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;