import { filterInStock } from './filterInStock';
import { describe, test, expect } from 'vitest';

const rice = { id: '1', name: 'Rice', stock: 10 };
const milk = { id: '2', name: 'Milk', stock: 0 };
const eggs = { id: '3', name: 'Eggs', stock: 24 };

describe('filterInStock', () => {
  test('returns an empty array for an empty array', () => {
    expect(filterInStock([])).toEqual([]);
  });

  test('returns all products when all are in stock', () => {
    expect(filterInStock([rice, eggs])).toEqual([rice, eggs]);
  });

  test('returns an empty array when none are in stock', () => {
    expect(filterInStock([milk, { ...milk, id: '4' }])).toEqual([]);
  });

  test('returns only in-stock products from a mixed list', () => {
    expect(filterInStock([rice, milk, eggs])).toEqual([rice, eggs]);
  });

  test('keeps the original order', () => {
    const result = filterInStock([eggs, milk, rice]);
    expect(result.map((p) => p.id)).toEqual(['3', '1']);
  });

  test('does not mutate the input array', () => {
    const input = [rice, milk, eggs];
    const copy = [...input];
    filterInStock(input);
    expect(input).toEqual(copy);
  });
});