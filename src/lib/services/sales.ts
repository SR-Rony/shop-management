import 'server-only';

import { Prisma, SaleStatus } from '@/generated/prisma/client';
import type { SaleGetPayload } from '@/generated/prisma/models';
import { prisma } from '@/lib/db/prisma';
import { ConflictError, NotFoundError, ValidationError } from '@/lib/errors/app-error';
import { roundMoney, toMoney } from '@/lib/money/decimal';
import type { CreateSaleInput } from '@/lib/validation/sales';

const saleInclude = {
  customer: true,
  items: {
    include: {
      product: {
        select: { id: true, name: true, sku: true },
      },
    },
  },
  payments: true,
} as const;

type SaleWithRelations = SaleGetPayload<{
  include: {
    customer: true;
    items: { include: { product: { select: { id: true; name: true; sku: true } } } };
    payments: true;
  };
}>;

function serializeSale(sale: SaleWithRelations) {
  return {
    id: sale.id,
    invoiceNo: sale.invoiceNo,
    customerId: sale.customerId,
    totalAmount: sale.totalAmount.toFixed(2),
    paidAmount: sale.paidAmount.toFixed(2),
    status: sale.status,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
    customer: sale.customer,
    items: sale.items.map((item) => ({
      id: item.id,
      saleId: item.saleId,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice.toFixed(2),
      lineTotal: item.lineTotal.toFixed(2),
      createdAt: item.createdAt,
      product: item.product,
    })),
    payments: [...sale.payments]
      .sort((left, right) => left.paidAt.getTime() - right.paidAt.getTime())
      .map((payment) => ({
        id: payment.id,
        saleId: payment.saleId,
        amount: payment.amount.toFixed(2),
        method: payment.method,
        reference: payment.reference,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      })),
  };
}

function mergeSaleItems(items: CreateSaleInput['items']) {
  const quantities = new Map<string, number>();

  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  return Array.from(quantities, ([productId, quantity]) => ({ productId, quantity }));
}

function invoiceDateKey(now = new Date()): string {
  const timeZone = process.env.DEFAULT_TIMEZONE || 'Asia/Dhaka';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const part = (type: string) => parts.find((entry) => entry.type === type)?.value ?? '';

  return `${part('year')}${part('month')}${part('day')}`;
}

/**
 * Allocate the next invoice number for the shop's local date. Prisma compiles
 * this simple upsert to a native INSERT ... ON CONFLICT ... DO UPDATE, so
 * concurrent sales cannot receive the same number. Running inside the sale
 * transaction also rolls the counter back if the sale fails.
 */
async function nextInvoiceNumber(tx: Prisma.TransactionClient): Promise<string> {
  const key = invoiceDateKey();
  const sequence = await tx.invoiceSequence.upsert({
    where: { key },
    create: { key, lastValue: 1 },
    update: { lastValue: { increment: 1 } },
  });

  return `INV-${key}-${String(sequence.lastValue).padStart(4, '0')}`;
}

export async function listSales(options: { status?: SaleStatus; limit?: number } = {}) {
  const sales = await prisma.sale.findMany({
    where: options.status ? { status: options.status } : undefined,
    include: saleInclude,
    orderBy: { createdAt: 'desc' },
    take: options.limit ?? 50,
  });

  return sales.map(serializeSale);
}

export async function createSale(input: CreateSaleInput & { createdById?: string }) {
  const items = mergeSaleItems(input.items);

  return prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: { id: input.customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new NotFoundError('Customer not found.');
    }

    const products = await tx.product.findMany({
      where: { id: { in: items.map((item) => item.productId) } },
    });

    if (products.length !== items.length) {
      const found = new Set(products.map((product) => product.id));
      const missing = items.find((item) => !found.has(item.productId));
      throw new NotFoundError(`Product not found: ${missing?.productId ?? 'unknown'}.`);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));

    const lines = items.map((item) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new NotFoundError(`Product not found: ${item.productId}.`);
      }

      const unitPrice = roundMoney(toMoney(product.price.toString()));
      const lineTotal = roundMoney(unitPrice.times(item.quantity));

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      };
    });

    const totalAmount = roundMoney(
      lines.reduce((total, line) => total.plus(line.lineTotal), toMoney('0')),
    );

    const paidAmount = roundMoney(
      input.payments.reduce((total, payment) => total.plus(payment.amount), toMoney('0')),
    );

    if (paidAmount.gt(totalAmount)) {
      throw new ValidationError('Payment total cannot exceed the sale total.');
    }

    const status: SaleStatus = paidAmount.eq(0)
      ? 'PENDING'
      : paidAmount.gte(totalAmount)
        ? 'PAID'
        : 'PARTIALLY_PAID';

    // Conditional decrement prevents overselling: if another transaction has
    // already consumed the stock, the affected-row count is zero and we abort.
    for (const line of lines) {
      const updated = await tx.product.updateMany({
        where: {
          id: line.productId,
          stockQty: { gte: line.quantity },
        },
        data: { stockQty: { decrement: line.quantity } },
      });

      if (updated.count !== 1) {
        const current = await tx.product.findUnique({
          where: { id: line.productId },
          select: { name: true, stockQty: true },
        });

        throw new ConflictError(
          `Insufficient stock for ${current?.name ?? line.productId}. Available: ${
            current?.stockQty ?? 0
          }, requested: ${line.quantity}.`,
        );
      }
    }

    const invoiceNo = await nextInvoiceNumber(tx);

    const sale = await tx.sale.create({
      data: {
        invoiceNo,
        customerId: input.customerId,
        totalAmount: totalAmount.toFixed(2),
        paidAmount: paidAmount.toFixed(2),
        status,
        createdById: input.createdById,
        items: {
          create: lines.map((line) => ({
            productId: line.productId,
            quantity: line.quantity,
            unitPrice: line.unitPrice.toFixed(2),
            lineTotal: line.lineTotal.toFixed(2),
          })),
        },
        ...(input.payments.length > 0
          ? {
              payments: {
                create: input.payments.map((payment) => ({
                  amount: roundMoney(payment.amount).toFixed(2),
                  method: payment.method,
                  reference: payment.reference || null,
                  ...(payment.paidAt ? { paidAt: new Date(payment.paidAt) } : {}),
                })),
              },
            }
          : {}),
      },
      include: saleInclude,
    });

    await tx.inventoryMovement.createMany({
      data: lines.map((line) => ({
        productId: line.productId,
        type: 'SALE',
        quantity: -line.quantity,
        referenceId: sale.id,
      })),
    });

    return serializeSale(sale);
  });
}
