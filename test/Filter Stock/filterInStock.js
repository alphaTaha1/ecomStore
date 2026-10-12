export function filterInStock(products) {
  if (!Array.isArray(products)) {
    return [];
  }

  return products.filter(
    (product) =>
      typeof product?.stock === "number" &&
      Number.isFinite(product.stock) &&
      product.stock > 0
  );
}
