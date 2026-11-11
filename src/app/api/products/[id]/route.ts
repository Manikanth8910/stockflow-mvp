import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findFirst({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
    });
    const defaultThreshold = org?.defaultLowStockThreshold ?? 5;
    const effectiveThreshold = product.lowStockThreshold !== null ? product.lowStockThreshold : defaultThreshold;

    return NextResponse.json({
      product: {
        ...product,
        effectiveThreshold,
        isLowStock: product.quantityOnHand <= effectiveThreshold,
      },
    });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify product belongs to user's organization
    const existing = await prisma.product.findFirst({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await req.json();
    const { name, sku, description, quantityOnHand, costPrice, sellingPrice, lowStockThreshold } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!sku || typeof sku !== 'string' || !sku.trim()) {
      return NextResponse.json({ error: 'SKU is required' }, { status: 400 });
    }

    const trimmedSku = sku.trim().toUpperCase();

    // If SKU changed, check uniqueness within org
    if (trimmedSku !== existing.sku) {
      const duplicateSku = await prisma.product.findUnique({
        where: {
          organizationId_sku: {
            organizationId: session.organizationId,
            sku: trimmedSku,
          },
        },
      });

      if (duplicateSku) {
        return NextResponse.json(
          { error: `SKU "${trimmedSku}" is already in use by another product` },
          { status: 409 }
        );
      }
    }

    const qty = quantityOnHand !== undefined && quantityOnHand !== '' ? parseInt(quantityOnHand, 10) : existing.quantityOnHand;
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
      return NextResponse.json({ error: 'Low stock threshold must be a non-negative integer' }, { status: 400 });
    }

    // Record stock adjustment log if quantity changed
    const quantityDifference = qty - existing.quantityOnHand;
    if (quantityDifference !== 0) {
      await prisma.stockAdjustmentLog.create({
        data: {
          organizationId: session.organizationId,
          productId: existing.id,
          quantityChange: quantityDifference,
          previousQuantity: existing.quantityOnHand,
          newQuantity: qty,
          note: 'Direct edit in product form',
          adjustedBy: session.email,
        },
      });
    }

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: {
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

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.product.findFirst({
      where: {
        id: params.id,
        organizationId: session.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
