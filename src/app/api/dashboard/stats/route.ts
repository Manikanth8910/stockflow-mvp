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

    const products = await prisma.product.findMany({
      where: { organizationId: session.organizationId },
    });

    let totalUnitsInStock = 0;
    let lowStockProductsCount = 0;
    let totalValuation = 0;

    for (const p of products) {
      totalUnitsInStock += p.quantityOnHand;
      if (p.sellingPrice) {
        totalValuation += p.quantityOnHand * p.sellingPrice;
      }
      const threshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold;
      if (p.quantityOnHand <= threshold) {
        lowStockProductsCount++;
      }
    }

    return NextResponse.json({
      totalProducts: products.length,
      totalUnitsInStock,
      lowStockProductsCount,
      totalValuation: Math.round(totalValuation * 100) / 100,
      organizationName: org.name,
      defaultThreshold,
    });
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
