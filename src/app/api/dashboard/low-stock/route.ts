import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !session.organizationId) {
    return NextResponse.json({ error: 'Unauthorized or no active organization' }, { status: 401 });
  }

  try {
    const [org, products] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: session.organizationId },
        select: { defaultLowStockThreshold: true },
      }),
      prisma.product.findMany({
        where: { organizationId: session.organizationId },
        orderBy: { quantityOnHand: 'asc' },
      }),
    ]);

    if (!org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const defaultThreshold = org.defaultLowStockThreshold ?? 5;

    const lowStockProducts = products
      .map((p) => {
        const threshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold;
        return {
          ...p,
          effectiveThreshold: threshold,
          isLowStock: p.quantityOnHand <= threshold,
        };
      })
      .filter((p) => p.isLowStock);

    return NextResponse.json({
      lowStockProducts,
      count: lowStockProducts.length,
      defaultThreshold,
    });
  } catch (error: any) {
    console.error('Error fetching low-stock products:', error);
    return NextResponse.json({ error: 'Failed to fetch low-stock products' }, { status: 500 });
  }
}
