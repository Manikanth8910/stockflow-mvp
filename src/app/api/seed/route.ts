import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

const DEMO_PRODUCTS = [
  {
    name: 'Wireless Ergonomic Mouse',
    sku: 'DEMO-MSE-01',
    description: '2.4GHz rechargeable wireless mouse with optical tracking',
    quantityOnHand: 28,
    costPrice: 18.5,
    sellingPrice: 39.99,
    lowStockThreshold: 5,
  },
  {
    name: 'USB-C Braided Cable (2m)',
    sku: 'DEMO-CAB-02',
    description: 'Heavy-duty 100W PD charging cable',
    quantityOnHand: 3, // LOW STOCK
    costPrice: 3.2,
    sellingPrice: 12.99,
    lowStockThreshold: 10,
  },
  {
    name: 'Mechanical Keyboard (RGB)',
    sku: 'DEMO-KBD-03',
    description: 'Hot-swappable brown switch mechanical gaming keyboard',
    quantityOnHand: 14,
    costPrice: 42.0,
    sellingPrice: 89.99,
    lowStockThreshold: 5,
  },
  {
    name: 'Active Noise-Cancelling Headphones',
    sku: 'DEMO-AUD-04',
    description: 'Over-ear Bluetooth headphones with 30h battery life',
    quantityOnHand: 2, // LOW STOCK
    costPrice: 65.0,
    sellingPrice: 149.99,
    lowStockThreshold: 5,
  },
  {
    name: 'Aluminum Laptop Stand Riser',
    sku: 'DEMO-LST-05',
    description: 'Ergonomic heat-dissipation riser for 11-17 inch laptops',
    quantityOnHand: 0, // OUT OF STOCK
    costPrice: 12.5,
    sellingPrice: 29.99,
    lowStockThreshold: 8,
  },
  {
    name: '4K Ultra HD Webcam with Mic',
    sku: 'DEMO-CAM-06',
    description: 'Wide-angle autofocus webcam with privacy shutter',
    quantityOnHand: 45,
    costPrice: 32.0,
    sellingPrice: 69.99,
    lowStockThreshold: null, // Uses org default
  },
  {
    name: 'Fast Wireless Charging Pad 15W',
    sku: 'DEMO-PWR-07',
    description: 'Qi-certified slim fast charger with LED indicator',
    quantityOnHand: 4, // LOW STOCK (4 <= default 5)
    costPrice: 8.0,
    sellingPrice: 21.99,
    lowStockThreshold: null,
  },
];

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let createdCount = 0;
    for (const item of DEMO_PRODUCTS) {
      // Upsert by orgId + sku
      const existing = await prisma.product.findUnique({
        where: {
          organizationId_sku: {
            organizationId: session.organizationId,
            sku: item.sku,
          },
        },
      });

      if (!existing) {
        await prisma.product.create({
          data: {
            ...item,
            organizationId: session.organizationId,
            lastUpdatedBy: session.email,
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdCount} sample products into ${session.organizationName}.`,
    });
  } catch (error: any) {
    console.error('Error seeding demo data:', error);
    return NextResponse.json({ error: 'Failed to seed sample data' }, { status: 500 });
  }
}
