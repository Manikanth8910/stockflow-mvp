import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword, signToken, TOKEN_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, organizationName, name } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const orgNameTrimmed = organizationName ? organizationName.trim() : '';
    if (organizationName && orgNameTrimmed.length < 2) {
      return NextResponse.json(
        { error: 'Organization name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: emailTrimmed },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // If organizationName provided, create both atomically in a transaction
    if (orgNameTrimmed) {
      const result = await prisma.$transaction(async (tx) => {
        const org = await tx.organization.create({
          data: {
            name: orgNameTrimmed,
            defaultLowStockThreshold: 5,
          },
        });

        const user = await tx.user.create({
          data: {
            email: emailTrimmed,
            passwordHash,
            name: name ? name.trim() : emailTrimmed.split('@')[0],
            organizationId: org.id,
          },
        });

        return { user, org };
      });

      const token = signToken({
        userId: result.user.id,
        email: result.user.email,
        organizationId: result.org.id,
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          organizationId: result.org.id,
          organizationName: result.org.name,
          defaultLowStockThreshold: result.org.defaultLowStockThreshold,
        },
      });

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
    }

    // Otherwise, create user account first; user can create organization once signed in
    const user = await prisma.user.create({
      data: {
        email: emailTrimmed,
        passwordHash,
        name: name ? name.trim() : emailTrimmed.split('@')[0],
        organizationId: null,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      organizationId: null,
    });

    const response = NextResponse.json({
      success: true,
      needsOrganization: true,
      redirectTo: '/organizations/new',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        organizationId: null,
        organizationName: null,
      },
    });

    response.cookies.set({
      name: TOKEN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
