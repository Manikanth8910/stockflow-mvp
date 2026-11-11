import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !session.organizationId) {
    return NextResponse.json({ error: 'Unauthorized or no active organization' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';
  const filter = searchParams.get('filter')?.trim() || 'all'; // all | low-stock | in-stock

  try {
    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
    });

    const defaultThreshold = org?.defaultLowStockThreshold ?? 5;

    // Multi-tenant query: strictly scoped by organizationId
    const whereClause: any = {
      organizationId: session.organizationId,
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }

    const rawProducts = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const products = rawProducts.map((p) => {
      const effectiveThreshold = p.lowStockThreshold !== null ? p.lowStockThreshold : defaultThreshold;
      const isLowStock = p.quantityOnHand <= effectiveThreshold;
      return {
        ...p,
        effectiveThreshold,
        isLowStock,
      };
    });

    let filteredProducts = products;
    if (filter === 'low-stock') {
      filteredProducts = products.filter((p) => p.isLowStock);
    } else if (filter === 'in-stock') {
      filteredProducts = products.filter((p) => !p.isLowStock);
    }

    return NextResponse.json({
      products: filteredProducts,
      defaultLowStockThreshold: defaultThreshold,
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !session.organizationId) {
    return NextResponse.json({ error: 'Unauthorized or no active organization' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
    }

    const trimmedSku = sku.trim().toUpperCase();

    // Check SKU uniqueness within organization
    const existing = await prisma.product.findUnique({
      where: {
        organizationId_sku: {
          organizationId: session.organizationId,
          sku: trimmedSku,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `SKU "${trimmedSku}" already exists in your organization` },
        { status: 409 }
      );
    }

    const qty = quantityOnHand !== undefined && quantityOnHand !== '' ? parseInt(quantityOnHand, 10) : 0;
    if (isNaN(qty) || qty < 0) {
      return NextResponse.json({ error: 'Quantity on hand must be a non-negative integer' }, { status: 400 });
    }

    const parsedCost =
      costPrice !== undefined && costPrice !== '' && costPrice !== null
        ? parseFloat(costPrice)
        : null;
    if (parsedCost !== null && (isNaN(parsedCost) || parsedCost < 0)) {
      return NextResponse.json({ error: 'Cost price must be a valid positive number' }, { status: 400 });
    }

    const parsedSelling =
      sellingPrice !== undefined && sellingPrice !== '' && sellingPrice !== null
        ? parseFloat(sellingPrice)
        : null;
    if (parsedSelling !== null && (isNaN(parsedSelling) || parsedSelling < 0)) {
      return NextResponse.json({ error: 'Selling price must be a valid positive number' }, { status: 400 });
    }

    const parsedThreshold =
      lowStockThreshold !== undefined && lowStockThreshold !== '' && lowStockThreshold !== null
        ? parseInt(lowStockThreshold, 10)
        : null;
    if (parsedThreshold !== null && (isNaN(parsedThreshold) || parsedThreshold < 0)) {
      return NextResponse.json({ error: 'Low stock threshold must be a valid non-negative integer' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        organizationId: session.organizationId,
        name: name.trim(),
        sku: trimmedSku,
        description: description?.trim() || null,
        quantityOnHand: qty,
        costPrice: parsedCost,
        sellingPrice: parsedSelling,
        lowStockThreshold: parsedThreshold,
        lastUpdatedBy: session.email,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
