const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database...');

  // Clean up existing demo data
  await prisma.stockAdjustmentLog.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create Demo Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Retail Solutions',
      defaultLowStockThreshold: 5,
    },
  });

  // Create Demo User
  const passwordHash = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@stockflow.io',
      name: 'Alex Johnson',
      passwordHash,
      organizationId: org.id,
    },
  });

  // Create Sample Products
  const products = [
    {
      name: 'Wireless Ergonomic Mouse',
      sku: 'TECH-MSE-01',
      description: '2.4GHz rechargeable wireless mouse with optical tracking',
      quantityOnHand: 28,
      costPrice: 18.5,
      sellingPrice: 39.99,
      lowStockThreshold: 5,
    },
    {
      name: 'USB-C Braided Cable (2m)',
      sku: 'CAB-USBC-02',
      description: 'Heavy-duty 100W PD charging cable',
      quantityOnHand: 3, // LOW STOCK
      costPrice: 3.2,
      sellingPrice: 12.99,
      lowStockThreshold: 10,
    },
    {
      name: 'Mechanical Keyboard (RGB)',
      sku: 'TECH-KBD-03',
      description: 'Hot-swappable brown switch mechanical gaming keyboard',
      quantityOnHand: 14,
      costPrice: 42.0,
      sellingPrice: 89.99,
      lowStockThreshold: 5,
    },
    {
      name: 'Active Noise-Cancelling Headphones',
      sku: 'AUD-NCH-04',
      description: 'Over-ear Bluetooth headphones with 30h battery life',
      quantityOnHand: 2, // LOW STOCK
      costPrice: 65.0,
      sellingPrice: 149.99,
      lowStockThreshold: 5,
    },
    {
      name: 'Adjustable Aluminum Laptop Stand',
      sku: 'ACC-LST-05',
      description: 'Ergonomic heat-dissipation riser for 11-17 inch laptops',
      quantityOnHand: 0, // CRITICAL OUT OF STOCK
      costPrice: 12.5,
      sellingPrice: 29.99,
      lowStockThreshold: 8,
    },
    {
      name: '4K Ultra HD Webcam with Mic',
      sku: 'CAM-UHD-06',
      description: 'Wide-angle autofocus webcam with privacy shutter',
      quantityOnHand: 45,
      costPrice: 32.0,
      sellingPrice: 69.99,
      lowStockThreshold: null, // Uses org default (5)
    },
    {
      name: 'Fast Wireless Charging Pad 15W',
      sku: 'PWR-WCP-07',
      description: 'Qi-certified slim fast charger with LED indicator',
      quantityOnHand: 4, // LOW STOCK (4 <= org default 5)
      costPrice: 8.0,
      sellingPrice: 21.99,
      lowStockThreshold: null, // Uses org default (5)
    },
  ];

  for (const item of products) {
    await prisma.product.create({
      data: {
        ...item,
        organizationId: org.id,
        lastUpdatedBy: user.email,
      },
    });
  }

  console.log(`Database seeded successfully!`);
  console.log(`Organization: ${org.name} (${org.id})`);
  console.log(`Demo User: ${user.email} / password123`);
  console.log(`Created ${products.length} demo products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
