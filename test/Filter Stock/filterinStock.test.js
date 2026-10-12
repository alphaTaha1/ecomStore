import { describe, test, expect } from "vitest";
import { getProducts } from "../../src/features/catalog/productService.js";
import { filterInStock } from "./filterInStock.js";
describe("filterInStock - Firebase integration", () => {
  test("returns only products with positive stock", async () => {
    const products = await getProducts();
    const result = filterInStock(products);

    expect(
      result.every(
        (product) =>
          typeof product.stock === "number" &&
          Number.isFinite(product.stock) &&
          product.stock > 0
      )
    ).toBe(true);
  });

  test("preserves the order of in-stock products", async () => {
    const products = await getProducts();
    const result = filterInStock(products);

    const expected = products.filter(
      (product) =>
        typeof product.stock === "number" &&
        Number.isFinite(product.stock) &&
        product.stock > 0
    );

    expect(result).toEqual(expected);
  });

  test("does not mutate the products returned by Firebase", async () => {
    const products = await getProducts();
    const original = structuredClone(products);

    filterInStock(products);

    expect(products).toEqual(original);
  });
});
