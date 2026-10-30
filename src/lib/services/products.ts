import 'server-only';

import type { ProductGetPayload } from '@/generated/prisma/models';
import { prisma } from '@/lib/db/prisma';
import { NotFoundError } from '@/lib/errors/app-error';

type ProductWithCategory = ProductGetPayload<{
  include: { category: { select: { id: true; name: true } } };
}>;

function serializeProduct(product: ProductWithCategory) {
  return {
    ...product,
    price: product.price.toFixed(2),
    cost: product.cost.toFixed(2),
  };
}

export async function listProducts(categoryId?: string) {
  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: { category: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });

  return products.map(serializeProduct);
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: { select: { id: true, name: true } } },
  });

  if (!product) {
    throw new NotFoundError('Product not found.');
  }

  return serializeProduct(product);
}
