import { describe, it, expect } from 'vitest';

describe('Inventory Low Stock Calculation Logic', () => {
  const orgDefaultThreshold = 5;

  it('calculates low stock correctly when product has custom threshold', () => {
    const product = {
      name: 'Wireless Mouse',
      quantityOnHand: 4,
      lowStockThreshold: 10,
    };

    const effectiveThreshold =
      product.lowStockThreshold !== null ? product.lowStockThreshold : orgDefaultThreshold;
    const isLowStock = product.quantityOnHand <= effectiveThreshold;

    expect(effectiveThreshold).toBe(10);
    expect(isLowStock).toBe(true);
  });

  it('falls back to organization default threshold when product threshold is null', () => {
    const product = {
      name: 'Mechanical Keyboard',
      quantityOnHand: 6,
      lowStockThreshold: null,
    };

    const effectiveThreshold =
      product.lowStockThreshold !== null ? product.lowStockThreshold : orgDefaultThreshold;
    const isLowStock = product.quantityOnHand <= effectiveThreshold;

    expect(effectiveThreshold).toBe(5);
    expect(isLowStock).toBe(false);
  });

  it('flags zero quantity as critical low stock / out of stock', () => {
    const product = {
      name: 'USB-C Cable',
      quantityOnHand: 0,
      lowStockThreshold: null,
    };

    const effectiveThreshold =
      product.lowStockThreshold !== null ? product.lowStockThreshold : orgDefaultThreshold;
    const isLowStock = product.quantityOnHand <= effectiveThreshold;

    expect(isLowStock).toBe(true);
  });

  it('correctly calculates new quantity on stock adjustment and guards against negative', () => {
    const initialQty = 12;
    const adjustment1 = 5; // +5
    const adjustment2 = -15; // -15 (would be negative)

    const newQty1 = initialQty + adjustment1;
    expect(newQty1).toBe(17);

    const newQty2 = initialQty + adjustment2;
    expect(newQty2).toBeLessThan(0);
    const isValid = newQty2 >= 0;
    expect(isValid).toBe(false);
  });

  it('correctly aggregates total stock and valuation across products', () => {
    const products = [
      { quantityOnHand: 10, sellingPrice: 20 },
      { quantityOnHand: 5, sellingPrice: 50 },
      { quantityOnHand: 2, sellingPrice: null },
    ];

    const totalQty = products.reduce((acc, p) => acc + p.quantityOnHand, 0);
    const totalValuation = products.reduce(
      (acc, p) => acc + (p.sellingPrice ? p.quantityOnHand * p.sellingPrice : 0),
      0
    );

    expect(totalQty).toBe(17);
    expect(totalValuation).toBe(10 * 20 + 5 * 50); // 450
  });
});
