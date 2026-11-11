import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !session.organizationId) {
    return NextResponse.json({ error: 'Unauthorized or no active organization' }, { status: 401 });
  }

  try {
    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
    });

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const defaultThreshold = org.defaultLowStockThreshold ?? 5;

    // Fetch all products for the tenant
    const products = await prisma.product.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    const totalProducts = products.length;
    let totalQuantityOnHand = 0;
    let totalInventoryValuation = 0;
    const lowStockProducts: any[] = [];

    for (const p of products) {
      totalQuantityOnHand += p.quantityOnHand;
      if (p.sellingPrice) {
        totalInventoryValuation += p.quantityOnHand * p.sellingPrice;
      }

      const effectiveThreshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold;
      const isLowStock = p.quantityOnHand <= effectiveThreshold;

      if (isLowStock) {
        lowStockProducts.push({
          ...p,
          effectiveThreshold,
          isLowStock: true,
        });
      }
    }

    // Sort low stock by most critical first (lowest quantity relative to threshold)
    lowStockProducts.sort((a, b) => a.quantityOnHand - b.quantityOnHand);

    return NextResponse.json({
      metrics: {
        totalProducts,
        totalQuantityOnHand,
        totalLowStockItems: lowStockProducts.length,
        totalInventoryValuation: Math.round(totalInventoryValuation * 100) / 100,
      },
      lowStockProducts,
      organization: {
        id: org.id,
        name: org.name,
        defaultLowStockThreshold: defaultThreshold,
      },
    });
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ error: 'Failed to load dashboard metrics' }, { status: 500 });
  }
}
