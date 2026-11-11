import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSessionUser, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

/**
 * GET /api/organizations
 * Retrieve the current active organization and any organizations associated with the signed-in user.
 * Requirement: User must be signed in.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. You must be signed in to view organizations.' },
        { status: 401 }
      );
    }

    if (!session.organizationId) {
      return NextResponse.json({
        organization: null,
        message: 'No active organization. Please create an organization.',
      });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.organizationId },
      include: {
        _count: {
          select: { products: true, users: true },
        },
      },
    });

    if (!org) {
      return NextResponse.json({ organization: null });
    }

    return NextResponse.json({
      organization: {
        id: org.id,
        name: org.name,
        defaultLowStockThreshold: org.defaultLowStockThreshold,
        totalProducts: org._count.products,
        totalUsers: org._count.users,
        createdAt: org.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching organizations' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/organizations
 * Create a new organization and associate the signed-in user with it.
 * Requirement: User MUST be signed in.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Enforce authentication: User must be signed in
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required. You must be signed in to create an organization.' },
        { status: 401 }
      );
    }

    // 2. Validate request payload
    const body = await req.json().catch(() => ({}));
    const { name, defaultLowStockThreshold } = body;

    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Organization name is required.' },
        { status: 400 }
      );
    }

    const orgNameTrimmed = name.trim();
    if (orgNameTrimmed.length < 2) {
      return NextResponse.json(
        { error: 'Organization name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    let threshold = 5;
    if (defaultLowStockThreshold !== undefined && defaultLowStockThreshold !== null) {
      const parsed = parseInt(String(defaultLowStockThreshold), 10);
      if (isNaN(parsed) || parsed < 0) {
        return NextResponse.json(
          { error: 'Default low stock threshold must be a valid non-negative integer.' },
          { status: 400 }
        );
      }
      threshold = parsed;
    }

    // 3. Database transaction: create organization and link the signed-in user atomically
    const result = await prisma.$transaction(async (tx) => {
      // Create new organization with isolated tenant ID
      const newOrg = await tx.organization.create({
        data: {
          name: orgNameTrimmed,
          defaultLowStockThreshold: threshold,
        },
      });

      // Update signed-in user to be associated with this organization
      const updatedUser = await tx.user.update({
        where: { id: session.id },
        data: {
          organizationId: newOrg.id,
        },
      });

      return { newOrg, updatedUser };
    });

    // 4. Issue updated JWT token containing new organizationId
    const token = signToken({
      userId: session.id,
      email: session.email,
      organizationId: result.newOrg.id,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: `Organization "${result.newOrg.name}" created successfully.`,
        organization: {
          id: result.newOrg.id,
          name: result.newOrg.name,
          defaultLowStockThreshold: result.newOrg.defaultLowStockThreshold,
          createdAt: result.newOrg.createdAt.toISOString(),
        },
        user: {
          id: result.updatedUser.id,
          email: result.updatedUser.email,
          name: result.updatedUser.name,
          organizationId: result.newOrg.id,
          organizationName: result.newOrg.name,
        },
      },
      { status: 201 }
    );

    // 5. Update session cookie
    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: 'Internal server error creating organization' },
      { status: 500 }
    );
  }
}
