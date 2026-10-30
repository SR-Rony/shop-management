import { describe, expect, it } from 'vitest';

import { createSaleSchema } from './sales';

const validInput = {
  customerId: 'customer_1',
  items: [{ productId: 'product_1', quantity: 2 }],
};

describe('createSaleSchema', () => {
  it('accepts a valid sale and normalizes the decimal payment amount', () => {
    const parsed = createSaleSchema.parse({
      ...validInput,
      payments: [{ amount: '50.5', method: 'BKASH' }],
    });

    expect(parsed.customerId).toBe('customer_1');
    expect(parsed.items[0].quantity).toBe(2);
    expect(parsed.payments[0].amount.toFixed(2)).toBe('50.50');
    expect(parsed.payments[0].method).toBe('BKASH');
  });

  it('defaults the payment method to CASH', () => {
    const parsed = createSaleSchema.parse({
      ...validInput,
      payments: [{ amount: 10 }],
    });

    expect(parsed.payments[0].method).toBe('CASH');
    expect(parsed.payments[0].amount.toFixed(2)).toBe('10.00');
  });

  it('defaults payments to an empty list', () => {
    const parsed = createSaleSchema.parse(validInput);

    expect(parsed.payments).toEqual([]);
  });

  it('rejects an empty item list', () => {
    const result = createSaleSchema.safeParse({ ...validInput, items: [] });

    expect(result.success).toBe(false);
  });

  it('rejects zero, negative and over-precise payment amounts', () => {
    for (const amount of ['0', '-5.00', '10.001']) {
      const result = createSaleSchema.safeParse({
        ...validInput,
        payments: [{ amount }],
      });

      expect(result.success, amount).toBe(false);
    }
  });

  it('rejects non-positive or fractional quantities', () => {
    for (const quantity of [0, -1, 1.5]) {
      const result = createSaleSchema.safeParse({
        ...validInput,
        items: [{ productId: 'product_1', quantity }],
      });

      expect(result.success, String(quantity)).toBe(false);
    }
  });

  it('rejects an invalid paidAt timestamp', () => {
    const result = createSaleSchema.safeParse({
      ...validInput,
      payments: [{ amount: '10.00', paidAt: 'not-a-date' }],
    });

    expect(result.success).toBe(false);
  });
});
