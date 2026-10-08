import { useState } from "react";
import { Link } from "react-router-dom";

import { createProduct } from "../features/catalog/productService.js";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  stock: "",
};

export default function AdminProducts() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setCreatedProduct(null);

    const price = Number(form.price);
    const stock = Number(form.stock);
    if (
      form.name.trim().length < 2 ||
      !form.description.trim() ||
      !form.category.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Enter a product name, description, category, a price above zero, and a whole-number stock quantity."
      );
      return;
    }

    setLoading(true);

    try {
      const product = await createProduct({
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category.trim(),
        imageUrl: form.imageUrl.trim(),
        stock,
      });
      setCreatedProduct(product);
      setForm(initialForm);
    } catch (saveError) {
      setError(saveError.message || "Unable to create this product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container content-section">
      <p className="eyebrow">Store management</p>
      <h1 className="page-heading">Manage products</h1>
      <div className="admin-product-layout">
        <form className="product-form" onSubmit={handleSubmit}>
          <h2 className="section-heading">Add a product</h2>

          {error && (
            <div className="feedback-message feedback-error" role="alert">
              Unable to create product: {error}
            </div>
          )}
          {createdProduct && (
            <div className="feedback-message feedback-success" role="status">
              Product created.{" "}
              <Link to={`/products/${createdProduct.id}`}>
                View {createdProduct.name}
              </Link>
            </div>
          )}

          <div className="form-field">
            <label className="field-label" htmlFor="product-name">
              Product name
            </label>
            <input
              autoComplete="off"
              className="form-input"
              id="product-name"
              maxLength={120}
              minLength={2}
              name="name"
              onChange={handleChange}
              required
              value={form.name}
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="product-description">
              Description
            </label>
            <textarea
              className="form-input form-textarea"
              id="product-description"
              maxLength={2000}
              name="description"
              onChange={handleChange}
              required
              rows={5}
              value={form.description}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="field-label" htmlFor="product-price">
                Price (USD)
              </label>
              <input
                className="form-input"
                id="product-price"
                min="0.01"
                name="price"
                onChange={handleChange}
                required
                step="0.01"
                type="number"
                value={form.price}
              />
            </div>
            <div className="form-field">
              <label className="field-label" htmlFor="product-stock">
                Stock quantity
              </label>
              <input
                className="form-input"
                id="product-stock"
                min="0"
                name="stock"
                onChange={handleChange}
                required
                step="1"
                type="number"
                value={form.stock}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="product-category">
              Category
            </label>
            <input
              className="form-input"
              id="product-category"
              maxLength={80}
              name="category"
              onChange={handleChange}
              required
              value={form.category}
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="product-image">
              Image URL <span className="field-hint">(optional)</span>
            </label>
            <input
              className="form-input"
              id="product-image"
              name="imageUrl"
              onChange={handleChange}
              type="url"
              value={form.imageUrl}
            />
          </div>

          <button className="button" disabled={loading} type="submit">
            {loading ? "Creating product..." : "Create product"}
          </button>
        </form>
      </div>
    </section>
  );
}
