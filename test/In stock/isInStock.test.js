import { describe, expect, test } from "vitest";
import isInStock from "./isInStock";

describe('isInStock', () => {
  test('returns true when stock is greater than 0', () => {
    expect(isInStock({ name: 'Rice', stock: 5 })).toBe(true);
  });

  test('returns false when stock is 0', () => {
    expect(isInStock({ name: 'Rice', stock: 0 })).toBe(false);
  });

  test('returns false when stock is missing', () => {
    expect(isInStock({ name: 'Rice' })).toBe(false);
  });

  test('returns false when stock is null', () => {
    expect(isInStock({ name: 'Rice', stock: null })).toBe(false);
  });

  test('returns false when stock is undefined', () => {
    expect(isInStock({ name: 'Rice', stock: undefined })).toBe(false);
  });

  test('returns false when stock is negative', () => {
    expect(isInStock({ name: 'Rice', stock: -3 })).toBe(false);
  });
});