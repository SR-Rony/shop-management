import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Use the DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const customers = await prisma.customer.findMany({ select: { id: true, phone: true, name: true } });
  console.log('Customer count:', customers.length);
  const phoneSet = new Set();
  const duplicates = new Set();
  customers.forEach(c => {
    console.log(c.id, '|', c.phone, '|', c.name);
    if (phoneSet.has(c.phone)) {
      duplicates.add(c.phone);
    }
    phoneSet.add(c.phone);
  });
  if (duplicates.size > 0) {
    console.log('Duplicate phones found:', Array.from(duplicates));
  }
  await prisma.$disconnect();
}
main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
