import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: Params) {
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

    const body = await req.json();
    const { adjustment, note } = body;

    const delta = parseInt(adjustment, 10);
    if (isNaN(delta) || delta === 0) {
      return NextResponse.json(
        { error: 'Stock adjustment must be a non-zero integer (e.g. +5 or -3)' },
        { status: 400 }
      );
    }

    const newQuantity = existing.quantityOnHand + delta;
    if (newQuantity < 0) {
      return NextResponse.json(
        {
          error: `Adjustment would result in negative stock. Current quantity: ${existing.quantityOnHand}, requested change: ${delta}`,
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedProduct = await tx.product.update({
        where: { id: existing.id },
        data: {
          quantityOnHand: newQuantity,
          lastUpdatedBy: session.email,
        },
      });

      const log = await tx.stockAdjustmentLog.create({
        data: {
          organizationId: session.organizationId,
          productId: existing.id,
          quantityChange: delta,
          previousQuantity: existing.quantityOnHand,
          newQuantity: newQuantity,
          note: note?.trim() || null,
          adjustedBy: session.email,
        },
      });

      return { product: updatedProduct, log };
    });

    return NextResponse.json({
      success: true,
      product: result.product,
      log: result.log,
      message: `Stock successfully adjusted by ${delta > 0 ? '+' + delta : delta} units. New quantity: ${newQuantity}`,
    });
  } catch (error: any) {
    console.error('Error adjusting stock:', error);
    return NextResponse.json({ error: 'Failed to adjust stock' }, { status: 500 });
  }
}
