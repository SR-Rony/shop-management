import { config as loadEnv } from 'dotenv';
import Decimal from 'decimal.js';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

loadEnv({ path: ['.env.local', '.env'], quiet: true });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not configured.');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SEED_PREFIX = 'seed_';

const categories = [
  {
    id: 'seed_cat_grocery',
    name: 'Grocery & Staples',
    description: 'Rice, lentils, oil, sugar, salt and everyday cooking essentials.',
  },
  {
    id: 'seed_cat_beverages',
    name: 'Beverages',
    description: 'Tea, milk powder and packaged drinks.',
  },
  {
    id: 'seed_cat_household',
    name: 'Household',
    description: 'Cleaning and laundry supplies.',
  },
  {
    id: 'seed_cat_personal_care',
    name: 'Personal Care',
    description: 'Soap, toothpaste and daily hygiene products.',
  },
];

const products = [
  {
    id: 'seed_prod_rice_5kg',
    name: 'Miniket Rice 5kg',
    sku: 'GRO-RICE-5KG',
    categoryId: 'seed_cat_grocery',
    price: '480.00',
    cost: '430.00',
    openingQty: 80,
  },
  {
    id: 'seed_prod_masoor_dal_1kg',
    name: 'Masoor Dal 1kg',
    sku: 'GRO-DAL-1KG',
    categoryId: 'seed_cat_grocery',
    price: '145.00',
    cost: '125.00',
    openingQty: 60,
  },
  {
    id: 'seed_prod_soybean_oil_1l',
    name: 'Soybean Oil 1L',
    sku: 'GRO-OIL-1L',
    categoryId: 'seed_cat_grocery',
    price: '185.00',
    cost: '168.00',
    openingQty: 70,
  },
  {
    id: 'seed_prod_sugar_1kg',
    name: 'Sugar 1kg',
    sku: 'GRO-SUGAR-1KG',
    categoryId: 'seed_cat_grocery',
    price: '135.00',
    cost: '120.00',
    openingQty: 55,
  },
  {
    id: 'seed_prod_tea_400g',
    name: 'Ispahani Mirzapore Tea 400g',
    sku: 'BEV-TEA-400G',
    categoryId: 'seed_cat_beverages',
    price: '295.00',
    cost: '260.00',
    openingQty: 45,
  },
  {
    id: 'seed_prod_milk_powder_500g',
    name: 'Fresh Milk Powder 500g',
    sku: 'BEV-MILK-500G',
    categoryId: 'seed_cat_beverages',
    price: '420.00',
    cost: '390.00',
    openingQty: 40,
  },
  {
    id: 'seed_prod_soap_100g',
    name: 'Lux Soap 100g',
    sku: 'PC-SOAP-100G',
    categoryId: 'seed_cat_personal_care',
    price: '65.00',
    cost: '52.00',
    openingQty: 100,
  },
  {
    id: 'seed_prod_detergent_1kg',
    name: 'Surf Excel 1kg',
    sku: 'HH-DET-1KG',
    categoryId: 'seed_cat_household',
    price: '310.00',
    cost: '280.00',
    openingQty: 50,
  },
  {
    id: 'seed_prod_toothpaste_100g',
    name: 'Colgate Toothpaste 100g',
    sku: 'PC-TOOTH-100G',
    categoryId: 'seed_cat_personal_care',
    price: '120.00',
    cost: '98.00',
    openingQty: 70,
  },
  {
    id: 'seed_prod_biscuits_300g',
    name: 'Olympic Biscuits 300g',
    sku: 'SNK-BISC-300G',
    categoryId: 'seed_cat_grocery',
    price: '90.00',
    cost: '72.00',
    openingQty: 80,
  },
  {
    id: 'seed_prod_eggs_12',
    name: 'Eggs (12 pcs)',
    sku: 'GRO-EGG-12',
    categoryId: 'seed_cat_grocery',
    price: '150.00',
    cost: '132.00',
    openingQty: 60,
  },
  {
    id: 'seed_prod_salt_1kg',
    name: 'Pran Salt 1kg',
    sku: 'GRO-SALT-1KG',
    categoryId: 'seed_cat_grocery',
    price: '42.00',
    cost: '34.00',
    openingQty: 90,
  },
];

const customers = [
  {
    id: 'seed_cust_rahim',
    name: 'Rahim Uddin',
    phone: '+8801700000001',
    email: 'rahim.uddin@example.com',
    address: 'Mirpur 10, Dhaka',
  },
  {
    id: 'seed_cust_fatema',
    name: 'Fatema Begum',
    phone: '+8801700000002',
    email: 'fatema.begum@example.com',
    address: 'Dhanmondi 27, Dhaka',
  },
  {
    id: 'seed_cust_karim',
    name: 'Karim Hossain',
    phone: '+8801700000003',
    email: null,
    address: 'Uttara Sector 7, Dhaka',
  },
  {
    id: 'seed_cust_nusrat',
    name: 'Nusrat Jahan',
    phone: '+8801700000004',
    email: 'nusrat.jahan@example.com',
    address: 'Bashundhara R/A, Dhaka',
  },
  {
    id: 'seed_cust_jamal',
    name: 'Jamal Ahmed',
    phone: '+8801700000005',
    email: null,
    address: 'Mohammadpur, Dhaka',
  },
  {
    id: 'seed_cust_shila',
    name: 'Shila Das',
    phone: '+8801700000006',
    email: 'shila.das@example.com',
    address: 'Wari, Dhaka',
  },
];

const suppliers = [
  {
    id: 'seed_sup_meghna',
    name: 'Meghna Distribution',
    phone: '+8801800000001',
    email: 'sales@meghna-distribution.example',
    address: 'Tejgaon Industrial Area, Dhaka',
  },
  {
    id: 'seed_sup_dhaka_wholesale',
    name: 'Dhaka Wholesale Traders',
    phone: '+8801800000002',
    email: 'orders@dhaka-wholesale.example',
    address: 'Karwan Bazar, Dhaka',
  },
  {
    id: 'seed_sup_fresh_foods',
    name: 'Fresh Foods Ltd.',
    phone: '+8801800000003',
    email: 'supply@freshfoods.example',
    address: 'Savar, Dhaka',
  },
];

const sales = [
  {
    id: 'seed_sale_1',
    invoiceNo: 'INV-SEED-0001',
    customerId: 'seed_cust_rahim',
    createdAt: new Date('2026-10-03T10:15:00.000Z'),
    items: [
      { productId: 'seed_prod_rice_5kg', quantity: 2 },
      { productId: 'seed_prod_masoor_dal_1kg', quantity: 1 },
      { productId: 'seed_prod_soybean_oil_1l', quantity: 2 },
    ],
    payments: [{ amount: '1475.00', method: 'CASH' as const, reference: 'Counter 1' }],
  },
  {
    id: 'seed_sale_2',
    invoiceNo: 'INV-SEED-0002',
    customerId: 'seed_cust_fatema',
    createdAt: new Date('2026-10-08T12:40:00.000Z'),
    items: [
      { productId: 'seed_prod_tea_400g', quantity: 1 },
      { productId: 'seed_prod_milk_powder_500g', quantity: 1 },
      { productId: 'seed_prod_biscuits_300g', quantity: 2 },
    ],
    payments: [{ amount: '500.00', method: 'BKASH' as const, reference: 'BKASH-889201' }],
  },
  {
    id: 'seed_sale_3',
    invoiceNo: 'INV-SEED-0003',
    customerId: 'seed_cust_karim',
    createdAt: new Date('2026-10-12T16:05:00.000Z'),
    items: [
      { productId: 'seed_prod_soap_100g', quantity: 4 },
      { productId: 'seed_prod_detergent_1kg', quantity: 2 },
      { productId: 'seed_prod_toothpaste_100g', quantity: 2 },
    ],
    payments: [{ amount: '1120.00', method: 'BKASH' as const, reference: 'BKASH-889477' }],
  },
  {
    id: 'seed_sale_4',
    invoiceNo: 'INV-SEED-0004',
    customerId: 'seed_cust_nusrat',
    createdAt: new Date('2026-10-18T09:20:00.000Z'),
    items: [
      { productId: 'seed_prod_eggs_12', quantity: 2 },
      { productId: 'seed_prod_salt_1kg', quantity: 3 },
      { productId: 'seed_prod_rice_5kg', quantity: 1 },
    ],
    payments: [],
  },
  {
    id: 'seed_sale_5',
    invoiceNo: 'INV-SEED-0005',
    customerId: 'seed_cust_jamal',
    createdAt: new Date('2026-10-23T15:30:00.000Z'),
    items: [
      { productId: 'seed_prod_soybean_oil_1l', quantity: 1 },
      { productId: 'seed_prod_sugar_1kg', quantity: 2 },
      { productId: 'seed_prod_tea_400g', quantity: 1 },
    ],
    payments: [
      { amount: '400.00', method: 'CASH' as const, reference: null },
      { amount: '350.00', method: 'NAGAD' as const, reference: 'NAGAD-552013' },
    ],
  },
  {
    id: 'seed_sale_6',
    invoiceNo: 'INV-SEED-0006',
    customerId: 'seed_cust_rahim',
    createdAt: new Date('2026-10-28T11:10:00.000Z'),
    items: [
      { productId: 'seed_prod_rice_5kg', quantity: 1 },
      { productId: 'seed_prod_soap_100g', quantity: 2 },
    ],
    payments: [{ amount: '610.00', method: 'CARD' as const, reference: 'CARD-7712' }],
  },
];

async function main() {
  const productById = new Map(products.map((product) => [product.id, product]));

  await prisma.$transaction(
    async (tx) => {
      // Rebase the seed-generated sales first. Stock may also include non-seed
      // sales, so add the previous seed quantities back instead of resetting an
      // absolute stock level. This keeps the script repeatable without deleting
      // data created outside the seed.
      const existingSeedItems = await tx.saleItem.findMany({
        where: { saleId: { startsWith: SEED_PREFIX } },
        select: { productId: true, quantity: true },
      });

      const returnedQuantities = new Map<string, number>();

      for (const item of existingSeedItems) {
        returnedQuantities.set(
          item.productId,
          (returnedQuantities.get(item.productId) ?? 0) + item.quantity,
        );
      }

      for (const [productId, quantity] of returnedQuantities) {
        await tx.product.updateMany({
          where: { id: productId },
          data: { stockQty: { increment: quantity } },
        });
      }

      await tx.payment.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
      await tx.inventoryMovement.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
      await tx.saleItem.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });
      await tx.sale.deleteMany({ where: { id: { startsWith: SEED_PREFIX } } });

      for (const category of categories) {
        const { id, ...data } = category;

        await tx.category.upsert({
          where: { id },
          create: { id, ...data },
          update: data,
        });
      }

      for (const customer of customers) {
        const { id, ...data } = customer;

        await tx.customer.upsert({
          where: { id },
          create: { id, ...data },
          update: data,
        });
      }

      for (const supplier of suppliers) {
        const { id, ...data } = supplier;

        await tx.supplier.upsert({
          where: { id },
          create: { id, ...data },
          update: data,
        });
      }

      for (const product of products) {
        const { id, openingQty, ...data } = product;

        await tx.product.upsert({
          where: { id },
          create: { id, ...data, stockQty: openingQty },
          update: data,
        });
      }

      for (const product of products) {
        const id = `seed_move_opening_${product.id.replace('seed_prod_', '')}`;
        const data = {
          productId: product.id,
          type: 'OPENING' as const,
          quantity: product.openingQty,
          referenceId: null,
          createdAt: new Date('2026-09-30T06:00:00.000Z'),
        };

        await tx.inventoryMovement.upsert({
          where: { id },
          create: { id, ...data },
          update: data,
        });
      }

      for (const sale of sales) {
        const lines = sale.items.map((item) => {
          const product = productById.get(item.productId);

          if (!product) {
            throw new Error(`Seed product not found: ${item.productId}`);
          }

          const unitPrice = new Decimal(product.price);
          const lineTotal = unitPrice.times(item.quantity);

          return {
            ...item,
            unitPrice,
            lineTotal,
          };
        });

        const totalAmount = lines.reduce(
          (total, line) => total.plus(line.lineTotal),
          new Decimal('0.00'),
        );

        const paidAmount = sale.payments.reduce(
          (total, payment) => total.plus(payment.amount),
          new Decimal('0.00'),
        );

        const status = paidAmount.eq(0)
          ? ('PENDING' as const)
          : paidAmount.gte(totalAmount)
            ? ('PAID' as const)
            : ('PARTIALLY_PAID' as const);

        await tx.sale.create({
          data: {
            id: sale.id,
            invoiceNo: sale.invoiceNo,
            customerId: sale.customerId,
            totalAmount: totalAmount.toFixed(2),
            paidAmount: paidAmount.toFixed(2),
            status,
            createdAt: sale.createdAt,
            updatedAt: sale.createdAt,
            items: {
              create: lines.map((line) => ({
                id: `${sale.id}_item_${line.productId.replace('seed_prod_', '')}`,
                productId: line.productId,
                quantity: line.quantity,
                unitPrice: line.unitPrice.toFixed(2),
                lineTotal: line.lineTotal.toFixed(2),
                createdAt: sale.createdAt,
              })),
            },
            payments: {
              create: sale.payments.map((payment, index) => ({
                id: `${sale.id}_payment_${index + 1}`,
                amount: payment.amount,
                method: payment.method,
                reference: payment.reference,
                paidAt: sale.createdAt,
                createdAt: sale.createdAt,
              })),
            },
          },
        });

        await tx.inventoryMovement.createMany({
          data: lines.map((line) => ({
            id: `seed_move_${sale.id.replace('seed_', '')}_${line.productId.replace('seed_prod_', '')}`,
            productId: line.productId,
            type: 'SALE' as const,
            quantity: -line.quantity,
            referenceId: sale.id,
            createdAt: sale.createdAt,
          })),
        });

        for (const line of lines) {
          await tx.product.update({
            where: { id: line.productId },
            data: { stockQty: { decrement: line.quantity } },
          });
        }
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  );

  const [
    categoryCount,
    productCount,
    customerCount,
    supplierCount,
    saleCount,
    itemCount,
    paymentCount,
    movementCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.customer.count(),
    prisma.supplier.count(),
    prisma.sale.count(),
    prisma.saleItem.count(),
    prisma.payment.count(),
    prisma.inventoryMovement.count(),
  ]);

  console.log('Seed complete:');
  console.table({
    categories: categoryCount,
    products: productCount,
    customers: customerCount,
    suppliers: supplierCount,
    sales: saleCount,
    saleItems: itemCount,
    payments: paymentCount,
    inventoryMovements: movementCount,
  });
}

main()
  .catch((error: unknown) => {
    console.error('Seed failed:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
