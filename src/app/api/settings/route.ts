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

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        defaultLowStockThreshold: org.defaultLowStockThreshold,
        createdAt: org.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session || !session.organizationId) {
    return NextResponse.json({ error: 'Unauthorized or no active organization' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { defaultLowStockThreshold, name } = body;

    const updateData: any = {};

    if (defaultLowStockThreshold !== undefined) {
      const parsed = parseInt(defaultLowStockThreshold, 10);
      if (isNaN(parsed) || parsed < 0) {
        return NextResponse.json(
          { error: 'Default low stock threshold must be a non-negative integer' },
          { status: 400 }
        );
      }
      updateData.defaultLowStockThreshold = parsed;
    }

    if (name !== undefined) {
      const trimmed = name.trim();
      if (trimmed.length < 2) {
        return NextResponse.json(
          { error: 'Organization name must be at least 2 characters' },
          { status: 400 }
        );
      }
      updateData.name = trimmed;
    }

    const updatedOrg = await prisma.organization.update({
      where: { id: session.organizationId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: updatedOrg.id,
        name: updatedOrg.name,
        defaultLowStockThreshold: updatedOrg.defaultLowStockThreshold,
      },
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
