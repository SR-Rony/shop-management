import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { phone: '+8801700000000' }
  });
  console.log('Admin found:', !!user);
  if (user) {
    console.log('ID:', user.id);
    console.log('Phone:', user.phone);
    console.log('Role:', user.role);
    console.log('Name:', user.name);
    console.log('Active:', user.isActive);
  }
  await prisma.$disconnect();
}
main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
