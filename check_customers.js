import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const p = new PrismaClient({ adapter });
p.customer.findMany({ select: { id: true, phone: true, name: true } }).then(rows => {
  console.log('CUSTOMER_COUNT=' + rows.length);
  const map = {};
  for (const r of rows) { map[r.phone] = (map[r.phone]||0) + 1; }
  const dupes = Object.entries(map).filter(([,c]) => c > 1);
  console.log('DUPLICATE_PHONES=' + JSON.stringify(dupes));
  console.log('ROWS:');
  rows.slice(0, 8).forEach(r => console.log('  ' + r.id + ' | ' + r.phone + ' | ' + r.name));
  process.exit(0);
}).catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
