export default function isInStock(product) {
  return (
    typeof product?.stock === "number" &&
    Number.isFinite(product.stock) &&
    product.stock > 0
  );
}
