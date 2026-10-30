import Decimal from 'decimal.js';
import { z } from 'zod';

import { PaymentMethod } from '../../generated/prisma/client';

const paymentAmountSchema = z
  .union([z.string(), z.number().finite()])
  .transform((value) => String(value).trim())
  .refine((value) => {
    try {
      const amount = new Decimal(value);
      return amount.isFinite() && amount.gt(0) && amount.decimalPlaces() <= 2;
    } catch {
      return false;
    }
  }, 'Amount must be a positive decimal with at most 2 decimal places.')
  .transform((value) => new Decimal(value));

export const createSaleSchema = z.object({
  customerId: z.string().trim().min(1, 'customerId is required.'),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, 'productId is required.'),
        quantity: z.number().int().positive().max(1_000_000),
      }),
    )
    .min(1, 'At least one sale item is required.'),
  payments: z
    .array(
      z.object({
        amount: paymentAmountSchema,
        method: z.enum(PaymentMethod).default(PaymentMethod.CASH),
        reference: z.string().trim().max(120).optional(),
        paidAt: z.string().datetime().optional(),
      }),
    )
    .optional()
    .default([]),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
