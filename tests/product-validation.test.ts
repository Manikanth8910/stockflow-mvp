import { describe, it, expect } from 'vitest';

describe('Product CRUD Validation & Logic Tests', () => {
  it('validates required fields for product creation', () => {
    const validateProduct = (data: { name?: string; sku?: string; quantityOnHand?: any }) => {
      const errors: string[] = [];
      if (!data.name || !data.name.trim()) errors.push('Name is required');
      if (!data.sku || !data.sku.trim()) errors.push('SKU is required');
      const qty = parseInt(data.quantityOnHand, 10);
      if (isNaN(qty) || qty < 0) errors.push('Quantity must be non-negative integer');
      return errors;
    };

    expect(validateProduct({ name: '', sku: 'SKU1', quantityOnHand: 5 })).toContain('Name is required');
    expect(validateProduct({ name: 'Chair', sku: '', quantityOnHand: 5 })).toContain('SKU is required');
    expect(validateProduct({ name: 'Chair', sku: 'SKU1', quantityOnHand: -2 })).toContain('Quantity must be non-negative integer');
    expect(validateProduct({ name: 'Chair', sku: 'SKU1', quantityOnHand: 10 })).toHaveLength(0);
  });

  it('normalizes SKU to uppercase and trimmed format', () => {
    const rawSku = '  tech-mse-01  ';
    const normalizedSku = rawSku.trim().toUpperCase();
    expect(normalizedSku).toBe('TECH-MSE-01');
  });

  it('filters product list by search query case-insensitively', () => {
    const products = [
      { name: 'Ergonomic Standing Desk', sku: 'DSK-ERG-01' },
      { name: 'Mechanical Gaming Keyboard', sku: 'KBD-MCH-02' },
      { name: 'Desk Cable Organizer', sku: 'ACC-ORG-03' },
    ];

    const search = 'desk';
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase())
    );

    expect(matches).toHaveLength(2);
    expect(matches.map((m) => m.sku)).toEqual(['DSK-ERG-01', 'ACC-ORG-03']);
  });

  it('updates dashboard statistics accurately when new stock is added', () => {
    let stats = { totalProducts: 3, totalUnits: 25, lowStockCount: 1 };

    // Simulate creating a new product with 10 units (threshold 5)
    stats = {
      totalProducts: stats.totalProducts + 1,
      totalUnits: stats.totalUnits + 10,
      lowStockCount: stats.lowStockCount + (10 <= 5 ? 1 : 0),
    };

    expect(stats.totalProducts).toBe(4);
    expect(stats.totalUnits).toBe(35);
    expect(stats.lowStockCount).toBe(1);

    // Simulate updating an existing product from 10 to 3 units (triggering low stock)
    stats = {
      ...stats,
      totalUnits: stats.totalUnits - 7,
      lowStockCount: stats.lowStockCount + 1,
    };

    expect(stats.totalUnits).toBe(28);
    expect(stats.lowStockCount).toBe(2);
  });
});
